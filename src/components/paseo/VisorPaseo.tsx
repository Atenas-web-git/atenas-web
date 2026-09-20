"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { EscenaPaseo } from "@/lib/paseo/getPaseo";

// Los estilos sí van arriba, aunque la librería se cargue dentro del efecto:
// son unos pocos KB y viajan con el trozo de esta página, no con el sitio.
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import "@photo-sphere-viewer/gallery-plugin/index.css";

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
  const [actual, setActual] = useState<EscenaPaseo | null>(escenas[0] ?? null);

  useEffect(() => {
    if (!contenedor.current || escenas.length === 0) return;

    let visor: { destroy: () => void } | null = null;
    let vivo = true;

    (async () => {
      try {
        const [
          { Viewer },
          { CubemapAdapter },
          { MarkersPlugin },
          { VirtualTourPlugin },
          { GyroscopePlugin },
          { GalleryPlugin },
        ] = await Promise.all([
          import("@photo-sphere-viewer/core"),
          import("@photo-sphere-viewer/cubemap-adapter"),
          import("@photo-sphere-viewer/markers-plugin"),
          import("@photo-sphere-viewer/virtual-tour-plugin"),
          import("@photo-sphere-viewer/gyroscope-plugin"),
          import("@photo-sphere-viewer/gallery-plugin"),
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

        const v = new Viewer({
          container: contenedor.current,
          adapter: CubemapAdapter,
          defaultZoomLvl: 50,
          navbar: ["zoom", "move", "gallery", "gyroscope", "fullscreen"],
          loadingTxt: "Cargando el campus…",
          plugins: [
            MarkersPlugin,
            GyroscopePlugin,
            [GalleryPlugin, { visibleOnLoad: false, thumbnailSize: { width: 140, height: 80 } }],
            [
              VirtualTourPlugin,
              {
                positionMode: "manual",
                renderMode: "2d",
                // El tamaño de fábrica (80 px) tapa media pantalla en un
                // celular: la vista aérea tiene 12 accesos juntos sobre el
                // campus y se solapan entre ellos. Medido en 375 px.
                arrowStyle: { size: { width: 48, height: 48 } },
              },
            ],
          ],
        });
        visor = v as unknown as { destroy: () => void };

        const tour = v.getPlugin(VirtualTourPlugin) as InstanceType<typeof VirtualTourPlugin>;
        tour.setNodes(nodos, escenas[0].slug);

        tour.addEventListener("node-changed", ({ node }: { node: { id: string } }) => {
          const escena = escenas.find((e) => e.slug === node.id);
          if (!escena) return;
          setActual(escena);
          // Cada espacio abre mirando a donde miraba en el tour viejo.
          v.rotate({ yaw: `${escena.vista.yaw}deg`, pitch: `${escena.vista.pitch}deg` });
          v.zoom(v.dataHelper.fovToZoomLevel(escena.vista.fov));
        });

        v.addEventListener("ready", () => vivo && setCargando(false), { once: true });
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
    <div style={{ position: "relative", background: "#1A2B4A" }}>
      <div
        ref={contenedor}
        style={{ width: "100%", height: "min(78vh, 720px)" }}
        aria-label="Recorrido 360° por el campus"
      />

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

      {actual && (
        <div
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
