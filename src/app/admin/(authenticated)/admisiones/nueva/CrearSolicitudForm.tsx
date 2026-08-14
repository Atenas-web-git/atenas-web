"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Info, Save } from "lucide-react";
import { crearSolicitudAction, type CrearSolicitudState } from "../actions";
import { GRADOS_POR_NIVEL, esNivel, esTramitePresencial } from "@/lib/admisiones/grados";

type Opciones = {
  niveles: string[];
  relaciones: string[];
  comoEnterado: string[];
  aniosLectivos: string[];
};

/**
 * Formulario para registrar a mano una solicitud de admisión.
 *
 * Es el mismo juego de campos que el formulario público, con dos diferencias
 * a propósito: **el año escolar y el año lectivo son obligatorios**, y no se
 * envía ningún correo. Ver el comentario de `crearSolicitudAction`.
 */
export function CrearSolicitudForm({ opciones }: { opciones: Opciones }) {
  const router = useRouter();
  const [nivel, setNivel] = useState("");
  const [grado, setGrado] = useState("");

  const [state, action, isPending] = useActionState<CrearSolicitudState, FormData>(
    async (prev, formData) => {
      const result = await crearSolicitudAction(prev, formData);
      // Al terminar se abre la ficha de la solicitud recién creada: es donde
      // se sigue trabajando —mover de estado, adjuntar documentos— y evita
      // tener que buscarla en el listado.
      if (result.ok && result.id) router.push(`/admin/admisiones/${result.id}`);
      return result;
    },
    { error: null, ok: false, id: null }
  );

  // Los años escolares que caben en el nivel elegido. Hasta que se elija uno,
  // el desplegable queda deshabilitado en vez de ofrecer los quince: elegir
  // «3ro de Bachillerato» dentro de Inicial es una pareja que no existe y el
  // servidor la rechaza igual, así que mejor no dejar llegar ahí.
  const gradosDelNivel = esNivel(nivel) ? GRADOS_POR_NIVEL[nivel] : [];

  return (
    <form action={action} className="flex flex-col gap-6">
      <Aviso tono="info" icono={Info}>
        La solicitud entra al mismo proceso que las del formulario web y recibe su número de
        seguimiento. Queda marcada como <strong>registrada a mano</strong>, para poder distinguirla
        después. <strong>No se envía ningún correo</strong>: si quieres avisar a la familia, hazlo
        desde su ficha cuando la muevas de etapa.
        {/*
          El formulario público muestra el aviso de privacidad y lo acepta la
          propia familia. Aquí los datos —de un menor— los teclea otra persona,
          así que el recordatorio va dirigido a quien registra.
        */}
        <br />
        <br />
        Estás anotando datos de un menor y de su representante: dile a la familia que los vas a
        registrar y para qué, como dice{" "}
        {/*
          `/privacidad` y no `/politicas`. Las dos existen: `/politicas` es el
          portal de políticas institucionales —calidad, seguridad, proveedores—
          y `/privacidad` es la de tratamiento de datos, que es de la que se
          habla aquí. El formulario público enlaza a `/politicas`, así que en el
          proyecto conviven las dos convenciones; esta es la correcta.
        */}
        <a
          href="/privacidad"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#1A2B4A", fontWeight: 600 }}
        >
          la política de tratamiento de datos
        </a>
        .
      </Aviso>

      <Bloque titulo="Estudiante">
        {/*
          Antes de la grilla y no después: si va debajo, quien rellena ve los
          asteriscos y se pregunta por qué antes de encontrar la explicación.
        */}
        <p style={{ fontSize: 11, color: "#6B6660", margin: 0, lineHeight: 1.55 }}>
          El <strong>año escolar</strong> y el <strong>año lectivo</strong> son obligatorios aquí
          aunque el formulario público no los exija: sin ellos la solicitud no cuenta en Cupos ni en
          Métricas. Tienes a la familia al teléfono — pregúntaselo.
        </p>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Campo label="Nombres *" name="est_nombres" requerido />
          <Campo label="Apellidos *" name="est_apellidos" requerido />
          <Campo label="Fecha de nacimiento" name="est_fecha_nac" type="date" />

          <label className="flex flex-col gap-1">
            <span style={etiqueta}>Nivel al que aspira *</span>
            <select
              name="est_nivel"
              required
              value={nivel}
              onChange={(e) => {
                setNivel(e.target.value);
                // Al cambiar de nivel el año elegido deja de tener sentido:
                // limpiarlo evita mandar una pareja imposible que el servidor
                // rechazaría con un error que no dice qué campo mirar.
                setGrado("");
              }}
              style={campo}
            >
              <option value="">Elige un nivel…</option>
              {opciones.niveles.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span style={etiqueta}>Año escolar *</span>
            <select
              name="est_grado"
              required
              disabled={gradosDelNivel.length === 0}
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
              style={campo}
            >
              <option value="">
                {gradosDelNivel.length === 0 ? "Elige primero el nivel" : "Elige un año…"}
              </option>
              {gradosDelNivel.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span style={etiqueta}>Año lectivo *</span>
            <select name="anio_ingreso" required style={campo}>
              <option value="">Elige un año lectivo…</option>
              {opciones.aniosLectivos.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          <Campo label="Institución de origen" name="est_institucion_origen" />
        </div>

        <AvisoPresencial grado={grado} />
      </Bloque>

      <Bloque titulo="Representante">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Campo label="Nombres *" name="rep_nombres" requerido />
          <Campo label="Apellidos *" name="rep_apellidos" requerido />
          <Selector label="Relación con el estudiante" name="rep_relacion" opciones={opciones.relaciones} />
          <Campo label="Correo *" name="rep_correo" type="email" requerido />
          <Campo label="Teléfono *" name="rep_telefono" requerido />
          <Selector label="¿Cómo se enteró?" name="como_enterado" opciones={opciones.comoEnterado} />
        </div>
      </Bloque>

      <Bloque titulo="Comentarios">
        <label className="flex flex-col gap-1">
          <span style={etiqueta}>Notas de la conversación</span>
          <textarea
            name="comentarios"
            rows={3}
            placeholder="Lo que contó la familia, lo que quedó pendiente…"
            style={{ ...campo, height: "auto", paddingTop: 8, paddingBottom: 8, resize: "vertical" }}
          />
        </label>
      </Bloque>

      {state.error && (
        <Aviso tono="error" icono={AlertTriangle}>
          {state.error}
        </Aviso>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 rounded-md transition-opacity hover:opacity-80"
          style={{
            height: 40,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          <Save size={15} strokeWidth={2} />
          {isPending ? "Registrando…" : "Registrar solicitud"}
        </button>
        <Link
          href="/admin/admisiones"
          style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

/**
 * Aviso de que 2do y 3ro de bachillerato se resuelven presencialmente. Se
 * muestra al elegir esos años, igual que en el formulario público, para que
 * quien registra sepa que ahí la decisión no sale del pipeline.
 */
function AvisoPresencial({ grado }: { grado: string }) {
  if (!esTramitePresencial(grado)) return null;
  return (
    // En ámbar y no en gris: es la única bifurcación real del proceso —esas
    // solicitudes no se resuelven en línea— y aparece cuando ya se llenaron
    // varios campos. Con el mismo aspecto que las notas informativas pasa
    // desapercibida, y la documentación del panel ya la marca como aviso.
    <Aviso tono="aviso" icono={AlertTriangle}>
      <strong>En {grado} el trámite es presencial.</strong> El colegio se reserva el derecho de
      admisión, así que esta solicitud no se resuelve por el proceso en línea: regístrala igual para
      no perder el contacto, pero la decisión se toma en el colegio.
    </Aviso>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <h2
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          margin: 0,
        }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Campo({
  label,
  name,
  type = "text",
  requerido = false,
}: {
  label: string;
  name: string;
  type?: string;
  requerido?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span style={etiqueta}>{label}</span>
      <input type={type} name={name} required={requerido} style={campo} />
    </label>
  );
}

function Selector({
  label,
  name,
  opciones,
}: {
  label: string;
  name: string;
  opciones: string[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span style={etiqueta}>{label}</span>
      <select name={name} style={campo} defaultValue="">
        <option value="">—</option>
        {opciones.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Aviso({
  tono,
  icono: Icono,
  children,
}: {
  tono: "info" | "aviso" | "error";
  icono: typeof Info;
  children: React.ReactNode;
}) {
  // El rojo es el de error de TODO el panel (`#FEE2E2`/`#991B1B`), no el rojo
  // institucional `#9e1915`: ese es del sitio público, y aquí dentro lo usan
  // otras setenta y seis pantallas, incluido el callout «peligro» de la
  // documentación. Cambiarlo solo aquí desalinearía esta.
  const c =
    tono === "error"
      ? { bg: "#FEE2E2", borde: "#FECACA", fg: "#991B1B" }
      : tono === "aviso"
        ? { bg: "#FEF3C7", borde: "#FDE68A", fg: "#92400E" }
        : { bg: "#F4F1EB", borde: "#E8E4DD", fg: "#6B6660" };
  return (
    <div
      // Lo anuncia un lector de pantalla sin tener que ir a buscarlo: el aviso
      // sale arriba del botón y el foco se queda donde estaba.
      role={tono === "error" ? "alert" : undefined}
      className="flex items-start gap-3 p-4"
      style={{ background: c.bg, border: `1px solid ${c.borde}`, borderRadius: 10 }}
    >
      <Icono size={16} strokeWidth={2} style={{ color: c.fg, flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13, color: c.fg, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

const etiqueta: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#6B6660",
};

const campo: React.CSSProperties = {
  height: 36,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 10,
  paddingRight: 10,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
