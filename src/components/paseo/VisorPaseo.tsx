"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// Solo el tipo: se borra al compilar y no arrastra la librería al paquete.
import type { Viewer } from "@photo-sphere-viewer/core";
import type { EscenaPaseo } from "@/lib/paseo/getPaseo";
import { MenuEspacios } from "./MenuEspacios";

// Los estilos sí van arriba, aunque la librería se cargue dentro del efecto:
// son unos pocos KB y viajan con el trozo de esta página, no con el sitio.
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";

/**
 * El visor 360° del paseo virtual.
 *
 * ## Por qué se carga a mano dentro de un efecto
 *
 * Photo Sphere Viewer y Three.js suman cerca de 600 KB y tocan `window` al
 * cargarse. Importarlos arriba del archivo los metería en el paquete de la
 * página y rompería el pintado en el servidor. Con el `import()` de dentro del
 * efecto, solo se descargan cuando alguien abre el paseo — que es una página de
 * las 117 del sitio.
 *
 * ## Las tres cosas que costaron encontrarse (2026-09-19)
 *
 * 1. **`renderMode: '2d'`.** El modo `'3d'` pinta flechas en el suelo estilo
 *    Street View e **ignora la altura del punto**: en la vista aérea, donde
 *    todos los accesos están abajo, quedarían amontonados. Y el plugin solo
 *    acepta esos dos valores: con cualquier otro, revienta.
 * 2. **Los ángulos del tour viejo ya vienen convertidos** desde la base. krpano
 *    contaba la vertical hacia abajo y este visor la cuenta hacia arriba.
 * 3. **El zoom no va en grados.** `zoom(35)` no es un campo de visión de 35°,
 *    es un nivel del 0 al 100. Se convierte con `fovToZoomLevel`.
 */
/**
 * Lo que se le pasa al visor va a parar a un `innerHTML` suyo —el globo de
 * cada acceso y el pie de la barra— así que se escapa aquí.
 *
 * El panel ya guarda estos textos sin etiquetas, pero esta es la segunda
 * cerradura: cubre lo que ya estaba en la base desde la migración y lo que
 * entre por cualquier camino que todavía no existe.
 */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function VisorPaseo({ escenas }: { escenas: EscenaPaseo[] }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);
  const [entrando, setEntrando] = useState(true);
  const [actual, setActual] = useState<EscenaPaseo | null>(escenas[0] ?? null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [enVR, setEnVR] = useState(false);
  const cortar = useRef<() => void>(() => {});
  /** El plugin del recorrido, para poder saltar a un espacio desde el menú. */
  const recorrido = useRef<{ setCurrentNode: (id: string) => void } | null>(null);

  useEffect(() => {
    if (!contenedor.current || escenas.length === 0) return;

    const sinMovimiento =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let visor: { destroy: () => void } | null = null;
    let vivo = true;
    let primera = true;
    let vuelo: { cancel: () => void } | null = null;

    /** Corta el descenso en cuanto alguien toca la pantalla: manda el visitante. */
    const cortarVuelo = () => {
      vuelo?.cancel();
      vuelo = null;
      if (vivo) setEntrando(false);
    };

    /**
     * La entrada: el campus visto desde arriba y de lejos, y la cámara baja
     * hasta la vista con la que abría el tour.
     *
     * Es la «entrada aérea» de la propuesta. No hace falta ni un video ni una
     * imagen aparte: el descenso se hace **dentro de la propia fotografía**,
     * que ya está cargándose de todos modos. Y así el movimiento tapa el par
     * de segundos que tardan las seis caras en llegar.
     */
    const entrar = (v: Viewer, escena: EscenaPaseo) => {
      const destino = {
        yaw: `${escena.vista.yaw}deg`,
        pitch: `${escena.vista.pitch}deg`,
        zoom: v.dataHelper.fovToZoomLevel(escena.vista.fov),
      };

      // Quien pidió menos movimiento no recibe un descenso de cinco segundos.
      if (sinMovimiento) {
        v.rotate({ yaw: destino.yaw, pitch: destino.pitch });
        v.zoom(destino.zoom);
        setEntrando(false);
        return;
      }

      // Punto de partida: más arriba, más abierto y girado un poco, para que
      // el movimiento tenga dirección y no sea solo un acercamiento.
      v.rotate({ yaw: `${escena.vista.yaw - 25}deg`, pitch: "-70deg" });
      v.zoom(v.dataHelper.fovToZoomLevel(110));

      /**
       * `rpm` son **vueltas por minuto**: 9 rpm son 54 grados por segundo y el
       * descenso entero se acababa en menos de un segundo. A 1,5 rpm son unos
       * 9 grados por segundo, que sobre los ~45 grados del recorrido dan unos
       * cuatro segundos y medio: se ve el movimiento sin que nadie espere.
       */
      const animacion = v.animate({ ...destino, speed: "1.5rpm" });
      vuelo = animacion;
      Promise.resolve(animacion).then(() => {
        if (vivo && vuelo === animacion) {
          vuelo = null;
          setEntrando(false);
        }
      });
    };

    (async () => {
      try {
        const [
          { Viewer },
          { CubemapAdapter },
          { MarkersPlugin },
          { VirtualTourPlugin },
          { GyroscopePlugin },
          { StereoPlugin },
        ] = await Promise.all([
          import("@photo-sphere-viewer/core"),
          import("@photo-sphere-viewer/cubemap-adapter"),
          import("@photo-sphere-viewer/markers-plugin"),
          import("@photo-sphere-viewer/virtual-tour-plugin"),
          import("@photo-sphere-viewer/gyroscope-plugin"),
          import("@photo-sphere-viewer/stereo-plugin"),
        ]);

        // El componente puede haberse desmontado mientras cargaban las
        // librerías: montar el visor entonces deja un canvas huérfano.
        if (!vivo || !contenedor.current) return;

        const nodos = escenas.map((e) => ({
          id: e.slug,
          caption: escapar(e.titulo),
          thumbnail: `${e.imagenes}/thumbnail.webp`,
          panorama: {
            type: "separate" as const,
            /**
             * ⚠️ SIN ESTO, EL TECHO Y EL SUELO SALEN GIRADOS MEDIA VUELTA.
             *
             * Lo cazó Esteban el 2026-09-20 mirando hacia arriba: las cuatro
             * paredes encajaban y el cenit y el nadir, no. Las caras de arriba
             * y abajo que genera Panotour vienen rotadas 180° respecto a lo
             * que espera este visor, y el adaptador trae esta opción
             * justamente para eso.
             *
             * Comprobado contra el tour viejo en la misma escena y el mismo
             * ángulo: con la opción puesta, la claraboya de la biblioteca y el
             * parquet caen donde caían antes.
             *
             * No se nota en una vista aérea —el cielo es cielo en cualquier
             * orientación—, así que se ve mirando el techo de un interior.
             */
            flipTopBottom: true,
            paths: {
              front: `${e.imagenes}/front.webp`,
              right: `${e.imagenes}/right.webp`,
              back: `${e.imagenes}/back.webp`,
              left: `${e.imagenes}/left.webp`,
              top: `${e.imagenes}/top.webp`,
              bottom: `${e.imagenes}/bottom.webp`,
            },
          },
          links: e.puntos.map((p) => ({
            nodeId: p.destino,
            position: { yaw: `${p.yaw}deg`, pitch: `${p.pitch}deg` },
            name: escapar(p.etiqueta),
          })),
        }));

        /**
         * El giroscopio solo donde existe.
         *
         * En una computadora ese botón no hace absolutamente nada: se pulsa y
         * no pasa nada, sin aviso. Lo cazó Esteban el 2026-09-20 en la barra
         * del visor. Se muestra únicamente en dispositivos que se manejan con
         * el dedo y que informan de su orientación, o sea teléfonos y tabletas.
         *
         * El de pantalla completa sí funciona: lo que falla es el navegador
         * incrustado de la app, que bloquea esa función incluso en una página
         * vacía. Comprobado con una prueba suelta el 2026-09-20.
         *
         * El modo VR va en la misma condición: **necesita el giroscopio** para
         * seguir el movimiento de la cabeza, así que en una computadora sería
         * otro botón muerto. Además entra en pantalla completa al activarse.
         */
        const hayGiroscopio =
          window.matchMedia("(pointer: coarse)").matches && "DeviceOrientationEvent" in window;

        const v = new Viewer({
          container: contenedor.current,
          adapter: CubemapAdapter,
          defaultZoomLvl: 50,
          navbar: [
            "zoom",
            "move",
            ...(hayGiroscopio ? ["gyroscope", "stereo"] : []),
            "fullscreen",
          ],
          loadingTxt: "Cargando el campus…",
          // El visor viene en inglés: «Zoom out», «Move up», «Fullscreen».
          lang: {
            zoom: "Acercar o alejar",
            zoomOut: "Alejar",
            zoomIn: "Acercar",
            moveUp: "Mirar arriba",
            moveDown: "Mirar abajo",
            moveLeft: "Mirar a la izquierda",
            moveRight: "Mirar a la derecha",
            fullscreen: "Pantalla completa",
            menu: "Más opciones",
            close: "Cerrar",
            loading: "Cargando…",
            gyroscope: "Mover con el teléfono",
            stereo: "Ver con gafas VR",
            stereoNotification: "Toca la pantalla para salir del modo VR",
            pleaseRotate: "Gira el teléfono",
            tapToContinue: "y toca la pantalla para continuar",
            twoFingers: "Usa dos dedos para moverte",
            ctrlZoom: "Usa ctrl + rueda para acercar",
            loadError: "No se pudo cargar esta vista del campus",
            webglError: "Tu navegador no puede mostrar el recorrido 360°",
          },
          plugins: [
            MarkersPlugin,
            GyroscopePlugin,
            /**
             * El VR/Cardboard que promete la propuesta: parte la pantalla en
             * dos para meter el teléfono en unas gafas de cartón. Se apoya en
             * el giroscopio —el propio complemento lo exige— y por eso los dos
             * botones aparecen juntos o no aparece ninguno.
             */
            StereoPlugin,
            [
              VirtualTourPlugin,
              {
                positionMode: "manual",
                renderMode: "2d",
                // El tamaño de fábrica (80 px) tapa media pantalla en un
                // celular: la vista aérea tiene 12 accesos juntos sobre el
                // campus y se solapan entre ellos. Medido en 375 px.
                arrowStyle: { size: { width: 48, height: 48 } },
                /**
                 * El paso entre espacios: fundido suave y giro previo hacia el
                 * acceso que se pulsó, para que se entienda **hacia dónde** se
                 * está yendo. Es lo que la propuesta llama «transiciones».
                 */
                transitionOptions: {
                  showLoader: true,
                  speed: "12rpm",
                  effect: "fade",
                  rotation: true,
                },
              },
            ],
          ],
        });
        visor = v as unknown as { destroy: () => void };

        /**
         * Al entrar en VR, el visor ocupa la pantalla entera por nuestra
         * cuenta.
         *
         * El complemento pide pantalla completa al navegador, y **en el iPhone
         * eso no existe**: Safari no permite la pantalla completa de un
         * elemento, así que el modo VR quedaba dentro de la página, con la
         * barra de direcciones encima. Lo vio Esteban en su celular el
         * 2026-09-20. Estirar el marco a toda la ventana da el mismo resultado
         * sin depender de esa función.
         */
        const estereo = v.getPlugin(StereoPlugin) as InstanceType<typeof StereoPlugin>;
        estereo?.addEventListener("stereo-updated", ({ stereoEnabled }: { stereoEnabled: boolean }) => {
          if (vivo) setEnVR(stereoEnabled);
        });

        const tour = v.getPlugin(VirtualTourPlugin) as InstanceType<typeof VirtualTourPlugin>;
        recorrido.current = tour;

        // ⚠️ El oyente va ANTES de `setNodes`: el aviso del primer espacio se
        // dispara al cargarlo, y si se registra después no llega nunca. Con él
        // se perdía la entrada aérea entera, sin ningún error por consola.
        tour.addEventListener("node-changed", ({ node }: { node: { id: string } }) => {
          const escena = escenas.find((e) => e.slug === node.id);
          if (!escena) return;
          setActual(escena);
          // El primer espacio no se coloca aquí: lo coloca la entrada aérea,
          // y **después** de `ready`. Lanzarla en este aviso no sirve: llega
          // antes de que la escena esté pintada y el propio visor la pisa al
          // terminar de cargarla, así que el descenso no se veía.
          if (primera) return;
          // Los demás abren mirando a donde miraban en el tour viejo.
          v.rotate({ yaw: `${escena.vista.yaw}deg`, pitch: `${escena.vista.pitch}deg` });
          v.zoom(v.dataHelper.fovToZoomLevel(escena.vista.fov));
        });

        tour.setNodes(nodos, escenas[0].slug);

        v.addEventListener(
          "ready",
          () => {
            if (!vivo) return;
            setCargando(false);
            primera = false;
            entrar(v, escenas[0]);
          },
          { once: true }
        );

        // Un dedo o un ratón sobre la escena mandan más que la animación.
        cortar.current = cortarVuelo;
        contenedor.current.addEventListener("pointerdown", cortarVuelo, { once: true });
      } catch (e) {
        console.error("[paseo] no se pudo montar el visor:", e);
        if (vivo) {
          setFallo(true);
          setCargando(false);
        }
      }
    })();

    return () => {
      vivo = false;
      vuelo?.cancel();
      recorrido.current = null;
      visor?.destroy();
    };
  }, [escenas]);

  if (escenas.length === 0 || fallo) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          textAlign: "center",
          background: "#1A2B4A",
          color: "#F8F5F0",
        }}
      >
        <div>
          <p style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: ".5rem" }}>
            El paseo virtual no está disponible en este momento.
          </p>
          <p style={{ opacity: 0.85 }}>
            Puedes escribirnos desde{" "}
            <Link href="/contactos" style={{ color: "#F8F5F0", textDecoration: "underline" }}>
              Contactos
            </Link>{" "}
            y coordinamos una visita al campus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={enVR ? "paseo-marco paseo-en-vr" : "paseo-marco"}
      style={{ background: "#1A2B4A" }}
    >
      {/*
        Los accesos del recorrido son `.psv-virtual-tour-arrows`, NO
        `.psv-markers`: el complemento los pinta en su propia capa. Buscarlos
        en la capa equivocada me hizo escribir aquí que no se podían esconder,
        y era falso.

        Se esconden en dos momentos: durante el descenso de entrada, para que
        no estorben, y en modo VR, donde el visor parte la pantalla en dos y
        las flechas solo salían en el ojo izquierdo.

        Y en VR el marco ocupa la ventana entera por su cuenta: el iPhone no
        permite la pantalla completa que pide el complemento.
      */}
      <style>{`
        .paseo-entrando .psv-virtual-tour-arrows,
        .paseo-en-vr .psv-virtual-tour-arrows { display: none; }

        .paseo-en-vr {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
        }
        .paseo-en-vr .paseo-lienzo { height: 100dvh; }
        .paseo-en-vr .paseo-fuera-de-vr { display: none; }
      `}</style>

      {/* El rótulo de la entrada se coloca sobre el visor y NO sobre el bloque
          de texto de abajo: con `inset: 0` en el contenedor entero acababa
          fuera de la pantalla, debajo del nombre del espacio. */}
      <div style={{ position: "relative" }}>
        <div
          ref={contenedor}
          className={`paseo-lienzo${entrando && !cargando ? " paseo-entrando" : ""}`}
          style={{ width: "100%", height: "min(78vh, 720px)" }}
          aria-label="Recorrido 360° por el campus"
        />

        {!cargando && (
          <div className="paseo-fuera-de-vr">
            <MenuEspacios
              escenas={escenas}
              actual={actual?.slug ?? null}
              abierto={menuAbierto}
              onAbrir={setMenuAbierto}
              onIr={(slug) => {
                // Saltar desde el menú también corta el descenso de entrada:
                // si no, la cámara seguiría moviéndose en el espacio nuevo.
                cortar.current();
                recorrido.current?.setCurrentNode(slug);
                setMenuAbierto(false);
              }}
            />
          </div>
        )}

      {/* La entrada aérea: el rótulo se va con el descenso. */}
      {entrando && !cargando && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            // Centrado y no abajo: en un celular el visor ocupa 78vh **debajo**
            // de la cabecera, así que su borde inferior cae fuera de pantalla
            // y el botón quedaba donde nadie lo ve. Medido a 375×812.
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            padding: "0 1.25rem",
            textAlign: "center",
            background: "linear-gradient(to bottom, rgba(26,43,74,.45) 0%, rgba(26,43,74,.1) 50%, rgba(26,43,74,.55) 100%)",
            color: "#F8F5F0",
            pointerEvents: "none",
            animation: "paseoEntradaRotulo 1.2s ease both",
            /**
             * Los accesos del visor llevan z-index 21 dentro de su contenedor,
             * y un elemento posicionado sin z-index cuenta como 0: el rótulo
             * quedaba DEBAJO de las doce flechas. 95 lo pone encima de ellas y
             * de la barra de controles (90), y debajo de los avisos del propio
             * visor (110).
             */
            zIndex: 95,
          }}
        >
          <style>{`
            @keyframes paseoEntradaRotulo {
              from { opacity: 0; transform: translateY(12px); }
              to   { opacity: 1; transform: none; }
            }
          `}</style>

          {/* El rótulo lleva su propio fondo: sobre la vista aérea hay doce
              accesos blancos y el texto suelto se perdía entre ellos. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem 1.5rem",
              borderRadius: 18,
              background: "rgba(13,24,37,.82)",
              backdropFilter: "blur(3px)",
            }}
          >
          <p style={{ margin: 0, fontSize: "clamp(1.25rem, 4vw, 1.75rem)", fontWeight: 700 }}>
            Bienvenido al campus
          </p>

          <button
            type="button"
            onClick={() => cortar.current()}
            style={{
              pointerEvents: "auto",
              minHeight: 44,
              padding: "0 1.5rem",
              borderRadius: 999,
              border: "1px solid rgba(248,245,240,.55)",
              background: "rgba(26,43,74,.72)",
              color: "#F8F5F0",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Empezar el recorrido
          </button>
          </div>
        </div>
      )}

      {cargando && (
        <p
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "#F8F5F0",
            margin: 0,
            pointerEvents: "none",
          }}
        >
          Cargando el campus…
        </p>
      )}
      </div>

      {actual && (
        <div
          className="paseo-fuera-de-vr"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: ".5rem 1rem",
            padding: "1rem 1.25rem",
            background: "#1A2B4A",
            color: "#F8F5F0",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>{actual.titulo}</h2>
          <span style={{ opacity: 0.85, fontSize: "1rem" }}>{actual.grupo}</span>
          {actual.descripcion && (
            <p style={{ margin: 0, flexBasis: "100%", opacity: 0.9 }}>{actual.descripcion}</p>
          )}
        </div>
      )}
    </div>
  );
}
