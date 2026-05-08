"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type Opt = { id: number; nombre: string };
type Ano = { codigo: string; nombre: string };

export function CronogramaFilters({
  periodos,
  tipos,
  anosLectivos,
  currentQ,
  currentPeriodo,
  currentTipo,
  currentAno,
}: {
  periodos: Opt[];
  tipos: Opt[];
  anosLectivos: Ano[];
  currentQ: string;
  currentPeriodo: string;
  currentTipo: string;
  currentAno: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/contenido/cronograma?${next.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div
        className="flex items-center gap-2 px-3 rounded-md"
        style={{ height: 36, background: "#F4F1EB", minWidth: 240 }}
      >
        <Search size={14} strokeWidth={2.5} color="#6B6660" />
        <input
          type="text"
          defaultValue={currentQ}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Buscar por título…"
          className="bg-transparent outline-none w-full"
          style={{ fontSize: 13, color: "#1A2B4A" }}
        />
      </div>

      <select
        value={currentAno}
        onChange={(e) => setParam("ano", e.target.value)}
        className="px-3 rounded-md cursor-pointer"
        style={selectStyle}
      >
        <option value="">Todos los años lectivos</option>
        {anosLectivos.map((a) => (
          <option key={a.codigo} value={a.codigo}>
            {a.nombre}
          </option>
        ))}
      </select>

      <select
        value={currentPeriodo}
        onChange={(e) => setParam("periodo", e.target.value)}
        className="px-3 rounded-md cursor-pointer"
        style={selectStyle}
      >
        <option value="">Todos los períodos</option>
        {periodos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <select
        value={currentTipo}
        onChange={(e) => setParam("tipo", e.target.value)}
        className="px-3 rounded-md cursor-pointer"
        style={selectStyle}
      >
        <option value="">Todos los tipos</option>
        {tipos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  height: 36,
  background: "#F4F1EB",
  fontSize: 13,
  color: "#1A2B4A",
  border: "none",
  outline: "none",
  fontFamily: "inherit",
};
