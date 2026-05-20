"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import type {
  CronogramaPeriodoPublico,
  CronogramaTipoPublico,
  CronogramaEventoPublico,
  CronogramaColor,
} from "@/lib/cms/getCronograma";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Vista = "tarjetas" | "calendario" | "timeline";
type CalVista = "mensual" | "semanal" | "diario";

// Paleta para colores de períodos. Los colores que el cliente elige por
// período se usan tanto para los badges de evento como para los headers
// de cada tarjeta (vista Tarjetas) o sección (vista Timeline).
const PALETA: Record<
  CronogramaColor,
  { color: string; bg: string; border: string }
> = {
  gold: { color: "var(--color-gold)", bg: "rgba(201,168,76,0.10)", border: "rgba(201,168,76,0.20)" },
  red:  { color: "var(--color-red)", bg: "rgba(158,25,21,0.07)",  border: "rgba(158,25,21,0.15)" },
  teal: { color: "#0D9488", bg: "rgba(13,148,136,0.08)", border: "rgba(13,148,136,0.18)" },
  navy: { color: "var(--color-navy)", bg: "rgba(26,43,74,0.07)",   border: "rgba(26,43,74,0.12)" },
  purple: { color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.18)" },
};

const MESES_NOMBRES = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const MESES_CORTOS = [
  "", "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const DIA_ABREV = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];
const DIA_SEMANA_LARGO = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];

// ─── Helpers de fechas (los eventos guardan fecha_inicio/fin como ISO date) ─

function parseISO(iso: string): Date {
  // Forzamos hora 12:00 para evitar problemas de timezone
  const [y, m, d] = iso.split("-").map((s) => Number(s));
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0);
}

function startOf(ev: CronogramaEventoPublico): Date {
  return parseISO(ev.fecha_inicio);
}

function endOf(ev: CronogramaEventoPublico): Date {
  return parseISO(ev.fecha_fin ?? ev.fecha_inicio);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // 0 = lunes para nuestro grid
  const d = new Date(year, month - 1, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function getWeeksForMonth(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month - 1, 1);
  const dayOfWeek = firstDay.getDay();
  const daysBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const start = new Date(year, month - 1, 1 - daysBack);
  const lastDay = new Date(year, month, 0);
  const weeks: Date[][] = [];
  const cur = new Date(start);
  while (cur.getTime() <= lastDay.getTime()) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function evCubreFecha(ev: CronogramaEventoPublico, target: Date): boolean {
  const s = startOf(ev);
  const e = endOf(ev);
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate(), 12);
  return t >= s && t <= e;
}

function eventosEnDia(
  eventos: CronogramaEventoPublico[],
  year: number,
  month: number,
  day: number
): CronogramaEventoPublico[] {
  const target = new Date(year, month - 1, day, 12);
  return eventos.filter((e) => evCubreFecha(e, target));
}

function eventosEnMes(
  eventos: CronogramaEventoPublico[],
  year: number,
  month: number
): CronogramaEventoPublico[] {
  const mStart = new Date(year, month - 1, 1, 12);
  const mEnd = new Date(year, month, 0, 12);
  return eventos.filter((ev) => {
    const s = startOf(ev);
    const e = endOf(ev);
    return s <= mEnd && e >= mStart;
  });
}

function diasConEventos(
  eventos: CronogramaEventoPublico[],
  year: number,
  month: number
): Set<number> {
  const dias = new Set<number>();
  const evs = eventosEnMes(eventos, year, month);
  for (const ev of evs) {
    const s = startOf(ev);
    const e = endOf(ev);
    const cur = new Date(s);
    while (cur <= e) {
      if (cur.getFullYear() === year && cur.getMonth() + 1 === month) {
        dias.add(cur.getDate());
      }
      cur.setDate(cur.getDate() + 1);
    }
  }
  return dias;
}

function formatFecha(ev: CronogramaEventoPublico): string {
  const s = startOf(ev);
  const inicio = `${DIA_ABREV[s.getDay()]} ${s.getDate()} ${MESES_CORTOS[s.getMonth() + 1].toLowerCase()}`;
  if (!ev.fecha_fin || ev.fecha_fin === ev.fecha_inicio) return inicio;
  const e = endOf(ev);
  const fin = `${DIA_ABREV[e.getDay()]} ${e.getDate()} ${MESES_CORTOS[e.getMonth() + 1].toLowerCase()}`;
  return `${inicio} – ${fin}`;
}

function formatFechaRango(ev: CronogramaEventoPublico): string {
  const s = startOf(ev);
  const inicio = `${s.getDate()} ${MESES_CORTOS[s.getMonth() + 1]}`;
  if (!ev.fecha_fin || ev.fecha_fin === ev.fecha_inicio) return `${inicio} ${s.getFullYear()}`;
  const e = endOf(ev);
  if (e.getMonth() === s.getMonth() && e.getFullYear() === s.getFullYear()) {
    return `${s.getDate()}–${e.getDate()} ${MESES_CORTOS[s.getMonth() + 1]} ${s.getFullYear()}`;
  }
  return `${inicio} – ${e.getDate()} ${MESES_CORTOS[e.getMonth() + 1]} ${e.getFullYear()}`;
}

// ─── Vista Tarjetas: una tarjeta por período ─────────────────────────────

type Helpers = {
  periodoById: Map<number, CronogramaPeriodoPublico>;
  tipoById: Map<number, CronogramaTipoPublico>;
};

function TarjetasView({
  eventos,
  periodos,
  helpers,
}: {
  eventos: CronogramaEventoPublico[];
  periodos: CronogramaPeriodoPublico[];
  helpers: Helpers;
}) {
  function groupByMonth(evs: CronogramaEventoPublico[]) {
    const map = new Map<string, CronogramaEventoPublico[]>();
    for (const e of evs) {
      const s = startOf(e);
      const key = `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }

  function rangoPeriodo(periodoId: number): string {
    const evs = eventos.filter((e) => e.periodo_id === periodoId);
    if (evs.length === 0) return "";
    const ordenados = [...evs].sort(
      (a, b) => parseISO(a.fecha_inicio).getTime() - parseISO(b.fecha_inicio).getTime()
    );
    const ini = startOf(ordenados[0]);
    const fin = endOf(ordenados[ordenados.length - 1]);
    return `${MESES_CORTOS[ini.getMonth() + 1]} ${ini.getFullYear()} – ${MESES_CORTOS[fin.getMonth() + 1]} ${fin.getFullYear()}`;
  }

  function CardPeriodo({ periodo }: { periodo: CronogramaPeriodoPublico }) {
    const evs = eventos.filter((e) => e.periodo_id === periodo.id);
    const grouped = groupByMonth(evs);
    const palette = PALETA[periodo.color];
    const rango = rangoPeriodo(periodo.id);

    return (
      <div
        className="flex-1 rounded-[14px] overflow-hidden flex flex-col"
        style={{
          background: "#FFFFFF",
          border: `1.5px solid ${palette.border}`,
          boxShadow: "0 4px 24px rgba(13,24,37,0.06)",
          minWidth: 0,
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: palette.color }}
        >
          <span
            className="inline-flex items-center px-3 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.15)",
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {periodo.nombre}
          </span>
          {rango && (
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.70)" }}>
              {rango}
            </span>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col gap-5">
          {grouped.size === 0 && (
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(13,24,37,0.45)", textAlign: "center", padding: "20px 0" }}>
              Sin eventos programados.
            </p>
          )}
          {Array.from(grouped.entries()).map(([key, monthEvs]) => {
            const [yStr, mStr] = key.split("-");
            const y = parseInt(yStr);
            const m = parseInt(mStr);
            return (
              <div key={key}>
                <div
                  className="flex items-center gap-2 mb-3"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: palette.color,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ display: "block", width: 16, height: 1.5, background: palette.color, flexShrink: 0 }} />
                  {MESES_NOMBRES[m]} {y}
                </div>

                <div className="flex flex-col gap-[10px] pl-4">
                  {monthEvs.map((e) => {
                    const tipo = helpers.tipoById.get(e.tipo_id);
                    return (
                      <div key={e.id} className="flex items-start gap-3">
                        <div
                          style={{
                            marginTop: 5,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: palette.color,
                            flexShrink: 0,
                          }}
                        />
                        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600, color: "var(--color-navy)", lineHeight: 1.35 }}>
                            {e.titulo}
                          </span>
                          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(13,24,37,0.48)" }}>
                            {formatFechaRango(e)}
                          </span>
                        </div>
                        {tipo && (
                          <span
                            className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: 9,
                              fontWeight: 700,
                              background: palette.bg,
                              color: palette.color,
                              letterSpacing: 0.5,
                              textTransform: "uppercase",
                              marginTop: 3,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {tipo.nombre}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${palette.border}` }}>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(13,24,37,0.40)" }}>
            {evs.length} {evs.length === 1 ? "actividad programada" : "actividades programadas"}
          </span>
        </div>
      </div>
    );
  }

  if (periodos.length === 0) {
    return (
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.45)", textAlign: "center", padding: "32px 0" }}>
        No hay períodos definidos.
      </p>
    );
  }

  return (
    <div className={periodos.length <= 2 ? "flex flex-col md:flex-row gap-5" : "grid grid-cols-1 md:grid-cols-3 gap-5"}>
      {periodos.map((p) => (
        <CardPeriodo key={p.id} periodo={p} />
      ))}
    </div>
  );
}

// ─── Vista Calendario Mensual ───────────────────────────────────────────

function CalendarioMensual({
  year,
  month,
  eventos,
  helpers,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  year: number;
  month: number;
  eventos: CronogramaEventoPublico[];
  helpers: Helpers;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  const diasConEvs = diasConEventos(eventos, year, month);
  const evMes = eventosEnMes(eventos, year, month);
  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 1 ? 12 : month - 1);

  function colorDelDia(day: number): string | null {
    const evs = eventosEnDia(eventos, year, month, day);
    if (!evs.length) return null;
    const periodo = helpers.periodoById.get(evs[0].periodo_id);
    return periodo ? PALETA[periodo.color].color : null;
  }

  type Cell = { day: number; current: boolean; color: string | null };
  const cells: Cell[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false, color: null });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, current: true, color: diasConEvs.has(d) ? colorDelDia(d) : null });
  }
  const rem = 7 - (cells.length % 7);
  if (rem < 7) {
    for (let d = 1; d <= rem; d++) cells.push({ day: d, current: false, color: null });
  }
  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-[14px] overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(26,43,74,0.08)",
          boxShadow: "0 4px 24px rgba(13,24,37,0.06)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(26,43,74,0.06)" }}>
          <NavBtn onClick={onPrev} disabled={!canPrev} dir="prev" />
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--color-navy)" }}>
            {MESES_NOMBRES[month]} {year}
          </span>
          <NavBtn onClick={onNext} disabled={!canNext} dir="next" />
        </div>

        <div className="grid grid-cols-7" style={{ borderBottom: "1px solid rgba(26,43,74,0.05)" }}>
          {DIAS.map((d) => (
            <div
              key={d}
              className="flex items-center justify-center py-2"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(26,43,74,0.40)", letterSpacing: 1 }}
            >
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid grid-cols-7"
            style={{ borderBottom: wi < weeks.length - 1 ? "1px solid rgba(26,43,74,0.04)" : "none" }}
          >
            {week.map((cell, di) => (
              <div key={di} className="flex items-center justify-center" style={{ height: 44 }}>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 34, height: 34, background: cell.color ?? "transparent", transition: "background 0.15s ease" }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      fontWeight: cell.color ? 700 : cell.current ? 500 : 400,
                      color: cell.color ? "#FFFFFF" : cell.current ? "var(--color-navy)" : "rgba(26,43,74,0.22)",
                    }}
                  >
                    {cell.day}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {evMes.length > 0 ? (
        <div
          className="rounded-[14px] p-5 flex flex-col gap-3"
          style={{ background: "rgba(26,43,74,0.03)", border: "1.5px solid rgba(26,43,74,0.06)" }}
        >
          {evMes.map((e) => {
            const periodo = helpers.periodoById.get(e.periodo_id);
            const tipo = helpers.tipoById.get(e.tipo_id);
            const palette = PALETA[periodo?.color ?? "navy"];
            return (
              <div key={e.id} className="flex items-start gap-3">
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: palette.color, flexShrink: 0, marginTop: 5 }} />
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600, color: "var(--color-navy)" }}>
                    {formatFecha(e)} — {e.titulo}
                  </span>
                  {tipo && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 9,
                        fontWeight: 700,
                        background: `${palette.color}18`,
                        color: palette.color,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tipo.nombre}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.40)", textAlign: "center", padding: "24px 0" }}>
          No hay actividades programadas para este mes.
        </p>
      )}
    </div>
  );
}

// ─── Vista Calendario Semanal ───────────────────────────────────────────

function CalendarioSemanal({
  year,
  month,
  weekIdx,
  eventos,
  helpers,
  onPrevWeek,
  onNextWeek,
}: {
  year: number;
  month: number;
  weekIdx: number;
  eventos: CronogramaEventoPublico[];
  helpers: Helpers;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}) {
  const weeks = getWeeksForMonth(year, month);
  const safeIdx = Math.min(weekIdx, weeks.length - 1);
  const week = weeks[safeIdx];
  const canPrevWeek = safeIdx > 0;
  const canNextWeek = safeIdx < weeks.length - 1;
  const startDay = week[0];
  const endDay = week[6];

  function fmt(d: Date) {
    return `${MESES_CORTOS[d.getMonth() + 1]} ${d.getDate()}`;
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between px-5 py-3 rounded-[10px]"
        style={{ background: "rgba(26,43,74,0.04)", border: "1.5px solid rgba(26,43,74,0.07)" }}
      >
        <NavBtn onClick={onPrevWeek} disabled={!canPrevWeek} dir="prev" inline />
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700, color: "var(--color-navy)" }}>
          {fmt(startDay)} – {fmt(endDay)} {endDay.getFullYear()}
        </span>
        <NavBtn onClick={onNextWeek} disabled={!canNextWeek} dir="next" inline />
      </div>

      <div className="hidden md:grid grid-cols-7 gap-2">
        {week.map((date, i) => {
          const d = date.getDate();
          const m = date.getMonth() + 1;
          const y = date.getFullYear();
          const isCurrentMonth = m === month && y === year;
          const dayEvs = eventosEnDia(eventos, y, m, d);
          return (
            <div
              key={i}
              className="rounded-[10px] flex flex-col gap-2 p-3"
              style={{
                background: isCurrentMonth ? "#FFFFFF" : "rgba(26,43,74,0.02)",
                border: `1.5px solid rgba(26,43,74,${isCurrentMonth ? "0.08" : "0.04"})`,
                minHeight: 120,
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(26,43,74,0.45)", letterSpacing: 1 }}>
                  {DIAS[i]}
                </span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 700, color: isCurrentMonth ? "var(--color-navy)" : "rgba(26,43,74,0.25)" }}>
                  {d}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {dayEvs.map((e) => {
                  const periodo = helpers.periodoById.get(e.periodo_id);
                  const palette = PALETA[periodo?.color ?? "navy"];
                  return (
                    <div
                      key={e.id}
                      className="rounded px-1.5 py-1"
                      style={{
                        background: palette.bg,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 9,
                        fontWeight: 600,
                        color: palette.color,
                        lineHeight: 1.3,
                      }}
                    >
                      {e.titulo.length > 22 ? e.titulo.slice(0, 22) + "…" : e.titulo}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="md:hidden flex flex-col gap-2">
        {week.map((date, i) => {
          const d = date.getDate();
          const m = date.getMonth() + 1;
          const y = date.getFullYear();
          const isCurrentMonth = m === month && y === year;
          const dayEvs = eventosEnDia(eventos, y, m, d);
          return (
            <div
              key={i}
              className="rounded-[10px] flex items-start gap-4 p-4"
              style={{ background: "#FFFFFF", border: `1.5px solid rgba(26,43,74,${isCurrentMonth ? "0.08" : "0.04"})` }}
            >
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 36 }}>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(26,43,74,0.45)", letterSpacing: 1 }}>
                  {DIAS[i]}
                </span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 700, color: isCurrentMonth ? "var(--color-navy)" : "rgba(26,43,74,0.25)" }}>
                  {d}
                </span>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                {dayEvs.length === 0 ? (
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.30)" }}>
                    Sin actividades
                  </span>
                ) : (
                  dayEvs.map((e) => {
                    const periodo = helpers.periodoById.get(e.periodo_id);
                    const palette = PALETA[periodo?.color ?? "navy"];
                    return (
                      <div
                        key={e.id}
                        className="rounded px-2 py-1"
                        style={{
                          background: palette.bg,
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 11,
                          fontWeight: 600,
                          color: palette.color,
                        }}
                      >
                        {e.titulo}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vista Calendario Diario ────────────────────────────────────────────

function CalendarioDiario({
  year,
  month,
  day,
  eventos,
  helpers,
  onPrevDay,
  onNextDay,
}: {
  year: number;
  month: number;
  day: number;
  eventos: CronogramaEventoPublico[];
  helpers: Helpers;
  onPrevDay: () => void;
  onNextDay: () => void;
}) {
  const totalDays = getDaysInMonth(year, month);
  const dateObj = new Date(year, month - 1, day);
  const evs = eventosEnDia(eventos, year, month, day);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex items-center justify-between px-5 py-3 rounded-[10px]"
        style={{ background: "rgba(26,43,74,0.04)", border: "1.5px solid rgba(26,43,74,0.07)" }}
      >
        <NavBtn onClick={onPrevDay} disabled={day <= 1} dir="prev" inline />
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--color-navy)" }}>
          {DIA_SEMANA_LARGO[dateObj.getDay()]}, {day} de {MESES_NOMBRES[month]} {year}
        </span>
        <NavBtn onClick={onNextDay} disabled={day >= totalDays} dir="next" inline />
      </div>

      <div
        className="rounded-[14px] p-6"
        style={{ background: "#FFFFFF", border: "1.5px solid rgba(26,43,74,0.08)", boxShadow: "0 4px 24px rgba(13,24,37,0.05)", minHeight: 160 }}
      >
        {evs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3" style={{ minHeight: 120 }}>
            <span style={{ fontSize: 28 }}>📅</span>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.40)", textAlign: "center" }}>
              No hay actividades programadas para este día.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {evs.map((e) => {
              const periodo = helpers.periodoById.get(e.periodo_id);
              const tipo = helpers.tipoById.get(e.tipo_id);
              const palette = PALETA[periodo?.color ?? "navy"];
              return (
                <div
                  key={e.id}
                  className="flex items-start gap-4 p-4 rounded-[10px]"
                  style={{ background: palette.bg, border: `1.5px solid ${palette.border}` }}
                >
                  <div style={{ width: 4, borderRadius: 2, background: palette.color, alignSelf: "stretch", flexShrink: 0 }} />
                  <div className="flex flex-col gap-1">
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--color-navy)" }}>
                      {e.titulo}
                    </span>
                    {e.descripcion && (
                      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.65)", lineHeight: 1.5 }}>
                        {e.descripcion}
                      </span>
                    )}
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.50)" }}>
                      {formatFecha(e)}
                    </span>
                    {tipo && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded mt-1 self-start"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 9,
                          fontWeight: 700,
                          background: `${palette.color}22`,
                          color: palette.color,
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                        }}
                      >
                        {tipo.nombre}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Vista Timeline ──────────────────────────────────────────────────────

function TimelineView({
  eventos,
  periodos,
  helpers,
}: {
  eventos: CronogramaEventoPublico[];
  periodos: CronogramaPeriodoPublico[];
  helpers: Helpers;
}) {
  function rangoPeriodo(periodoId: number): string {
    const evs = eventos.filter((e) => e.periodo_id === periodoId);
    if (evs.length === 0) return "";
    const ordenados = [...evs].sort(
      (a, b) => parseISO(a.fecha_inicio).getTime() - parseISO(b.fecha_inicio).getTime()
    );
    const ini = startOf(ordenados[0]);
    const fin = endOf(ordenados[ordenados.length - 1]);
    return `${MESES_CORTOS[ini.getMonth() + 1]} ${ini.getFullYear()} – ${MESES_CORTOS[fin.getMonth() + 1]} ${fin.getFullYear()}`;
  }

  function Section({ periodo }: { periodo: CronogramaPeriodoPublico }) {
    const evs = eventos.filter((e) => e.periodo_id === periodo.id);
    const palette = PALETA[periodo.color];
    const rango = rangoPeriodo(periodo.id);

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full"
            style={{
              background: palette.color,
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {periodo.nombre}
          </span>
          {rango && (
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.45)" }}>
              {rango}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0 relative">
          <div
            className="absolute top-0 bottom-0"
            style={{ left: 6, width: 1.5, background: `linear-gradient(180deg, ${palette.color} 0%, transparent 100%)`, opacity: 0.25 }}
          />
          {evs.map((e, i) => {
            const tipo = helpers.tipoById.get(e.tipo_id);
            return (
              <div key={e.id} className="flex items-start gap-5 pb-5 last:pb-0 relative">
                <div
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: palette.color,
                    flexShrink: 0,
                    marginTop: 3,
                    zIndex: 1,
                    boxShadow: `0 0 0 3px ${palette.bg}`,
                  }}
                />
                <div
                  className="flex-1 flex flex-col md:flex-row md:items-center gap-2 pb-5 last:pb-0"
                  style={{ borderBottom: i < evs.length - 1 ? "1px solid rgba(26,43,74,0.06)" : "none" }}
                >
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 600, color: "var(--color-navy)", lineHeight: 1.3 }}>
                      {e.titulo}
                    </span>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.50)" }}>
                      {formatFecha(e)}
                    </span>
                  </div>
                  {tipo && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded self-start md:self-auto flex-shrink-0"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 9,
                        fontWeight: 700,
                        background: palette.bg,
                        color: palette.color,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {tipo.nombre}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (periodos.length === 0) {
    return (
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.45)", textAlign: "center", padding: "32px 0" }}>
        No hay períodos definidos.
      </p>
    );
  }

  return (
    <div
      className="rounded-[14px] p-6 md:p-8 flex flex-col gap-8"
      style={{ background: "#FFFFFF", border: "1.5px solid rgba(26,43,74,0.08)", boxShadow: "0 4px 24px rgba(13,24,37,0.06)" }}
    >
      {periodos.map((p, i) => (
        <div key={p.id} className="flex flex-col gap-8">
          {i > 0 && <div style={{ height: 1, background: "rgba(26,43,74,0.08)" }} />}
          <Section periodo={p} />
        </div>
      ))}
    </div>
  );
}

// ─── NavBtn ──────────────────────────────────────────────────────────────

function NavBtn({
  onClick,
  disabled,
  dir,
  inline = false,
}: {
  onClick: () => void;
  disabled: boolean;
  dir: "prev" | "next";
  inline?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={
        inline
          ? {
              border: "none",
              background: "transparent",
              cursor: disabled ? "default" : "pointer",
              color: disabled ? "rgba(26,43,74,0.22)" : "var(--color-navy)",
              fontFamily: "Poppins, sans-serif",
              fontSize: 18,
            }
          : {
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "none",
              background: disabled ? "transparent" : "rgba(26,43,74,0.07)",
              color: disabled ? "rgba(26,43,74,0.22)" : "var(--color-navy)",
              cursor: disabled ? "default" : "pointer",
              fontFamily: "Poppins, sans-serif",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }
      }
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}

// ─── Componente principal ───────────────────────────────────────────────

type Props = {
  periodos: CronogramaPeriodoPublico[];
  tipos: CronogramaTipoPublico[];
  eventos: CronogramaEventoPublico[];
};

export function CronogramaAnual({ periodos, tipos, eventos }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  const [vista, setVista] = useState<Vista>("tarjetas");
  const [calVista, setCalVista] = useState<CalVista>("mensual");

  // Calcular rango de meses navegables a partir de los eventos
  const { minYear, minMonth, maxYear, maxMonth, defaultYear, defaultMonth } = useMemo(() => {
    if (eventos.length === 0) {
      const now = new Date();
      return {
        minYear: now.getFullYear(),
        minMonth: now.getMonth() + 1,
        maxYear: now.getFullYear(),
        maxMonth: now.getMonth() + 1,
        defaultYear: now.getFullYear(),
        defaultMonth: now.getMonth() + 1,
      };
    }
    const dates = eventos.flatMap((e) => [startOf(e), endOf(e)]);
    const min = dates.reduce((a, b) => (a < b ? a : b));
    const max = dates.reduce((a, b) => (a > b ? a : b));
    return {
      minYear: min.getFullYear(),
      minMonth: min.getMonth() + 1,
      maxYear: max.getFullYear(),
      maxMonth: max.getMonth() + 1,
      defaultYear: min.getFullYear(),
      defaultMonth: min.getMonth() + 1,
    };
  }, [eventos]);

  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [weekIdx, setWeekIdx] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);

  const helpers: Helpers = useMemo(() => ({
    periodoById: new Map(periodos.map((p) => [p.id, p])),
    tipoById: new Map(tipos.map((t) => [t.id, t])),
  }), [periodos, tipos]);

  const canPrev = year > minYear || (year === minYear && month > minMonth);
  const canNext = year < maxYear || (year === maxYear && month < maxMonth);

  function prevMonth() {
    if (!canPrev) return;
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setWeekIdx(0);
    setSelectedDay(1);
  }

  function nextMonth() {
    if (!canNext) return;
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setWeekIdx(0);
    setSelectedDay(1);
  }

  const totalDays = getDaysInMonth(year, month);
  const weeks = getWeeksForMonth(year, month);

  const VIEWS: Vista[] = ["tarjetas", "calendario", "timeline"];
  const VIEW_LABELS: Record<Vista, string> = { tarjetas: "Tarjetas", calendario: "Calendario", timeline: "Timeline" };
  const CAL_VIEWS: CalVista[] = ["mensual", "semanal", "diario"];
  const CAL_LABELS: Record<CalVista, string> = { mensual: "Mensual", semanal: "Semanal", diario: "Diario" };

  return (
    <section ref={ref} className="bg-[#F5F1EB] relative overflow-hidden">
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{ width: 480, height: 480, background: "radial-gradient(ellipse at top right, rgba(201,168,76,0.07) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ width: 360, height: 360, background: "radial-gradient(ellipse at bottom left, rgba(26,43,74,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative px-6 md:px-[160px] py-20 md:py-[80px] flex flex-col gap-10">
        <div className="flex flex-col gap-[14px]">
          <motion.div
            className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block bg-gold flex-shrink-0"
              style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }}
            />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--color-gold)", letterSpacing: 2, textTransform: "uppercase" }}>
              Calendario académico
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 700, color: "var(--color-navy)", lineHeight: 1.15 }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              {periodos.length > 0 && periodos[0].ano_lectivo_codigo
                ? `Cronograma ${periodos[0].ano_lectivo_codigo}`
                : "Cronograma"}
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.55)", lineHeight: 1.7, maxWidth: 500 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            Calendario del año lectivo — Unidad Educativa Atenas.
          </motion.p>
        </div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.32, ease }}
          >
            <div className="inline-flex" style={{ background: "rgba(26,43,74,0.07)", borderRadius: 100, padding: 4, gap: 4 }}>
              {VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setVista(v)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    background: vista === v ? "var(--color-navy)" : "transparent",
                    color: vista === v ? "#FFFFFF" : "rgba(26,43,74,0.55)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {VIEW_LABELS[v]}
                </button>
              ))}
            </div>
          </motion.div>

          {vista === "calendario" && (
            <div
              className="inline-flex"
              style={{ background: "rgba(26,43,74,0.04)", borderRadius: 100, padding: 3, gap: 3, border: "1.5px solid rgba(26,43,74,0.08)" }}
            >
              {CAL_VIEWS.map((v) => (
                <button
                  key={v}
                  onClick={() => setCalVista(v)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 100,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    background: calVista === v ? "var(--color-gold)" : "transparent",
                    color: calVista === v ? "#FFFFFF" : "rgba(26,43,74,0.55)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {CAL_LABELS[v]}
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div
          key={vista}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {vista === "tarjetas" && <TarjetasView eventos={eventos} periodos={periodos} helpers={helpers} />}

          {vista === "calendario" && calVista === "mensual" && (
            <CalendarioMensual
              year={year}
              month={month}
              eventos={eventos}
              helpers={helpers}
              onPrev={prevMonth}
              onNext={nextMonth}
              canPrev={canPrev}
              canNext={canNext}
            />
          )}
          {vista === "calendario" && calVista === "semanal" && (
            <CalendarioSemanal
              year={year}
              month={month}
              weekIdx={weekIdx}
              eventos={eventos}
              helpers={helpers}
              onPrevWeek={() => setWeekIdx((i) => Math.max(0, i - 1))}
              onNextWeek={() => setWeekIdx((i) => Math.min(weeks.length - 1, i + 1))}
            />
          )}
          {vista === "calendario" && calVista === "diario" && (
            <CalendarioDiario
              year={year}
              month={month}
              day={selectedDay}
              eventos={eventos}
              helpers={helpers}
              onPrevDay={() => setSelectedDay((d) => Math.max(1, d - 1))}
              onNextDay={() => setSelectedDay((d) => Math.min(totalDays, d + 1))}
            />
          )}

          {vista === "timeline" && <TimelineView eventos={eventos} periodos={periodos} helpers={helpers} />}
        </motion.div>

        <div
          className="rounded-[14px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5"
          style={{ background: "#FFFFFF", border: "1.5px solid rgba(26,43,74,0.08)", boxShadow: "0 2px 16px rgba(13,24,37,0.05)" }}
        >
          <div className="flex flex-col gap-1">
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 16, fontWeight: 700, color: "var(--color-navy)" }}>
              ¿Tienes dudas sobre una fecha o actividad?
            </span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(13,24,37,0.50)", lineHeight: 1.6 }}>
              Consulta con secretaría para confirmar las fechas definitivas.
            </span>
          </div>
          <Link
            href="/contactos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full flex-shrink-0"
            style={{
              background: "var(--color-navy)",
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              textDecoration: "none",
              transition: "background 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-navy)")}
          >
            Ir a Contactos <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
