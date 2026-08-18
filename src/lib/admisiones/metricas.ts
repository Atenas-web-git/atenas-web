/**
 * Cálculo de las métricas de admisiones.
 *
 * Va en su propio módulo, sin nada de servidor, por dos razones: se puede leer
 * de un vistazo qué cuenta cada número —que es justo lo que hay que poder
 * defender delante del colegio— y la página se queda con el trabajo de pintar.
 *
 * Todo se calcula en memoria a partir de dos consultas. El padrón de
 * aspirantes de un colegio no llega a los miles, y agrupar en SQL costaría un
 * viaje a la base por cada corte.
 */

import {
  ESTADOS,
  ESTADOS_TERMINALES,
  PIPELINE_HAPPY_PATH,
  type EstadoAdmision,
} from "@/app/admin/(authenticated)/admisiones/constants";

/**
 * Días sin cambiar de estado a partir de los cuales una solicitud se considera
 * detenida.
 *
 * Ya no es una constante: lo edita el colegio en Configuración › Admisiones,
 * porque el número no sale de ninguna norma —lo pusimos nosotros— y quien sabe
 * cuánto es «demasiado tiempo sin llamar a una familia» es admisiones, no
 * nosotros. Esto es solo el valor de partida y el respaldo si la config falla.
 */
export const DIAS_PARA_ESTANCADA_DEFECTO = 14;

/** Ventana de los cortes «en el período». */
export const DIAS_DEL_PERIODO = 30;

export type SolicitudMetrica = {
  id: string;
  numero: string | null;
  estado: string;
  est_nombres: string | null;
  est_apellidos: string | null;
  est_nivel: string | null;
  est_institucion_origen: string | null;
  anio_ingreso: string | null;
  created_at: string;
};

/** Una fila de `solicitudes_historial`, que es lo que fecha los cambios de estado. */
export type CambioDeEstado = {
  solicitud_id: string;
  estado_nuevo: string;
  created_at: string;
};

export type Estancada = {
  id: string;
  numero: string | null;
  nombre: string;
  estado: EstadoAdmision;
  dias: number;
};

export type Corte = { clave: string; total: number };

/** Un mes de la serie temporal. `clave` es `AAAA-MM`, para ordenar sin ambigüedad. */
export type MesSerie = {
  clave: string;
  /** «ago 2026», ya en español y listo para pintar. */
  etiqueta: string;
  entraron: number;
  admitidos: number;
};

/**
 * Cuántos meses caben en la serie antes de recortar por delante.
 *
 * Un ciclo de admisiones dura más o menos un año lectivo; catorce meses lo
 * cubren con holgura y siguen leyéndose en una pantalla sin apretujarse.
 */
export const MESES_DE_SERIE = 14;

const MESES_ES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/** `AAAA-MM` de una fecha ISO, en hora local. */
function claveMes(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function etiquetaMes(clave: string): string {
  const [ano, mes] = clave.split("-");
  return `${MESES_ES[Number(mes) - 1]} ${ano}`;
}

/** Todos los meses entre dos claves, ambos incluidos. Sin huecos. */
function mesesEntre(desde: string, hasta: string): string[] {
  const [a1, m1] = desde.split("-").map(Number);
  const [a2, m2] = hasta.split("-").map(Number);
  const salida: string[] = [];
  let ano = a1;
  let mes = m1;
  // Tope defensivo: sin él, una fecha corrupta en la base —un año 1970 o
  // 9999— colgaría la página en vez de dar un número raro.
  for (let i = 0; i < 600 && (ano < a2 || (ano === a2 && mes <= m2)); i++) {
    salida.push(`${ano}-${String(mes).padStart(2, "0")}`);
    mes += 1;
    if (mes > 12) {
      mes = 1;
      ano += 1;
    }
  }
  return salida;
}

export type Metricas = {
  /** Cuántas hay AHORA en cada estado. Suma el total. */
  porEstado: { estado: EstadoAdmision; total: number }[];
  total: number;
  /** Las que siguen vivas: ni matriculadas ni no admitidas. */
  enProceso: number;
  matriculados: number;
  noAdmitidos: number;
  /** Detenidas más días de los configurados, de la más antigua a la más reciente. */
  estancadas: Estancada[];
  /** El umbral que se usó, para que la pantalla lo diga sin volver a leer la config. */
  diasParaEstancada: number;
  /** Entradas y admisiones dentro de la ventana del período. */
  nuevasEnPeriodo: number;
  admitidasEnPeriodo: number;
  /**
   * El embudo: cuántos aspirantes han llegado AL MENOS hasta cada etapa.
   *
   * No es «cuántos están ahí ahora». Quien está matriculado ya pasó por
   * «postulante», así que contarlo solo en su estado actual vaciaría las etapas
   * de arriba conforme avanza el proceso, y el embudo diría que cada vez entra
   * menos gente cuando pasa justo lo contrario.
   */
  embudo: { estado: EstadoAdmision; alcanzaron: number }[];
  /**
   * La evolución en el tiempo: cuántas entraron y cuántas admitió el Comité
   * cada mes.
   *
   * Va del mes de la primera solicitud del año al mes actual, sin huecos: los
   * meses sin nada salen en cero. Si se dejaran fuera, dos meses vacíos
   * seguidos se leerían como una caída suave en vez de como un parón.
   */
  serieMensual: MesSerie[];
  /**
   * Cuántos meses se dejaron fuera por delante, si el período es más largo que
   * {@link MESES_DE_SERIE}. Se dice en pantalla — recortar en silencio haría
   * pensar que el proceso empezó más tarde de lo que empezó.
   */
  mesesOmitidos: number;
  porNivel: Corte[];
  porInstitucion: Corte[];
  /**
   * Solicitudes que no caen en NINGUNA pestaña: sin año lectivo, o con uno que
   * ya no está en el catálogo activo. Quedan fuera de todo lo de arriba y por
   * eso se cuentan aparte — esconderlas sería mentir.
   *
   * Las dos mitades son distintas y las dos hacen falta:
   *
   * - **Sin año** — el campo es opcional en el formulario público, así que no
   *   son un resto del pasado: seguirán entrando.
   * - **Con un año que ya no está activo** — desactivar un año lectivo es un
   *   interruptor libre en Configuración, sin ninguna guarda. El día que el
   *   colegio desactive el año que acaba de cerrar, toda esa promoción se
   *   quedaría sin pestaña donde mirarse. Contándola aquí al menos no
   *   desaparece en silencio.
   *
   * Mismo criterio y misma redacción que la pantalla de Cupos, que ya lo
   * resolvía así: dos pestañas contiguas no pueden dar números distintos bajo
   * un aviso casi idéntico.
   */
  sinAnoLectivo: number;
};

function nombreDe(s: SolicitudMetrica): string {
  const n = `${s.est_nombres ?? ""} ${s.est_apellidos ?? ""}`.trim();
  return n || s.numero || "(sin nombre)";
}

function diasEntre(desde: string, hasta: number): number {
  return Math.floor((hasta - new Date(desde).getTime()) / 86_400_000);
}

/**
 * Cuántas filas se listan en un corte antes de agrupar el resto en «Otros».
 *
 * No es estética. «Institución de origen» es texto libre que rellena cualquier
 * visitante desde el formulario público, sin catálogo ni límite de longitud, y
 * el endpoint no tiene límite de peticiones: sin tope, quien quiera puede
 * llenar la pantalla del panel con las filas y el texto que le apetezca.
 */
const FILAS_POR_CORTE = 10;

/** Un nombre más largo que esto rompe la fila; se corta al pintarlo. */
const LARGO_MAXIMO_CLAVE = 60;

function agrupar(
  filas: SolicitudMetrica[],
  clave: (s: SolicitudMetrica) => string | null
): Corte[] {
  // `Map` y no un objeto: una institución llamada `__proto__` o `constructor`
  // contaminaría el prototipo de un objeto plano.
  const mapa = new Map<string, number>();
  for (const f of filas) {
    const k = (clave(f) ?? "").trim().slice(0, LARGO_MAXIMO_CLAVE);
    if (!k) continue;
    mapa.set(k, (mapa.get(k) ?? 0) + 1);
  }
  const todas = [...mapa.entries()]
    .map(([clave, total]) => ({ clave, total }))
    .sort((a, b) => b.total - a.total || a.clave.localeCompare(b.clave, "es"));

  if (todas.length <= FILAS_POR_CORTE) return todas;

  const visibles = todas.slice(0, FILAS_POR_CORTE);
  const resto = todas.slice(FILAS_POR_CORTE);
  // El resto se suma en vez de desaparecer: los totales de la tarjeta tienen
  // que seguir cuadrando con los de arriba.
  return [
    ...visibles,
    {
      clave: `Otras ${resto.length}`,
      total: resto.reduce((s, r) => s + r.total, 0),
    },
  ];
}

/**
 * @param todas       todas las solicitudes, sin filtrar por año
 * @param anoLectivo  el año que se está mirando
 * @param anosActivos los años del catálogo, es decir, las pestañas que existen
 * @param historial   cambios de estado, para fechar cuánto lleva parada cada una
 * @param ahora       marca de tiempo del cálculo, inyectada para poder probarlo
 * @param diasParaEstancada  umbral de «detenido», que edita el colegio
 */
export function calcularMetricas(
  todas: SolicitudMetrica[],
  anoLectivo: string,
  anosActivos: string[],
  historial: CambioDeEstado[],
  ahora: number,
  diasParaEstancada: number = DIAS_PARA_ESTANCADA_DEFECTO
): Metricas {
  const filas = todas.filter((s) => s.anio_ingreso === anoLectivo);

  const porEstado = ESTADOS.map((estado) => ({
    estado,
    total: filas.filter((s) => s.estado === estado).length,
  }));

  // La fecha del ÚLTIMO cambio de estado de cada solicitud. Se usa esto y no
  // `updated_at` porque `updated_at` se mueve con cualquier edición —corregir
  // un apellido, añadir una nota— y entonces una solicitud olvidada parecería
  // recién atendida.
  const ultimoCambio = new Map<string, string>();
  // Hasta dónde llegó cada solicitud en el camino feliz, por índice de etapa.
  //
  // Hace falta el historial y no basta el estado actual por los NO ADMITIDOS:
  // alguien rechazado en «en evaluación» sí pasó antes por interesado, por
  // postulante y por postulación completa, y mirando solo su estado de hoy no
  // contaría en ninguna etapa. El embudo diría que por arriba entró menos gente
  // de la que entró.
  const masLejos = new Map<string, number>();
  const anotar = (id: string, estado: string) => {
    const i = PIPELINE_HAPPY_PATH.indexOf(estado as EstadoAdmision);
    if (i < 0) return; // `no_admitido` no está en el camino: no marca etapa
    if (i > (masLejos.get(id) ?? -1)) masLejos.set(id, i);
  };

  for (const h of historial) {
    const previo = ultimoCambio.get(h.solicitud_id);
    if (!previo || h.created_at > previo) ultimoCambio.set(h.solicitud_id, h.created_at);
    anotar(h.solicitud_id, h.estado_nuevo);
  }
  // El estado actual también cuenta: cubre las filas sin historial, que las
  // habría si alguna vez se importan solicitudes por SQL saltándose el trigger.
  for (const s of filas) anotar(s.id, s.estado);

  const estancadas = filas
    .filter((s) => !ESTADOS_TERMINALES.has(s.estado as EstadoAdmision))
    .map((s) => ({
      id: s.id,
      numero: s.numero,
      nombre: nombreDe(s),
      estado: s.estado as EstadoAdmision,
      // Si no hay historial —el trigger existe desde el principio, pero una
      // fila importada a mano podría no tenerlo— se cae a la fecha de creación,
      // que es cuándo entró y por tanto cuánto lleva sin moverse.
      dias: diasEntre(ultimoCambio.get(s.id) ?? s.created_at, ahora),
    }))
    .filter((e) => e.dias >= diasParaEstancada)
    .sort((a, b) => b.dias - a.dias);

  const desdeMs = ahora - DIAS_DEL_PERIODO * 86_400_000;
  const idsDelAno = new Set(filas.map((s) => s.id));

  // ── La evolución en el tiempo ──────────────────────────────────────────
  //
  // Se cuenta por mes: cuántas ENTRARON (su `created_at`) y cuántas ADMITIÓ el
  // Comité (la fila del historial, no el estado de hoy — alguien admitido en
  // mayo y matriculado en junio cuenta en mayo, que es cuando se decidió).
  const entradasPorMes = new Map<string, number>();
  for (const s of filas) {
    const k = claveMes(s.created_at);
    entradasPorMes.set(k, (entradasPorMes.get(k) ?? 0) + 1);
  }
  const admitidosPorMes = new Map<string, number>();
  for (const h of historial) {
    if (h.estado_nuevo !== "admitido" || !idsDelAno.has(h.solicitud_id)) continue;
    const k = claveMes(h.created_at);
    admitidosPorMes.set(k, (admitidosPorMes.get(k) ?? 0) + 1);
  }

  const mesActual = claveMes(new Date(ahora).toISOString());
  const clavesConDatos = [...entradasPorMes.keys(), ...admitidosPorMes.keys()].sort();
  // El primer mes con algo, o el actual si no hay nada. Se llega hasta hoy
  // aunque los últimos meses estén vacíos: un parón reciente es justo lo que
  // hay que ver.
  const primerMes = clavesConDatos[0] ?? mesActual;
  const todosLosMeses = mesesEntre(
    primerMes <= mesActual ? primerMes : mesActual,
    mesActual
  );
  const mesesOmitidos = Math.max(0, todosLosMeses.length - MESES_DE_SERIE);
  const serieMensual: MesSerie[] = todosLosMeses.slice(-MESES_DE_SERIE).map((clave) => ({
    clave,
    etiqueta: etiquetaMes(clave),
    entraron: entradasPorMes.get(clave) ?? 0,
    admitidos: admitidosPorMes.get(clave) ?? 0,
  }));

  return {
    porEstado,
    total: filas.length,
    enProceso: filas.filter(
      (s) => !ESTADOS_TERMINALES.has(s.estado as EstadoAdmision)
    ).length,
    matriculados: filas.filter((s) => s.estado === "matriculado").length,
    noAdmitidos: filas.filter((s) => s.estado === "no_admitido").length,
    estancadas,
    diasParaEstancada,
    nuevasEnPeriodo: filas.filter((s) => new Date(s.created_at).getTime() >= desdeMs)
      .length,
    // Admitidas EN el período, no «que están admitidas»: cuenta el momento en
    // que el Comité las aceptó, aunque después hayan pasado a matriculadas.
    admitidasEnPeriodo: historial.filter(
      (h) =>
        h.estado_nuevo === "admitido" &&
        idsDelAno.has(h.solicitud_id) &&
        new Date(h.created_at).getTime() >= desdeMs
    ).length,
    embudo: PIPELINE_HAPPY_PATH.map((estado, i) => ({
      estado,
      alcanzaron: filas.filter((s) => (masLejos.get(s.id) ?? -1) >= i).length,
    })),
    serieMensual,
    mesesOmitidos,
    porNivel: agrupar(filas, (s) => s.est_nivel),
    porInstitucion: agrupar(filas, (s) => s.est_institucion_origen),
    sinAnoLectivo: todas.filter((s) => !anosActivos.includes(s.anio_ingreso ?? "")).length,
  };
}
