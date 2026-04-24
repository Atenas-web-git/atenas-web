export type TipoEvento =
  | "feriado"
  | "evaluacion"
  | "ceremonia"
  | "academico"
  | "vacaciones";

export interface EventoCronograma {
  id: string;
  titulo: string;
  quimestre: 1 | 2;
  año: number;
  mes: number;
  dia: number;
  mesFin?: number;
  diaFin?: number;
  añoFin?: number;
  tipo: TipoEvento;
}

export const EVENTOS: EventoCronograma[] = [
  // ─── QUIMESTRE 1 ─────────────────────────────────────────
  {
    id: "q1-01",
    titulo: "Inicio del Año Lectivo 2026–2027",
    quimestre: 1,
    año: 2026,
    mes: 9,
    dia: 8,
    tipo: "ceremonia",
  },
  {
    id: "q1-02",
    titulo: "Día del Maestro",
    quimestre: 1,
    año: 2026,
    mes: 10,
    dia: 1,
    tipo: "feriado",
  },
  {
    id: "q1-03",
    titulo: "Evaluaciones Parciales Quimestre 1",
    quimestre: 1,
    año: 2026,
    mes: 10,
    dia: 15,
    mesFin: 10,
    diaFin: 17,
    añoFin: 2026,
    tipo: "evaluacion",
  },
  {
    id: "q1-04",
    titulo: "Día de Difuntos",
    quimestre: 1,
    año: 2026,
    mes: 11,
    dia: 2,
    tipo: "feriado",
  },
  {
    id: "q1-05",
    titulo: "Día de la Madre",
    quimestre: 1,
    año: 2026,
    mes: 11,
    dia: 13,
    tipo: "ceremonia",
  },
  {
    id: "q1-06",
    titulo: "Evaluaciones Finales Quimestre 1",
    quimestre: 1,
    año: 2026,
    mes: 11,
    dia: 25,
    mesFin: 12,
    diaFin: 4,
    añoFin: 2026,
    tipo: "evaluacion",
  },
  {
    id: "q1-07",
    titulo: "Entrega de Libretas Q1",
    quimestre: 1,
    año: 2026,
    mes: 12,
    dia: 5,
    tipo: "ceremonia",
  },
  {
    id: "q1-08",
    titulo: "Vacaciones de Navidad y Fin de Año",
    quimestre: 1,
    año: 2026,
    mes: 12,
    dia: 22,
    mesFin: 1,
    diaFin: 4,
    añoFin: 2027,
    tipo: "vacaciones",
  },
  // ─── QUIMESTRE 2 ─────────────────────────────────────────
  {
    id: "q2-01",
    titulo: "Regreso a Clases — Inicio Q2",
    quimestre: 2,
    año: 2027,
    mes: 1,
    dia: 5,
    tipo: "academico",
  },
  {
    id: "q2-02",
    titulo: "Evaluaciones Parciales Quimestre 2",
    quimestre: 2,
    año: 2027,
    mes: 2,
    dia: 1,
    mesFin: 2,
    diaFin: 3,
    añoFin: 2027,
    tipo: "evaluacion",
  },
  {
    id: "q2-03",
    titulo: "Carnaval — Feriado Nacional",
    quimestre: 2,
    año: 2027,
    mes: 2,
    dia: 27,
    mesFin: 3,
    diaFin: 2,
    añoFin: 2027,
    tipo: "vacaciones",
  },
  {
    id: "q2-04",
    titulo: "Día Internacional de la Mujer",
    quimestre: 2,
    año: 2027,
    mes: 3,
    dia: 8,
    tipo: "academico",
  },
  {
    id: "q2-05",
    titulo: "Vacaciones de Semana Santa",
    quimestre: 2,
    año: 2027,
    mes: 4,
    dia: 1,
    mesFin: 4,
    diaFin: 9,
    añoFin: 2027,
    tipo: "vacaciones",
  },
  {
    id: "q2-06",
    titulo: "Día del Trabajo",
    quimestre: 2,
    año: 2027,
    mes: 5,
    dia: 1,
    tipo: "feriado",
  },
  {
    id: "q2-07",
    titulo: "Batalla de Pichincha / Día del Maestro",
    quimestre: 2,
    año: 2027,
    mes: 5,
    dia: 24,
    tipo: "feriado",
  },
  {
    id: "q2-08",
    titulo: "Evaluaciones Finales Quimestre 2",
    quimestre: 2,
    año: 2027,
    mes: 5,
    dia: 25,
    mesFin: 6,
    diaFin: 4,
    añoFin: 2027,
    tipo: "evaluacion",
  },
  {
    id: "q2-09",
    titulo: "Acto de Graduación",
    quimestre: 2,
    año: 2027,
    mes: 6,
    dia: 18,
    tipo: "ceremonia",
  },
  {
    id: "q2-10",
    titulo: "Clausura del Año Lectivo 2026–2027",
    quimestre: 2,
    año: 2027,
    mes: 6,
    dia: 25,
    tipo: "ceremonia",
  },
];

export const MESES_NOMBRES = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const MESES_CORTOS = [
  "",
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const DIA_ABREV = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const TIPO_LABELS: Record<TipoEvento, string> = {
  feriado: "Feriado",
  evaluacion: "Evaluación",
  ceremonia: "Ceremonia",
  academico: "Académico",
  vacaciones: "Vacaciones",
};

export function getEventosQuimestre(q: 1 | 2): EventoCronograma[] {
  return EVENTOS.filter((e) => e.quimestre === q);
}

export function getEventosMes(year: number, month: number): EventoCronograma[] {
  return EVENTOS.filter((e) => {
    const start = new Date(e.año, e.mes - 1, e.dia);
    const end = e.diaFin
      ? new Date(e.añoFin ?? e.año, (e.mesFin ?? e.mes) - 1, e.diaFin)
      : start;
    const mStart = new Date(year, month - 1, 1);
    const mEnd = new Date(year, month, 0);
    return start <= mEnd && end >= mStart;
  });
}

export function getEventosEnDia(
  year: number,
  month: number,
  day: number
): EventoCronograma[] {
  const check = new Date(year, month - 1, day);
  return EVENTOS.filter((e) => {
    const start = new Date(e.año, e.mes - 1, e.dia);
    const end = e.diaFin
      ? new Date(e.añoFin ?? e.año, (e.mesFin ?? e.mes) - 1, e.diaFin)
      : start;
    return check >= start && check <= end;
  });
}

export function getDiasConEventos(year: number, month: number): Set<number> {
  const dias = new Set<number>();
  const eventos = getEventosMes(year, month);
  eventos.forEach((e) => {
    const start = new Date(e.año, e.mes - 1, e.dia);
    const end = e.diaFin
      ? new Date(e.añoFin ?? e.año, (e.mesFin ?? e.mes) - 1, e.diaFin)
      : start;
    const cur = new Date(start);
    while (cur <= end) {
      if (cur.getFullYear() === year && cur.getMonth() + 1 === month) {
        dias.add(cur.getDate());
      }
      cur.setDate(cur.getDate() + 1);
    }
  });
  return dias;
}

export function formatFecha(e: EventoCronograma): string {
  const start = new Date(e.año, e.mes - 1, e.dia);
  const inicioStr = `${DIA_ABREV[start.getDay()]} ${e.dia} ${MESES_CORTOS[e.mes].toLowerCase()}`;
  if (!e.diaFin) return inicioStr;
  const end = new Date(e.añoFin ?? e.año, (e.mesFin ?? e.mes) - 1, e.diaFin);
  const finMes = e.mesFin ?? e.mes;
  const finStr = `${DIA_ABREV[end.getDay()]} ${e.diaFin} ${MESES_CORTOS[finMes].toLowerCase()}`;
  return `${inicioStr} – ${finStr}`;
}

export function formatFechaRango(e: EventoCronograma): string {
  const inicioStr = `${e.dia} ${MESES_CORTOS[e.mes]}`;
  if (!e.diaFin) return `${inicioStr} ${e.año}`;
  const finMes = e.mesFin ?? e.mes;
  const finAño = e.añoFin ?? e.año;
  if (finMes === e.mes && finAño === e.año) {
    return `${e.dia}–${e.diaFin} ${MESES_CORTOS[e.mes]} ${e.año}`;
  }
  return `${inicioStr} – ${e.diaFin} ${MESES_CORTOS[finMes]} ${finAño}`;
}
