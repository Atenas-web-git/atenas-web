"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  EVENTOS,
  MESES_NOMBRES,
  MESES_CORTOS,
  TIPO_LABELS,
  getEventosQuimestre,
  getEventosMes,
  getEventosEnDia,
  getDiasConEventos,
  formatFecha,
  formatFechaRango,
  type EventoCronograma,
} from "@/data/cronograma";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Vista = "tarjetas" | "calendario" | "timeline";
type CalVista = "mensual" | "semanal" | "diario";

const Q_COLOR = { 1: "#1A2B4A", 2: "#9e1915" } as const;
const Q_BG = { 1: "rgba(26,43,74,0.07)", 2: "rgba(158,25,21,0.07)" } as const;
const Q_BORDER = {
  1: "rgba(26,43,74,0.12)",
  2: "rgba(158,25,21,0.15)",
} as const;

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

// ─── Calendar helpers ──────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
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

function getEventoColorForDay(year: number, month: number, day: number): string | null {
  const evs = getEventosEnDia(year, month, day);
  if (!evs.length) return null;
  return Q_COLOR[evs[0].quimestre];
}

// ─── Vista Tarjetas ───────────────────────────────────────────────────────

function TarjetasView() {
  function groupByMonth(evs: EventoCronograma[]) {
    const map = new Map<string, EventoCronograma[]>();
    evs.forEach((e) => {
      const key = `${e.año}-${String(e.mes).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }

  function Card({ q, rango }: { q: 1 | 2; rango: string }) {
    const evs = getEventosQuimestre(q);
    const grouped = groupByMonth(evs);
    const color = Q_COLOR[q];
    const bg = Q_BG[q];
    const border = Q_BORDER[q];
    const label = q === 1 ? "QUIMESTRE 1" : "QUIMESTRE 2";

    return (
      <div
        className="flex-1 rounded-[14px] overflow-hidden flex flex-col"
        style={{
          background: "#FFFFFF",
          border: `1.5px solid ${border}`,
          boxShadow: "0 4px 24px rgba(13,24,37,0.06)",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: color }}
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
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.70)",
            }}
          >
            {rango}
          </span>
        </div>

        {/* Events */}
        <div className="flex-1 p-6 flex flex-col gap-5">
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
                    color: color,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{ display: "block", width: 16, height: 1.5, background: color, flexShrink: 0 }}
                  />
                  {MESES_NOMBRES[m]} {y}
                </div>

                <div className="flex flex-col gap-[10px] pl-4">
                  {monthEvs.map((e) => (
                    <div key={e.id} className="flex items-start gap-3">
                      <div
                        style={{
                          marginTop: 5,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                        <span
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1A2B4A",
                            lineHeight: 1.35,
                          }}
                        >
                          {e.titulo}
                        </span>
                        <span
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: 11,
                            color: "rgba(13,24,37,0.48)",
                          }}
                        >
                          {formatFechaRango(e)}
                        </span>
                      </div>
                      <span
                        className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 9,
                          fontWeight: 700,
                          background: bg,
                          color: color,
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                          marginTop: 3,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {TIPO_LABELS[e.tipo]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: `1px solid ${border}` }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              color: "rgba(13,24,37,0.40)",
            }}
          >
            {evs.length} actividades programadas
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <Card q={1} rango="Sep 2026 – Ene 2027" />
      <Card q={2} rango="Ene – Jun 2027" />
    </div>
  );
}

// ─── Vista Calendario Mensual ─────────────────────────────────────────────

interface CalMensualProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

function CalendarioMensual({ year, month, onPrev, onNext, canPrev, canNext }: CalMensualProps) {
  const diasConEvs = getDiasConEventos(year, month);
  const eventosDelMes = getEventosMes(year, month);
  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 1 ? 12 : month - 1);

  type Cell = { day: number; current: boolean; color: string | null };
  const cells: Cell[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false, color: null });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({
      day: d,
      current: true,
      color: diasConEvs.has(d) ? getEventoColorForDay(year, month, d) : null,
    });
  }
  const rem = 7 - (cells.length % 7);
  if (rem < 7) {
    for (let d = 1; d <= rem; d++) {
      cells.push({ day: d, current: false, color: null });
    }
  }

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Calendar card */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(26,43,74,0.08)",
          boxShadow: "0 4px 24px rgba(13,24,37,0.06)",
        }}
      >
        {/* Nav */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(26,43,74,0.06)" }}
        >
          <button
            onClick={onPrev}
            disabled={!canPrev}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "none",
              background: canPrev ? "rgba(26,43,74,0.07)" : "transparent",
              color: canPrev ? "#1A2B4A" : "rgba(26,43,74,0.22)",
              cursor: canPrev ? "pointer" : "default",
              fontFamily: "Poppins, sans-serif",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
          >
            ‹
          </button>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#1A2B4A",
            }}
          >
            {MESES_NOMBRES[month]} {year}
          </span>
          <button
            onClick={onNext}
            disabled={!canNext}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "none",
              background: canNext ? "rgba(26,43,74,0.07)" : "transparent",
              color: canNext ? "#1A2B4A" : "rgba(26,43,74,0.22)",
              cursor: canNext ? "pointer" : "default",
              fontFamily: "Poppins, sans-serif",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div
          className="grid grid-cols-7"
          style={{ borderBottom: "1px solid rgba(26,43,74,0.05)" }}
        >
          {DIAS.map((d) => (
            <div
              key={d}
              className="flex items-center justify-center py-2"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(26,43,74,0.40)",
                letterSpacing: 1,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid grid-cols-7"
            style={{
              borderBottom:
                wi < weeks.length - 1 ? "1px solid rgba(26,43,74,0.04)" : "none",
            }}
          >
            {week.map((cell, di) => (
              <div
                key={di}
                className="flex items-center justify-center"
                style={{ height: 44 }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 34,
                    height: 34,
                    background: cell.color ?? "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      fontWeight: cell.color ? 700 : cell.current ? 500 : 400,
                      color: cell.color
                        ? "#FFFFFF"
                        : cell.current
                        ? "#1A2B4A"
                        : "rgba(26,43,74,0.22)",
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

      {/* Events for this month */}
      {eventosDelMes.length > 0 && (
        <div
          className="rounded-[14px] p-5 flex flex-col gap-3"
          style={{
            background: "rgba(26,43,74,0.03)",
            border: "1.5px solid rgba(26,43,74,0.06)",
          }}
        >
          {eventosDelMes.map((e) => {
            const color = Q_COLOR[e.quimestre];
            return (
              <div key={e.id} className="flex items-start gap-3">
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1A2B4A",
                    }}
                  >
                    {formatFecha(e)} — {e.titulo}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      background: `${color}18`,
                      color,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {TIPO_LABELS[e.tipo]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {eventosDelMes.length === 0 && (
        <p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 14,
            color: "rgba(13,24,37,0.40)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          No hay actividades programadas para este mes.
        </p>
      )}
    </div>
  );
}

// ─── Vista Calendario Semanal ─────────────────────────────────────────────

interface CalSemanalProps {
  year: number;
  month: number;
  weekIdx: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

function CalendarioSemanal({ year, month, weekIdx, onPrevWeek, onNextWeek }: CalSemanalProps) {
  const weeks = getWeeksForMonth(year, month);
  const safeIdx = Math.min(weekIdx, weeks.length - 1);
  const week = weeks[safeIdx];

  const canPrevWeek = safeIdx > 0;
  const canNextWeek = safeIdx < weeks.length - 1;

  const startDay = week[0];
  const endDay = week[6];

  function fmtDate(d: Date) {
    return `${MESES_CORTOS[d.getMonth() + 1]} ${d.getDate()}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Week nav */}
      <div
        className="flex items-center justify-between px-5 py-3 rounded-[10px]"
        style={{ background: "rgba(26,43,74,0.04)", border: "1.5px solid rgba(26,43,74,0.07)" }}
      >
        <button
          onClick={onPrevWeek}
          disabled={!canPrevWeek}
          style={{
            border: "none",
            background: "transparent",
            cursor: canPrevWeek ? "pointer" : "default",
            color: canPrevWeek ? "#1A2B4A" : "rgba(26,43,74,0.22)",
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
          }}
        >
          ‹
        </button>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#1A2B4A",
          }}
        >
          {fmtDate(startDay)} – {fmtDate(endDay)} {endDay.getFullYear()}
        </span>
        <button
          onClick={onNextWeek}
          disabled={!canNextWeek}
          style={{
            border: "none",
            background: "transparent",
            cursor: canNextWeek ? "pointer" : "default",
            color: canNextWeek ? "#1A2B4A" : "rgba(26,43,74,0.22)",
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
          }}
        >
          ›
        </button>
      </div>

      {/* Days grid — 7 columns desktop, stacked mobile */}
      <div className="hidden md:grid grid-cols-7 gap-2">
        {week.map((date, i) => {
          const d = date.getDate();
          const m = date.getMonth() + 1;
          const y = date.getFullYear();
          const isCurrentMonth = m === month && y === year;
          const dayEvs = getEventosEnDia(y, m, d);

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
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(26,43,74,0.45)",
                    letterSpacing: 1,
                  }}
                >
                  {DIAS[i]}
                </span>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: isCurrentMonth ? "#1A2B4A" : "rgba(26,43,74,0.25)",
                  }}
                >
                  {d}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {dayEvs.map((e) => (
                  <div
                    key={e.id}
                    className="rounded px-1.5 py-1"
                    style={{
                      background: Q_BG[e.quimestre],
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 9,
                      fontWeight: 600,
                      color: Q_COLOR[e.quimestre],
                      lineHeight: 1.3,
                    }}
                  >
                    {e.titulo.length > 22 ? e.titulo.slice(0, 22) + "…" : e.titulo}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: stacked rows */}
      <div className="md:hidden flex flex-col gap-2">
        {week.map((date, i) => {
          const d = date.getDate();
          const m = date.getMonth() + 1;
          const y = date.getFullYear();
          const isCurrentMonth = m === month && y === year;
          const dayEvs = getEventosEnDia(y, m, d);

          return (
            <div
              key={i}
              className="rounded-[10px] flex items-start gap-4 p-4"
              style={{
                background: "#FFFFFF",
                border: `1.5px solid rgba(26,43,74,${isCurrentMonth ? "0.08" : "0.04"})`,
              }}
            >
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 36 }}>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(26,43,74,0.45)",
                    letterSpacing: 1,
                  }}
                >
                  {DIAS[i]}
                </span>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: isCurrentMonth ? "#1A2B4A" : "rgba(26,43,74,0.25)",
                  }}
                >
                  {d}
                </span>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                {dayEvs.length === 0 ? (
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 12,
                      color: "rgba(13,24,37,0.30)",
                    }}
                  >
                    Sin actividades
                  </span>
                ) : (
                  dayEvs.map((e) => (
                    <div
                      key={e.id}
                      className="rounded px-2 py-1"
                      style={{
                        background: Q_BG[e.quimestre],
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: Q_COLOR[e.quimestre],
                      }}
                    >
                      {e.titulo}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vista Calendario Diario ──────────────────────────────────────────────

interface CalDiarioProps {
  year: number;
  month: number;
  day: number;
  onPrevDay: () => void;
  onNextDay: () => void;
}

const DIA_SEMANA_LARGO = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];

function CalendarioDiario({ year, month, day, onPrevDay, onNextDay }: CalDiarioProps) {
  const totalDays = getDaysInMonth(year, month);
  const dateObj = new Date(year, month - 1, day);
  const evs = getEventosEnDia(year, month, day);

  return (
    <div className="flex flex-col gap-5">
      {/* Day nav */}
      <div
        className="flex items-center justify-between px-5 py-3 rounded-[10px]"
        style={{ background: "rgba(26,43,74,0.04)", border: "1.5px solid rgba(26,43,74,0.07)" }}
      >
        <button
          onClick={onPrevDay}
          disabled={day <= 1}
          style={{
            border: "none",
            background: "transparent",
            cursor: day > 1 ? "pointer" : "default",
            color: day > 1 ? "#1A2B4A" : "rgba(26,43,74,0.22)",
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
          }}
        >
          ‹
        </button>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#1A2B4A",
          }}
        >
          {DIA_SEMANA_LARGO[dateObj.getDay()]}, {day} de {MESES_NOMBRES[month]} {year}
        </span>
        <button
          onClick={onNextDay}
          disabled={day >= totalDays}
          style={{
            border: "none",
            background: "transparent",
            cursor: day < totalDays ? "pointer" : "default",
            color: day < totalDays ? "#1A2B4A" : "rgba(26,43,74,0.22)",
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
          }}
        >
          ›
        </button>
      </div>

      {/* Events */}
      <div
        className="rounded-[14px] p-6"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(26,43,74,0.08)",
          boxShadow: "0 4px 24px rgba(13,24,37,0.05)",
          minHeight: 160,
        }}
      >
        {evs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3" style={{ minHeight: 120 }}>
            <span style={{ fontSize: 28 }}>📅</span>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 14,
                color: "rgba(13,24,37,0.40)",
                textAlign: "center",
              }}
            >
              No hay actividades programadas para este día.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {evs.map((e) => {
              const color = Q_COLOR[e.quimestre];
              return (
                <div
                  key={e.id}
                  className="flex items-start gap-4 p-4 rounded-[10px]"
                  style={{ background: Q_BG[e.quimestre], border: `1.5px solid ${Q_BORDER[e.quimestre]}` }}
                >
                  <div
                    style={{
                      width: 4,
                      borderRadius: 2,
                      background: color,
                      alignSelf: "stretch",
                      flexShrink: 0,
                    }}
                  />
                  <div className="flex flex-col gap-1">
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#1A2B4A",
                      }}
                    >
                      {e.titulo}
                    </span>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 12,
                        color: "rgba(13,24,37,0.50)",
                      }}
                    >
                      {formatFecha(e)}
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded mt-1 self-start"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 9,
                        fontWeight: 700,
                        background: `${color}22`,
                        color,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {TIPO_LABELS[e.tipo]}
                    </span>
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

// ─── Vista Timeline ───────────────────────────────────────────────────────

function TimelineView() {
  function Section({ q }: { q: 1 | 2 }) {
    const evs = getEventosQuimestre(q);
    const color = Q_COLOR[q];
    const bg = Q_BG[q];
    const label = q === 1 ? "QUIMESTRE 1" : "QUIMESTRE 2";
    const rango = q === 1 ? "Sep 2026 – Ene 2027" : "Ene – Jun 2027";

    return (
      <div className="flex flex-col gap-6">
        {/* Pill */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full"
            style={{
              background: color,
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: 2,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              color: "rgba(13,24,37,0.45)",
            }}
          >
            {rango}
          </span>
        </div>

        {/* Events */}
        <div className="flex flex-col gap-0 relative">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: 6,
              width: 1.5,
              background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
              opacity: 0.25,
            }}
          />

          {evs.map((e, i) => (
            <div
              key={e.id}
              className="flex items-start gap-5 pb-5 last:pb-0 relative"
            >
              {/* Dot */}
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                  marginTop: 3,
                  zIndex: 1,
                  boxShadow: `0 0 0 3px ${bg}`,
                }}
              />

              {/* Content */}
              <div
                className="flex-1 flex flex-col md:flex-row md:items-center gap-2 pb-5 last:pb-0"
                style={{
                  borderBottom: i < evs.length - 1 ? "1px solid rgba(26,43,74,0.06)" : "none",
                }}
              >
                <div className="flex-1 flex flex-col gap-0.5">
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1A2B4A",
                      lineHeight: 1.3,
                    }}
                  >
                    {e.titulo}
                  </span>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 12,
                      color: "rgba(13,24,37,0.50)",
                    }}
                  >
                    {formatFecha(e)}
                  </span>
                </div>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded self-start md:self-auto flex-shrink-0"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    background: bg,
                    color,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {TIPO_LABELS[e.tipo]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[14px] p-6 md:p-8 flex flex-col gap-8"
      style={{
        background: "#FFFFFF",
        border: "1.5px solid rgba(26,43,74,0.08)",
        boxShadow: "0 4px 24px rgba(13,24,37,0.06)",
      }}
    >
      <Section q={1} />
      <div style={{ height: 1, background: "rgba(26,43,74,0.08)" }} />
      <Section q={2} />
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────

const MIN_YEAR = 2026,
  MIN_MONTH = 9;
const MAX_YEAR = 2027,
  MAX_MONTH = 6;

export function CronogramaAnual() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  const [vista, setVista] = useState<Vista>("tarjetas");
  const [calVista, setCalVista] = useState<CalVista>("mensual");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10); // Octubre 2026
  const [weekIdx, setWeekIdx] = useState(0);
  const [selectedDay, setSelectedDay] = useState(1);

  const canPrev =
    year > MIN_YEAR || (year === MIN_YEAR && month > MIN_MONTH);
  const canNext =
    year < MAX_YEAR || (year === MAX_YEAR && month < MAX_MONTH);

  function prevMonth() {
    if (!canPrev) return;
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setWeekIdx(0);
    setSelectedDay(1);
  }

  function nextMonth() {
    if (!canNext) return;
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setWeekIdx(0);
    setSelectedDay(1);
  }

  const totalDays = getDaysInMonth(year, month);
  const weeks = getWeeksForMonth(year, month);

  const VIEWS: Vista[] = ["tarjetas", "calendario", "timeline"];
  const VIEW_LABELS: Record<Vista, string> = {
    tarjetas: "Tarjetas",
    calendario: "Calendario",
    timeline: "Timeline",
  };
  const CAL_VIEWS: CalVista[] = ["mensual", "semanal", "diario"];
  const CAL_LABELS: Record<CalVista, string> = {
    mensual: "Mensual",
    semanal: "Semanal",
    diario: "Diario",
  };

  return (
    <section ref={ref} className="bg-[#F5F1EB] relative overflow-hidden">
      {/* Decorative glows */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 480,
          height: 480,
          background:
            "radial-gradient(ellipse at top right, rgba(201,168,76,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: 360,
          height: 360,
          background:
            "radial-gradient(ellipse at bottom left, rgba(26,43,74,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative px-6 md:px-[160px] py-20 md:py-[80px] flex flex-col gap-10">
        {/* ─── Header ─── */}
        <div className="flex flex-col gap-[14px]">
          <motion.div
            className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block bg-[#C9A84C] flex-shrink-0"
              style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }}
            />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#C9A84C",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Año Lectivo
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(28px, 3vw, 42px)",
                fontWeight: 700,
                color: "#1A2B4A",
                lineHeight: 1.15,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              Cronograma 2026 – 2027
            </motion.h2>
          </div>

          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(13,24,37,0.55)",
              lineHeight: 1.7,
              maxWidth: 500,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            Calendario del año lectivo Sierra — Unidad Educativa Atenas.
          </motion.p>
        </div>

        {/* ─── Toggles ─── */}
        <div className="flex flex-col gap-4">
          {/* Main toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.32, ease }}
          >
            <div
              className="inline-flex"
              style={{
                background: "rgba(26,43,74,0.07)",
                borderRadius: 100,
                padding: 4,
                gap: 4,
              }}
            >
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
                    background: vista === v ? "#1A2B4A" : "transparent",
                    color: vista === v ? "#FFFFFF" : "rgba(26,43,74,0.55)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {VIEW_LABELS[v]}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Calendar sub-toggle */}
          {vista === "calendario" && (
            <div
              className="inline-flex"
              style={{
                background: "rgba(26,43,74,0.04)",
                borderRadius: 100,
                padding: 3,
                gap: 3,
                border: "1.5px solid rgba(26,43,74,0.08)",
              }}
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
                    background: calVista === v ? "#C9A84C" : "transparent",
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

        {/* ─── Content ─── */}
        <motion.div
          key={vista}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {vista === "tarjetas" && <TarjetasView />}

          {vista === "calendario" && calVista === "mensual" && (
            <CalendarioMensual
              year={year}
              month={month}
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
              onPrevWeek={() => setWeekIdx((i) => Math.max(0, i - 1))}
              onNextWeek={() =>
                setWeekIdx((i) => Math.min(weeks.length - 1, i + 1))
              }
            />
          )}

          {vista === "calendario" && calVista === "diario" && (
            <CalendarioDiario
              year={year}
              month={month}
              day={selectedDay}
              onPrevDay={() => setSelectedDay((d) => Math.max(1, d - 1))}
              onNextDay={() =>
                setSelectedDay((d) => Math.min(totalDays, d + 1))
              }
            />
          )}

          {vista === "timeline" && <TimelineView />}
        </motion.div>

        {/* ─── CTA ─── */}
        <div
          className="rounded-[14px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid rgba(26,43,74,0.08)",
            boxShadow: "0 2px 16px rgba(13,24,37,0.05)",
          }}
        >
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#1A2B4A",
              }}
            >
              ¿Tienes dudas sobre una fecha o actividad?
            </span>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "rgba(13,24,37,0.50)",
                lineHeight: 1.6,
              }}
            >
              Consulta con secretaría para confirmar las fechas definitivas.
            </span>
          </div>
          <Link
            href="/contactos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full flex-shrink-0"
            style={{
              background: "#1A2B4A",
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              textDecoration: "none",
              transition: "background 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#C9A84C")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#1A2B4A")
            }
          >
            Ir a Contactos <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
