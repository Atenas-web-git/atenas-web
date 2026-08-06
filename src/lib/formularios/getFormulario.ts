/**
 * Lectura de formularios desde el servidor.
 *
 * ⚠️ Usa service_role, así que SOLO se puede llamar desde server components,
 * server actions o rutas de API. Nunca desde un componente de cliente.
 *
 * Por qué service_role y no el cliente anónimo como `getPagina`: la fila del
 * formulario lleva `notificar_a` —los correos internos del colegio— y los
 * textos de las plantillas de confirmación. Dejar la tabla legible por `anon`
 * publicaría esas direcciones a cualquiera con la clave anónima, que viaja en
 * el bundle del navegador. Es exactamente el fallo que arregló la migración
 * 068 con las credenciales de correo.
 *
 * Lo que llega al navegador es `FormularioPublico`, que no incluye esos
 * campos.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { CampoFormulario, Formulario } from "./tipos";

/** Lo único que necesita el componente que dibuja el formulario. */
export type FormularioPublico = {
  id: string;
  slug: string;
  titulo: string | null;
  subtitulo: string | null;
  texto_boton: string;
  titulo_exito: string;
  texto_exito: string;
  aviso_legal: string | null;
  campos: CampoFormulario[];
};

const COLUMNAS =
  "id, slug, nombre, descripcion_interna, titulo, subtitulo, texto_boton, " +
  "titulo_exito, texto_exito, aviso_legal, campos, notificar_a, asunto, " +
  "preset_correo, plantilla_correo, campo_correo, confirmacion_activa, " +
  "confirmacion_asunto, confirmacion_cuerpo, activo";

function normalizar(fila: Record<string, unknown>): Formulario {
  return {
    ...(fila as unknown as Formulario),
    campos: Array.isArray(fila.campos) ? (fila.campos as CampoFormulario[]) : [],
    notificar_a: Array.isArray(fila.notificar_a)
      ? (fila.notificar_a as string[])
      : [],
  };
}

/**
 * Formulario completo, incluidos los destinatarios internos. Para el endpoint
 * de envío y para el panel.
 */
export async function getFormulario(slug: string): Promise<Formulario | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("formularios")
      .select(COLUMNAS)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      // Deliberadamente ruidoso: el modo de fallo más probable es desplegar
      // el código sin haber aplicado la migración 074, y entonces el
      // formulario desaparece del sitio sin dejar rastro.
      console.error(`[getFormulario] no se pudo leer "${slug}":`, error.message);
      return null;
    }
    if (!data) return null;

    return normalizar(data as unknown as Record<string, unknown>);
  } catch (e) {
    console.error(`[getFormulario] excepción leyendo "${slug}":`, e);
    return null;
  }
}

/** Igual que `getFormulario` pero por id. Lo usa el enganche con las páginas. */
export async function getFormularioPorId(
  id: string
): Promise<Formulario | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("formularios")
      .select(COLUMNAS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`[getFormulario] no se pudo leer el id ${id}:`, error.message);
      return null;
    }
    if (!data) return null;

    return normalizar(data as unknown as Record<string, unknown>);
  } catch (e) {
    console.error(`[getFormulario] excepción leyendo el id ${id}:`, e);
    return null;
  }
}

/** Quita todo lo que no debe salir del servidor. */
export function aPublico(formulario: Formulario): FormularioPublico {
  return {
    id: formulario.id,
    slug: formulario.slug,
    titulo: formulario.titulo,
    subtitulo: formulario.subtitulo,
    texto_boton: formulario.texto_boton,
    titulo_exito: formulario.titulo_exito,
    texto_exito: formulario.texto_exito,
    aviso_legal: formulario.aviso_legal,
    campos: formulario.campos,
  };
}

/**
 * Formulario listo para pintar. Devuelve null si no existe o está desactivado
 * —desactivar es la forma de retirar un formulario del sitio sin borrar las
 * respuestas que ya recibió—.
 */
export async function getFormularioPublico(
  slug: string
): Promise<FormularioPublico | null> {
  const formulario = await getFormulario(slug);
  if (!formulario || !formulario.activo) return null;
  return aPublico(formulario);
}

export async function getFormularioPublicoPorId(
  id: string
): Promise<FormularioPublico | null> {
  const formulario = await getFormularioPorId(id);
  if (!formulario || !formulario.activo) return null;
  return aPublico(formulario);
}

/** Listado para el panel, con el conteo de respuestas sin atender. */
export type FormularioListado = {
  id: string;
  slug: string;
  nombre: string;
  titulo: string | null;
  activo: boolean;
  campos_total: number;
  respuestas_total: number;
  respuestas_nuevas: number;
  plantilla_correo: string | null;
  updated_at: string;
};

export async function listarFormularios(): Promise<FormularioListado[]> {
  const supabase = createAdminClient();

  const { data: formularios, error } = await supabase
    .from("formularios")
    .select("id, slug, nombre, titulo, activo, campos, plantilla_correo, updated_at")
    .order("nombre");

  if (error || !formularios) {
    console.error("[listarFormularios]", error?.message);
    return [];
  }

  // Un solo viaje para todas las respuestas: son pocas filas y evita N+1.
  const { data: respuestas } = await supabase
    .from("formulario_respuestas")
    .select("formulario_id, estado");

  const totales = new Map<string, { total: number; nuevas: number }>();
  for (const r of respuestas ?? []) {
    const fila = r as { formulario_id: string; estado: string };
    const actual = totales.get(fila.formulario_id) ?? { total: 0, nuevas: 0 };
    actual.total += 1;
    if (fila.estado === "nueva") actual.nuevas += 1;
    totales.set(fila.formulario_id, actual);
  }

  return formularios.map((f) => {
    const fila = f as unknown as {
      id: string;
      slug: string;
      nombre: string;
      titulo: string | null;
      activo: boolean;
      campos: unknown;
      plantilla_correo: string | null;
      updated_at: string;
    };
    const conteo = totales.get(fila.id) ?? { total: 0, nuevas: 0 };
    return {
      id: fila.id,
      slug: fila.slug,
      nombre: fila.nombre,
      titulo: fila.titulo,
      activo: fila.activo,
      campos_total: Array.isArray(fila.campos) ? fila.campos.length : 0,
      respuestas_total: conteo.total,
      respuestas_nuevas: conteo.nuevas,
      plantilla_correo: fila.plantilla_correo,
      updated_at: fila.updated_at,
    };
  });
}
