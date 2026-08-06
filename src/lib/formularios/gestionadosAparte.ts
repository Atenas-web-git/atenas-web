/**
 * Formularios del sitio que NO los mueve el motor.
 *
 * Aparecen en la lista de Formularios para que el colegio vea en un solo sitio
 * todos los formularios del sitio y sepa a dónde ir, pero se gestionan en su
 * propio módulo.
 *
 * Que estén aquí y no en la tabla `formularios` es deliberado: si estuvieran
 * en la tabla, el constructor dejaría editarles los campos, y cambiar un campo
 * de la solicitud de admisión desde aquí no haría nada —sus columnas son fijas
 * en `solicitudes_admision`— salvo confundir a quien lo intente.
 */

export type FormularioGestionadoAparte = {
  slug: string;
  nombre: string;
  descripcion: string;
  /** A dónde se va para gestionarlo de verdad. */
  href: string;
  /** Dónde lo ve el visitante. */
  rutasPublicas: string[];
  /** Plantilla de correo asociada, en Plantillas de correo para formularios. */
  plantillaCorreo: string;
  motivo: string;
};

export const FORMULARIOS_GESTIONADOS_APARTE: FormularioGestionadoAparte[] = [
  {
    slug: "solicitud-admision",
    nombre: "Solicitud de admisión",
    descripcion:
      "El formulario largo con el que una familia inicia el proceso de admisión.",
    href: "/admin/admisiones",
    rutasPublicas: ["/admisiones/formulario"],
    plantillaCorreo: "admisiones-confirmacion",
    motivo:
      "Tiene su propio módulo con el seguimiento por etapas, el número de solicitud y los correos de cada etapa. Se gestiona desde Admisiones.",
  },
];

export function esGestionadoAparte(slug: string): boolean {
  return FORMULARIOS_GESTIONADOS_APARTE.some((f) => f.slug === slug);
}
