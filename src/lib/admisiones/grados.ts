/**
 * Los años escolares del colegio, por nivel.
 *
 * Hasta ahora la solicitud de admisión solo preguntaba el NIVEL —cuatro
 * opciones— y nunca el año. Con eso no se puede hacer ninguna de las dos cosas
 * que pidió el colegio el 2026-07-27: ni llevar cupos por año, ni avisar de que
 * 2do y 3ro de bachillerato se tramitan presencialmente.
 *
 * El catálogo vive en código y no en el CMS a propósito: es la estructura del
 * sistema educativo ecuatoriano, no un texto que el colegio vaya a querer
 * cambiar. Los cupos de cada año sí son suyos y sí se editan.
 *
 * ⚠️ El texto del aviso de trámite presencial **todavía NO es editable**: está
 * escrito en `FormularioMultiStep.tsx`. Sus campos vecinos del paso 1 sí lo
 * son, desde Configuración › Admisiones, así que es una inconsistencia a
 * cerrar — no una decisión.
 *
 * ⚠️ Y las etiquetas de nivel de aquí abajo tienen que coincidir EXACTAMENTE
 * con las de Configuración › Admisiones, que el colegio puede editar. Si no
 * coinciden, este catálogo no reconoce el nivel y el selector de año no
 * aparece; el formulario lo tolera y no exige el año, pero se pierde el dato.
 * Hay tres copias sueltas de esa lista: aquí, en `admisiones/constants.ts` y en
 * los defaults de `lib/cms/admisionesTextos.ts`.
 *
 * Módulo PURO: sin `createAdminClient` ni nada de servidor. Lo importa el
 * formulario público, que es un componente de cliente — el mismo tropiezo que
 * hubo con `lib/vacantes/tipos.ts` y rompió el build de Turbopack.
 */

/** Las etiquetas son EXACTAMENTE las que ya usa `solicitudes_admision.est_nivel`. */
export const NIVELES = [
  "Educación Inicial",
  "EGB Elemental y Media",
  "EGB Superior",
  "Bachillerato IB",
] as const;

export type Nivel = (typeof NIVELES)[number];

/**
 * Los años de cada nivel, en el orden en que los ve una familia.
 *
 * Coinciden con lo que ya dicen las páginas públicas: Inicial es «Pre-Kinder y
 * Kinder», EGB Elemental y Media «1ro a 7mo», EGB Superior «8vo a 10mo».
 */
export const GRADOS_POR_NIVEL: Record<Nivel, string[]> = {
  "Educación Inicial": ["Pre-Kinder", "Kinder"],
  "EGB Elemental y Media": [
    "1ro EGB",
    "2do EGB",
    "3ro EGB",
    "4to EGB",
    "5to EGB",
    "6to EGB",
    "7mo EGB",
  ],
  "EGB Superior": ["8vo EGB", "9no EGB", "10mo EGB"],
  "Bachillerato IB": [
    "1ro de Bachillerato",
    "2do de Bachillerato",
    "3ro de Bachillerato",
  ],
};

/** Los quince años, en orden, para las pantallas que los listan todos. */
export const TODOS_LOS_GRADOS: { nivel: Nivel; grado: string }[] = NIVELES.flatMap(
  (nivel) => GRADOS_POR_NIVEL[nivel].map((grado) => ({ nivel, grado }))
);

/**
 * Los años que NO se tramitan por la web.
 *
 * El colegio se reserva el derecho de admisión en 2do y 3ro de bachillerato y
 * el trámite se hace en persona. Decisión de la reunión del 2026-07-27.
 *
 * **La solicitud se acepta igual**, no se bloquea: se avisa antes de que la
 * persona rellene todo. Un contacto perdido no se recupera, y el colegio
 * conserva su derecho de admisión de todos modos.
 */
export const GRADOS_TRAMITE_PRESENCIAL: string[] = [
  "2do de Bachillerato",
  "3ro de Bachillerato",
];

export function esTramitePresencial(grado: string | null | undefined): boolean {
  return !!grado && GRADOS_TRAMITE_PRESENCIAL.includes(grado.trim());
}

/** ¿Este año pertenece de verdad a este nivel? Para validar lo que llega. */
export function gradoValido(nivel: string, grado: string): boolean {
  const lista = GRADOS_POR_NIVEL[nivel as Nivel];
  return Array.isArray(lista) && lista.includes(grado);
}

export function esNivel(valor: string): valor is Nivel {
  return (NIVELES as readonly string[]).includes(valor);
}
