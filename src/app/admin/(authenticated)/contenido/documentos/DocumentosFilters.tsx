"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type Cat = { id: number; nombre: string };

export function DocumentosFilters({
  categorias,
  currentQ,
  currentCat,
}: {
  categorias: Cat[];
  currentQ: string;
  currentCat: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/contenido/documentos?${next.toString()}`);
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
          style={{ fontSize: 14, color: "#1A2B4A" }}
        />
      </div>

      <select
        value={currentCat}
        onChange={(e) => setParam("cat", e.target.value)}
        className="px-3 rounded-md cursor-pointer"
        style={{
          height: 36,
          background: "#F4F1EB",
          fontSize: 14,
          color: "#1A2B4A",
          border: "none",
          outline: "none",
          fontFamily: "inherit",
        }}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
