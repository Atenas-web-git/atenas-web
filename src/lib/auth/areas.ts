/**
 * Áreas de los formularios — quién es dueño de cada bandeja.
 *
 * Antes de la migración 079 la sección Contenido › Formularios era todo o
 * nada: quien entraba veía los cinco formularios y podía abrir cualquier
 * bandeja. Eso obligaba a elegir entre dos cosas malas: o talento humano no
 * administraba sus vacantes, o pasaba a ver los mensajes de contacto, las
 * quejas y las consultas de admisión, con nombres de familias y datos de
 * menores.
 *
 * Cada formulario pertenece ahora a un área, y el rol decide qué áreas ve.
 * Este archivo es la ÚNICA fuente de esa decisión: si un listado, una
 * bandeja o una descarga no pasa por aquí, es una puerta abierta.
 *
 * Espejo de la columna `formularios.area` y de su CHECK.
 */

import { ROLES, hasRole, type AdminUser } from "./types";

export const AREAS = {
  COMUNICACIONES: "comunicaciones",
  ADMISIONES: "admisiones",
  TALENTO: "talento",
} as const;

export type AreaFormulario = (typeof AREAS)[keyof typeof AREAS];

export const AREAS_VALIDAS: AreaFormulario[] = [
  AREAS.COMUNICACIONES,
  AREAS.ADMISIONES,
  AREAS.TALENTO,
];

/** Cómo se llama el área en pantalla, para el editor no técnico. */
export const AREA_LABELS: Record<AreaFormulario, string> = {
  comunicaciones: "Comunicaciones",
  admisiones: "Admisiones",
  talento: "Talento Humano",
};

/** Un formulario sin área reconocible se trata como de Comunicaciones. */
export function normalizarArea(valor: unknown): AreaFormulario {
  return AREAS_VALIDAS.includes(valor as AreaFormulario)
    ? (valor as AreaFormulario)
    : AREAS.COMUNICACIONES;
}

/**
 * Qué áreas puede ver este usuario.
 *
 * `editor_comm` conserva Comunicaciones y Admisiones —es lo que ya veía— y
 * pierde Talento Humano, que es justo el motivo de todo esto: quien edita
 * los textos del sitio no tiene por qué ver hojas de vida, cédulas ni datos
 * de discapacidad de los postulantes.
 */
export function areasVisibles(user: AdminUser | null): AreaFormulario[] {
  if (!user) return [];
  if (hasRole(user, ROLES.SUPERADMIN)) return [...AREAS_VALIDAS];

  const areas = new Set<AreaFormulario>();
  if (hasRole(user, ROLES.EDITOR_COMM)) {
    areas.add(AREAS.COMUNICACIONES);
    areas.add(AREAS.ADMISIONES);
  }
  if (hasRole(user, ROLES.EDITOR_TALENTO)) {
    areas.add(AREAS.TALENTO);
  }
  return AREAS_VALIDAS.filter((a) => areas.has(a));
}

export function puedeVerArea(
  user: AdminUser | null,
  area: AreaFormulario
): boolean {
  return areasVisibles(user).includes(area);
}

/** ¿Tiene acceso a la sección de formularios, sea del área que sea? */
export function puedeVerFormularios(user: AdminUser | null): boolean {
  return areasVisibles(user).length > 0;
}

/**
 * Quién puede crear formularios nuevos.
 *
 * Talento Humano no: su trabajo es el formulario de postulación que ya
 * existe. Si crease uno, habría que decidir a qué área va y qué pasa cuando
 * no es de empleo; se deja fuera hasta que el colegio lo pida.
 */
export function puedeCrearFormularios(user: AdminUser | null): boolean {
  return hasRole(user, ROLES.SUPERADMIN) || hasRole(user, ROLES.EDITOR_COMM);
}

/**
 * Las plantillas de correo que ve cada rol.
 *
 * Talento Humano solo edita la de «Trabaja con nosotros»; las otras cuatro
 * son de comunicaciones y de admisiones. `null` significa «todas».
 */
export function plantillasVisibles(user: AdminUser | null): string[] | null {
  if (!user) return [];
  if (hasRole(user, ROLES.SUPERADMIN)) return null;
  if (
    hasRole(user, ROLES.EDITOR_COMM) ||
    hasRole(user, ROLES.EDITOR_ADMISIONES)
  ) {
    return null;
  }
  if (hasRole(user, ROLES.EDITOR_TALENTO)) return ["trabaja"];
  return [];
}

/**
 * Las páginas del sitio que puede editar Talento Humano.
 *
 * Una lista blanca por slug, no un permiso general sobre Páginas: el rol
 * existe precisamente para que no toque las otras 52.
 */
export const PAGINAS_TALENTO: string[] = ["trabaja-con-nosotros"];

export function puedeEditarPagina(
  user: AdminUser | null,
  slug: string
): boolean {
  if (!user) return false;
  if (
    hasRole(user, ROLES.SUPERADMIN) ||
    hasRole(user, ROLES.EDITOR_COMM) ||
    hasRole(user, ROLES.EDITOR_ACADEMICO)
  ) {
    return true;
  }
  if (hasRole(user, ROLES.EDITOR_TALENTO)) {
    return PAGINAS_TALENTO.includes(slug);
  }
  return false;
}

/** ¿Puede entrar en la sección Páginas, aunque solo vea una? */
export function puedeVerPaginas(user: AdminUser | null): boolean {
  return (
    hasRole(user, ROLES.SUPERADMIN) ||
    hasRole(user, ROLES.EDITOR_COMM) ||
    hasRole(user, ROLES.EDITOR_ACADEMICO) ||
    hasRole(user, ROLES.EDITOR_TALENTO)
  );
}

/** ¿Puede administrar las vacantes de empleo? */
export function puedeVerVacantes(user: AdminUser | null): boolean {
  return (
    hasRole(user, ROLES.SUPERADMIN) ||
    hasRole(user, ROLES.EDITOR_COMM) ||
    hasRole(user, ROLES.EDITOR_TALENTO)
  );
}
