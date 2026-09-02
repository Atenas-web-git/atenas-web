"use client";

import { createContext, useActionState, useContext, useMemo, useRef, useState } from "react";
import { Save, ChevronDown, ChevronRight } from "lucide-react";
import type { AdmisionesTextosConfig } from "@/lib/cms/admisionesTextos";
import {
  guardarAdmisionesTextosAction,
  type AdmisionesTextosActionState,
} from "./actions";

/**
 * Fuerza a que todas las secciones se vean, pase lo que pase con su plegado.
 * Va por contexto y no por prop para no tener que tocar las doce llamadas a
 * `Section` —y para que la próxima que se añada lo herede sin acordarse.
 */
const MostrarTodo = createContext<{ activo: boolean; soltar: () => void }>({
  activo: false,
  soltar: () => {},
});

export function AdmisionesTextosForm({
  initialConfig,
  telefonos,
}: {
  initialConfig: AdmisionesTextosConfig;
  /**
   * Los teléfonos de Configuración › Datos de contacto, para el desplegable
   * del aviso de trámite presencial. Se elige de esta lista en vez de escribir
   * un número aquí: dos sitios con el mismo teléfono acaban diciendo cosas
   * distintas.
   */
  telefonos: { label: string; numero: string; extension: string }[];
}) {
  const [state, action, isPending] = useActionState<
    AdmisionesTextosActionState,
    FormData
  >(guardarAdmisionesTextosAction, { error: null, ok: false });

  const c = initialConfig;
  const f = c.formulario;

  /*
    Las secciones ya no se desmontan al plegarse, así que un campo inválido
    puede quedar escondido. El navegador se niega a enviar el formulario y no
    puede señalar el campo —no se puede enfocar lo que no se ve—, con lo que
    guardar dejaría de responder sin decir por qué. `onInvalid` burbujea desde
    el control hasta aquí antes de que eso ocurra: abrimos todas las secciones
    para que el campo culpable quede a la vista.

    Y hay que volver a pedir el aviso. Cuando `onInvalid` salta, el navegador
    ya ha renunciado a mostrar el globo de «Completa este campo» —React todavía
    no ha pintado la sección abierta—, así que sin esta segunda pasada el
    usuario ve el formulario desplegado pero ningún mensaje que explique por
    qué no se guardó. Comprobado en consola: «An invalid form control with
    name='m_diasParaEstancada' is not focusable».

    `setTimeout` y no `requestAnimationFrame`: en una pestaña de fondo rAF no
    se dispara, y ese detalle ya nos costó una sesión entera en este proyecto.
  */
  const [abrirTodo, setAbrirTodo] = useState(false);
  const [avisoValidacion, setAvisoValidacion] = useState(false);
  const avisando = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  function alSerInvalido() {
    // La segunda vuelta la provoca `reportValidity()`: si no se corta aquí,
    // se llama a sí misma sin fin.
    if (avisando.current) return;
    avisando.current = true;
    setAbrirTodo(true);
    setAvisoValidacion(true);
    setTimeout(() => {
      formRef.current?.reportValidity();
      avisando.current = false;
    }, 0);
  }

  /*
    El forzado NO se apaga solo pasado un rato: si se apagara, las secciones se
    cerrarían de golpe justo después de abrirse. Se suelta al primer clic en
    una cabecera, que es cuando la persona vuelve a tomar el mando.

    Sin eso, `abierta = open || activo` dejaba el plegado muerto: se podía
    pulsar el botón, cambiaba `open` por dentro, y la sección seguía abierta.
    Un formulario de 68 campos desplegado entero y sin forma de recogerlo.
  */
  const mando = useMemo(
    () => ({ activo: abrirTodo, soltar: () => setAbrirTodo(false) }),
    [abrirTodo]
  );

  return (
    <MostrarTodo.Provider value={mando}>
      <form
        ref={formRef}
        action={action}
        onInvalid={alSerInvalido}
        // El aviso se retira en cuanto la persona empieza a corregir: dejarlo
        // puesto lo convertiría en un cartel de alarma permanente.
        onInput={() => setAvisoValidacion(false)}
        className="flex flex-col gap-5"
      >
        <Sticky
          state={state}
          isPending={isPending}
          avisoValidacion={avisoValidacion}
        />

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <Section
        title="Header del wizard"
        subtitle="Barra superior fija de /admisiones/formulario."
        defaultOpen
      >
        <Field label="Título centrado">
          <input
            type="text" name="f_headerTitle"
            defaultValue={f.headerTitle} style={inputStyle}
          />
        </Field>
        <Field label="Link de volver">
          <input
            type="text" name="f_backLabel"
            defaultValue={f.backLabel} style={inputStyle}
          />
        </Field>
      </Section>

      {/* ── PASOS DEL WIZARD ─────────────────────────────────────────── */}
      <Section
        title="Títulos y subtítulos de los 4 pasos"
        subtitle="Encabezado y descripción que se muestran arriba de los campos en cada paso."
      >
        {[1, 2, 3, 4].map((n) => {
          const k = `paso${n}` as keyof typeof f.pasoTitulos;
          return (
            <div
              key={n}
              className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-3 items-start py-2"
              style={{ borderBottom: n < 4 ? "1px solid #F4F1EB" : "none" }}
            >
              <span style={tagStyle}>Paso {n}</span>
              <div className="flex flex-col gap-2">
                <input
                  type="text" name={`f_pasoTitulo_${n}`}
                  defaultValue={f.pasoTitulos[k]} style={inputStyle}
                  placeholder="Título del paso"
                />
                <textarea
                  name={`f_pasoSubtitulo_${n}`}
                  defaultValue={f.pasoSubtitulos[k]} rows={2}
                  style={textareaStyle} placeholder="Descripción / subtítulo"
                />
              </div>
            </div>
          );
        })}
      </Section>

      {/* ── PASO 1 — CAMPOS DEL ESTUDIANTE ───────────────────────────── */}
      <Section title="Paso 1 · Campos del estudiante">
        <CampoConPlaceholder
          tag="Nombres" labelName="f_est_nombresLabel"
          phName="f_est_nombresPlaceholder"
          labelDefault={f.camposEstudiante.nombresLabel}
          phDefault={f.camposEstudiante.nombresPlaceholder}
        />
        <CampoConPlaceholder
          tag="Apellidos" labelName="f_est_apellidosLabel"
          phName="f_est_apellidosPlaceholder"
          labelDefault={f.camposEstudiante.apellidosLabel}
          phDefault={f.camposEstudiante.apellidosPlaceholder}
        />
        <Field label="Fecha de nacimiento — etiqueta">
          <input
            type="text" name="f_est_fechaNacLabel"
            defaultValue={f.camposEstudiante.fechaNacLabel} style={inputStyle}
          />
        </Field>
        <CampoConPlaceholder
          tag="Nivel" labelName="f_est_nivelLabel"
          phName="f_est_nivelPlaceholder"
          labelDefault={f.camposEstudiante.nivelLabel}
          phDefault={f.camposEstudiante.nivelPlaceholder}
          phHint='Texto del placeholder del select (p.ej. "Selecciona el nivel...").'
        />
        <CampoConPlaceholder
          tag="Institución" labelName="f_est_institucionLabel"
          phName="f_est_institucionPlaceholder"
          labelDefault={f.camposEstudiante.institucionLabel}
          phDefault={f.camposEstudiante.institucionPlaceholder}
        />
      </Section>

      {/* ── PASO 2 — CAMPOS DEL REPRESENTANTE ────────────────────────── */}
      <Section title="Paso 2 · Campos del representante">
        <CampoConPlaceholder
          tag="Nombres" labelName="f_rep_nombresLabel"
          phName="f_rep_nombresPlaceholder"
          labelDefault={f.camposRepresentante.nombresLabel}
          phDefault={f.camposRepresentante.nombresPlaceholder}
        />
        <CampoConPlaceholder
          tag="Apellidos" labelName="f_rep_apellidosLabel"
          phName="f_rep_apellidosPlaceholder"
          labelDefault={f.camposRepresentante.apellidosLabel}
          phDefault={f.camposRepresentante.apellidosPlaceholder}
        />
        <CampoConPlaceholder
          tag="Relación" labelName="f_rep_relacionLabel"
          phName="f_rep_relacionPlaceholder"
          labelDefault={f.camposRepresentante.relacionLabel}
          phDefault={f.camposRepresentante.relacionPlaceholder}
        />
        <CampoConPlaceholder
          tag="Correo" labelName="f_rep_correoLabel"
          phName="f_rep_correoPlaceholder"
          labelDefault={f.camposRepresentante.correoLabel}
          phDefault={f.camposRepresentante.correoPlaceholder}
        />
        <CampoConPlaceholder
          tag="Teléfono" labelName="f_rep_telefonoLabel"
          phName="f_rep_telefonoPlaceholder"
          labelDefault={f.camposRepresentante.telefonoLabel}
          phDefault={f.camposRepresentante.telefonoPlaceholder}
        />
      </Section>

      {/* ── PASO 3 — CAMPOS ADICIONALES ──────────────────────────────── */}
      <Section title="Paso 3 · Información adicional">
        <CampoConPlaceholder
          tag="¿Cómo se enteró?" labelName="f_ad_comoEnteradoLabel"
          phName="f_ad_comoEnteradoPlaceholder"
          labelDefault={f.camposAdicional.comoEnteradoLabel}
          phDefault={f.camposAdicional.comoEnteradoPlaceholder}
        />
        <CampoConPlaceholder
          tag="Año de ingreso" labelName="f_ad_anioIngresoLabel"
          phName="f_ad_anioIngresoPlaceholder"
          labelDefault={f.camposAdicional.anioIngresoLabel}
          phDefault={f.camposAdicional.anioIngresoPlaceholder}
        />
        <CampoConPlaceholder
          tag="Comentarios" labelName="f_ad_comentariosLabel"
          phName="f_ad_comentariosPlaceholder"
          labelDefault={f.camposAdicional.comentariosLabel}
          phDefault={f.camposAdicional.comentariosPlaceholder}
        />
      </Section>

      {/* ── OPCIONES DE SELECTS ──────────────────────────────────────── */}
      <Section
        title="Opciones de los menús desplegables"
        subtitle="Una opción por línea. Si se deja vacío se usan las opciones por defecto."
      >
        <Field
          label="Niveles educativos"
          hint='Niveles disponibles en el select "Nivel al que aplica". Deben coincidir con los configurados en /admin/admisiones/cupos.'
        >
          <textarea
            name="f_op_niveles"
            defaultValue={f.opciones.niveles.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
        <Field
          label="Relaciones del representante"
          hint='Opciones del select "Relación con el estudiante".'
        >
          <textarea
            name="f_op_relaciones"
            defaultValue={f.opciones.relaciones.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
        <Field
          label="¿Cómo se enteró del colegio?"
          hint='Opciones del select correspondiente del paso 3.'
        >
          <textarea
            name="f_op_comoEnterado"
            defaultValue={f.opciones.comoEnterado.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
      </Section>

      {/* ── PASO 4 — CONFIRMACIÓN ────────────────────────────────────── */}
      <Section
        title="Paso 4 · Resumen de confirmación"
        subtitle="Títulos de cada bloque del resumen y mensaje final."
      >
        <Field label="Sección Datos del Estudiante">
          <input
            type="text" name="f_conf_seccionEstudiante"
            defaultValue={f.confirmacion.seccionEstudiante} style={inputStyle}
          />
        </Field>
        <Field label="Sección Datos del Representante">
          <input
            type="text" name="f_conf_seccionRepresentante"
            defaultValue={f.confirmacion.seccionRepresentante} style={inputStyle}
          />
        </Field>
        <Field label="Sección Información Adicional">
          <input
            type="text" name="f_conf_seccionAdicional"
            defaultValue={f.confirmacion.seccionAdicional} style={inputStyle}
          />
        </Field>
        <Field label='Etiqueta del botón "Editar"'>
          <input
            type="text" name="f_conf_botonEditar"
            defaultValue={f.confirmacion.botonEditar} style={inputStyle}
          />
        </Field>
        <Field
          label="Mensaje final"
          hint="Aparece al pie del paso de confirmación, antes del botón Enviar."
        >
          <textarea
            name="f_conf_mensajeFinal"
            defaultValue={f.confirmacion.mensajeFinal} rows={2}
            style={textareaStyle}
          />
        </Field>
      </Section>

      {/* ── NAVEGACIÓN ───────────────────────────────────────────────── */}
      <Section title="Botones de navegación">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Anterior">
            <input
              type="text" name="f_nav_anterior"
              defaultValue={f.navegacion.anterior} style={inputStyle}
            />
          </Field>
          <Field label="Siguiente">
            <input
              type="text" name="f_nav_siguiente"
              defaultValue={f.navegacion.siguiente} style={inputStyle}
            />
          </Field>
          <Field label="Enviar (botón final)">
            <input
              type="text" name="f_nav_enviar"
              defaultValue={f.navegacion.enviar} style={inputStyle}
            />
          </Field>
          <Field label="Enviando (en progreso)">
            <input
              type="text" name="f_nav_enviando"
              defaultValue={f.navegacion.enviando} style={inputStyle}
            />
          </Field>
        </div>
      </Section>

      {/* ── PANTALLA DE ÉXITO ────────────────────────────────────────── */}
      <Section
        title="Pantalla de éxito"
        subtitle="Lo que ve el postulante después de enviar la solicitud."
      >
        <Field label="Título">
          <input
            type="text" name="f_ex_titulo"
            defaultValue={f.exito.titulo} style={inputStyle}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            name="f_ex_descripcion"
            defaultValue={f.exito.descripcion} rows={3} style={textareaStyle}
          />
        </Field>
        <Field label='Etiqueta arriba del N° (ej. "N° de seguimiento")'>
          <input
            type="text" name="f_ex_etiquetaSeguimiento"
            defaultValue={f.exito.etiquetaSeguimiento} style={inputStyle}
          />
        </Field>
        <Field label='Título del bloque "¿Qué sigue?"'>
          <input
            type="text" name="f_ex_queSigueTitulo"
            defaultValue={f.exito.queSigueTitulo} style={inputStyle}
          />
        </Field>
        <Field
          label="Pasos siguientes (una línea por bullet)"
          hint="Cada línea es un bullet con check verde."
        >
          <textarea
            name="f_ex_queSigueBullets"
            defaultValue={f.exito.queSigueBullets.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Botón secundario (volver)">
            <input
              type="text" name="f_ex_botonVolver"
              defaultValue={f.exito.botonVolver} style={inputStyle}
            />
          </Field>
          <Field label="Botón primario (inicio)">
            <input
              type="text" name="f_ex_botonInicio"
              defaultValue={f.exito.botonInicio} style={inputStyle}
            />
          </Field>
        </div>
      </Section>

      {/* ── PRIVACIDAD ───────────────────────────────────────────────── */}
      <Section
        title="Aviso de privacidad"
        subtitle='Texto al pie del wizard. Usa el marcador {{politica}} donde quieras que aparezca el link a la política.'
      >
        <Field
          label="Texto del aviso"
          hint='Ejemplo: "Al enviar aceptas nuestra {{politica}}. Tus datos…"'
        >
          <textarea
            name="f_priv_texto"
            defaultValue={f.privacidad.texto} rows={3} style={textareaStyle}
          />
        </Field>
        <Field label='Texto del link (apunta a /politicas)'>
          <input
            type="text" name="f_priv_politicaLabel"
            defaultValue={f.privacidad.politicaLabel} style={inputStyle}
          />
        </Field>
      </Section>

      {/* ── TRÁMITE PRESENCIAL ───────────────────────────────────────── */}
      <Section
        title="Aviso de trámite presencial"
        subtitle="Sale al elegir 2do o 3ro de Bachillerato, donde el ingreso se gestiona en el colegio. La solicitud se envía igual: se avisa, no se bloquea."
      >
        <Field
          label="Título del aviso"
          hint="Escribe {{grado}} donde quieras que aparezca el año elegido. Ejemplo: «Para {{grado}}, el ingreso se gestiona en el colegio»."
        >
          <input
            type="text" name="f_presencial_titulo"
            defaultValue={f.tramitePresencial.titulo} style={inputStyle}
          />
        </Field>
        <Field
          label="Texto del aviso"
          hint="También admite {{grado}}. Es lo que lee la familia antes de escribir sus datos."
        >
          <textarea
            name="f_presencial_cuerpo"
            defaultValue={f.tramitePresencial.cuerpo} rows={4} style={textareaStyle}
          />
        </Field>
        <Field
          label="Horario de atención (opcional)"
          hint="Cuándo pueden acercarse. Ejemplo: «Lunes a viernes, de 07:30 a 15:30». Si lo dejas vacío, no se muestra."
        >
          <input
            type="text" name="f_presencial_horario"
            defaultValue={f.tramitePresencial.horario} style={inputStyle}
          />
        </Field>
        <Field
          label="Teléfono que se muestra"
          hint="Sale de Configuración › Datos de contacto. Elige el que quieras que marque la familia."
        >
          <select
            name="f_presencial_telefonoLabel"
            defaultValue={f.tramitePresencial.telefonoLabel}
            style={inputStyle}
          >
            <option value="">El de Admisiones (automático)</option>
            {telefonos.map((t) => (
              <option key={t.label} value={t.label}>
                {t.label} — {t.numero}
                {t.extension ? ` ext. ${t.extension}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Extensión (opcional)"
          hint="Solo si es distinta de la que tiene ese teléfono en Datos de contacto. Vacío = se usa la de allí, o ninguna si no tiene."
        >
          <input
            type="text" name="f_presencial_extension"
            defaultValue={f.tramitePresencial.extension} style={inputStyle}
          />
        </Field>
        {/*
          La dirección, el teléfono y el correo del aviso NO se editan aquí:
          salen de Configuración › Contacto. Se dice para que nadie los busque
          en esta pantalla y acabe pidiendo que se añadan, creando dos sitios
          donde cambiar el mismo teléfono.
        */}
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.6 }}>
          La dirección, el teléfono y el correo de este aviso se toman de{" "}
          <strong>Configuración › Datos de contacto</strong>. Cámbialos ahí y se
          actualizan aquí solos.
        </p>
      </Section>

      {/* ── SEGUIMIENTO ──────────────────────────────────────────────── */}
      <Section
        title="/admisiones/seguimiento"
        subtitle="Header + intro de la página donde el representante consulta el estado de su solicitud."
      >
        <Field label="Título del header">
          <input
            type="text" name="s_headerTitle"
            defaultValue={c.seguimiento.headerTitle} style={inputStyle}
          />
        </Field>
        <Field label="Link de volver">
          <input
            type="text" name="s_backLabel"
            defaultValue={c.seguimiento.backLabel} style={inputStyle}
          />
        </Field>
        <Field label="Título de la intro">
          <input
            type="text" name="s_introTitle"
            defaultValue={c.seguimiento.introTitle} style={inputStyle}
          />
        </Field>
        <Field label="Descripción de la intro">
          <textarea
            name="s_introDescription"
            defaultValue={c.seguimiento.introDescription}
            rows={3} style={textareaStyle}
          />
        </Field>
        <Field label="Etiqueta del campo del número">
          <input
            type="text" name="s_numeroLabel"
            defaultValue={c.seguimiento.numeroLabel} style={inputStyle}
          />
        </Field>
        <Field label="Texto de ejemplo dentro del campo del número">
          <input
            type="text" name="s_numeroPlaceholder"
            defaultValue={c.seguimiento.numeroPlaceholder} style={inputStyle}
          />
        </Field>
        <Field label="Etiqueta del campo del correo">
          <input
            type="text" name="s_correoLabel"
            defaultValue={c.seguimiento.correoLabel} style={inputStyle}
          />
        </Field>
        <Field label="Texto de ejemplo dentro del campo del correo">
          <input
            type="text" name="s_correoPlaceholder"
            defaultValue={c.seguimiento.correoPlaceholder} style={inputStyle}
          />
        </Field>
        <Field label="Explicación de por qué se piden los dos datos (debajo del correo)">
          <textarea
            name="s_correoAyuda"
            defaultValue={c.seguimiento.correoAyuda}
            rows={2} style={textareaStyle}
          />
        </Field>
        <Field label="Texto del botón">
          <input
            type="text" name="s_botonConsultar"
            defaultValue={c.seguimiento.botonConsultar} style={inputStyle}
          />
        </Field>
        <Field label="Texto del botón mientras busca">
          <input
            type="text" name="s_botonConsultando"
            defaultValue={c.seguimiento.botonConsultando} style={inputStyle}
          />
        </Field>
      </Section>

      <Section
        title="Métricas de admisiones"
        subtitle="Ajustes de la pantalla Admisiones › Métricas."
      >
        <Field label="Días sin avanzar para considerar detenido a un aspirante">
          {/*
            `required` cubre un solo caso: que alguien borre el número con esta
            sección abierta. Ahí el navegador no deja guardar y señala el campo.

            NO cubre el caso que de verdad ocurre. `Section` desmonta sus hijos al
            plegarse, y una sección plegada es el estado por defecto de todas menos
            la primera: entonces este input no existe, el navegador no valida nada
            que no esté montado, y la acción recibe la clave ausente y la devuelve
            a los 14 de fábrica. Guardar sin desplegar esta sección revierte el
            umbral en silencio — y a diferencia de un texto reseteado, que se ve en
            la página pública, este no se nota en ningún sitio: la tarjeta sigue
            diciendo «Detenidos más de N días» con el número que sea.

            Es un fallo de toda la pantalla, no de este campo, y va por ficha:
            2026-08-18-guardar-con-secciones-plegadas-borra-lo-no-montado.
          */}
          <input
            type="number"
            name="m_diasParaEstancada"
            min={1}
            max={365}
            step={1}
            required
            defaultValue={c.metricas.diasParaEstancada}
            style={inputStyle}
          />
        </Field>
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.55 }}>
          En <strong>Admisiones › Métricas</strong>, la tarjeta «Detenidos» lista los aspirantes que
          llevan más de estos días sin cambiar de etapa. Se cuenta desde el último cambio de etapa,
          no desde la última vez que se editó la ficha.
          <br />
          <br />
          El valor de partida son <strong>14 días</strong>, pero es un número que pusimos nosotros,
          no una norma del colegio: ajústalo a lo que de verdad les parezca demasiado tiempo sin
          contactar a una familia. Tiene que ser un número entero <strong>entre 1 y 365</strong>; si
          se guarda vacío o fuera de ese rango, vuelve solo a los 14 de fábrica.
        </p>
        </Section>
      </form>
    </MostrarTodo.Provider>
  );
}

// ── Componentes de UI ──────────────────────────────────────────────────────

function Sticky({
  state,
  isPending,
  avisoValidacion,
}: {
  state: AdmisionesTextosActionState;
  isPending: boolean;
  avisoValidacion: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      {/*
        Sin esta línea, pulsar «Guardar cambios» con un campo obligatorio a
        medias despliega las doce secciones de golpe y lo único que explica algo
        es el globo del navegador, que se va al primer clic. Quien no lo espera
        ve el formulario estallar sin motivo.
      */}
      {avisoValidacion ? (
        <span style={{ fontSize: 14, color: "#991B1B", fontWeight: 600 }}>
          Falta completar un campo obligatorio. Abrimos todas las secciones y te
          llevamos hasta él.
        </span>
      ) : (
        <span style={{ fontSize: 14, color: "#6B6660" }}>
          Los cambios aplican al guardar. Campos vacíos vuelven al valor por defecto.
        </span>
      )}
      <div className="flex items-center gap-3">
        {state.error && <span style={{ fontSize: 13, color: "#991B1B" }}>{state.error}</span>}
        {state.ok && <span style={{ fontSize: 13, color: "#065F46" }}>Guardado ✓</span>}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 rounded-md transition-opacity"
          style={{
            height: 36,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <Save size={14} strokeWidth={2.5} />
          {isPending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // El hook va suelto y no dentro de un `||`: un cortocircuito lo dejaría sin
  // llamar cuando la sección ya está abierta, que es justo lo que las reglas de
  // los hooks prohíben. Ver el comentario de `MostrarTodo`.
  const { activo: mostrarTodo, soltar } = useContext(MostrarTodo);
  const abierta = open || mostrarTodo;

  // Con el forzado puesto, todas se ven abiertas: el clic tiene que cerrar la
  // que se pulsa —que es lo que la persona está pidiendo— y devolver el mando.
  function alPulsarCabecera() {
    if (mostrarTodo) {
      soltar();
      setOpen(false);
    } else {
      setOpen((o) => !o);
    }
  }
  return (
    <div
      className="flex flex-col"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <button
        type="button"
        onClick={alPulsarCabecera}
        className="flex items-center gap-2 w-full text-left p-5"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        {abierta ? (
          <ChevronDown size={16} color="#6B6660" strokeWidth={2.5} />
        ) : (
          <ChevronRight size={16} color="#6B6660" strokeWidth={2.5} />
        )}
        <div className="flex flex-col gap-0.5 flex-1">
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
          {subtitle && (
            <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
      </button>
      {/*
        Se esconde con CSS, NO se desmonta. Con `{abierta && …}` los campos de
        una sección plegada dejaban de existir, y un control que no existe no
        viaja en el FormData: la acción recibía la clave ausente, la leía como
        cadena vacía y la devolvía al valor de fábrica. Guardar con las
        secciones plegadas —el estado por defecto de once de las doce— enviaba
        15 de los 80 campos y reescribía los otros 65. Sin aviso ninguno.
      */}
      <div
        className="flex flex-col gap-4 p-5 pt-0"
        style={{ borderTop: "1px solid #F4F1EB", display: abierta ? "flex" : "none" }}
      >
        <div style={{ marginTop: 16 }} />
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

function CampoConPlaceholder({
  tag,
  labelName,
  phName,
  labelDefault,
  phDefault,
  phHint,
}: {
  tag: string;
  labelName: string;
  phName: string;
  labelDefault: string;
  phDefault: string;
  phHint?: string;
}) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-3 items-start py-2"
      style={{ borderBottom: "1px solid #F4F1EB" }}
    >
      <span style={tagStyle}>{tag}</span>
      <div className="flex flex-col gap-1">
        <span style={subLabelStyle}>Etiqueta</span>
        <input
          type="text" name={labelName} defaultValue={labelDefault} style={inputStyle}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span style={subLabelStyle}>Placeholder</span>
        <input
          type="text" name={phName} defaultValue={phDefault} style={inputStyle}
        />
        {phHint && (
          <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.4 }}>{phHint}</span>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};

const textareaStyle: React.CSSProperties = {
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  padding: "10px 12px",
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  resize: "vertical",
};

const tagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "flex-start",
  paddingLeft: 10,
  paddingRight: 10,
  height: 22,
  background: "#F4F1EB",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 700,
  color: "#1A2B4A",
  letterSpacing: 0.3,
};

const subLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#A0AABA",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
