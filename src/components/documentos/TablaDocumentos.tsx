"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Download, FileText } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { toDownloadUrl } from "@/lib/cms/parseDriveUrl";
import type {
  DocumentoCategoriaPublica,
  DocumentoPublico,
} from "@/lib/cms/getDocumentos";

type ColorKey = DocumentoCategoriaPublica["color"];

const PALETA: Record<
  ColorKey,
  { bg: string; text: string; border: string; iconColor: string; chipBg: string }
> = {
  gold: {
    bg: "#C9A84C14",
    text: "#8B6914",
    border: "#C9A84C4D",
    iconColor: "#C9A84C",
    chipBg: "#C9A84C14",
  },
  red: {
    bg: "#9e191514",
    text: "#9e1915",
    border: "#9e19154D",
    iconColor: "#9e1915",
    chipBg: "#9e191514",
  },
  teal: {
    bg: "#0D948814",
    text: "#0D9488",
    border: "#0D94884D",
    iconColor: "#0D9488",
    chipBg: "#0D948814",
  },
  navy: {
    bg: "#1A2B4A14",
    text: "#1A2B4A",
    border: "#1A2B4A4D",
    iconColor: "#1A2B4A",
    chipBg: "#1A2B4A14",
  },
  purple: {
    bg: "#7C3AED14",
    text: "#7C3AED",
    border: "#7C3AED4D",
    iconColor: "#7C3AED",
    chipBg: "#7C3AED14",
  },
};

type Props = {
  categorias: DocumentoCategoriaPublica[];
  documentos: DocumentoPublico[];
  /** Texto del banner-aviso superior. Personalizable por temporada. */
  aviso?: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

export function TablaDocumentos({
  categorias,
  documentos,
  aviso = "Todos los documentos están vigentes para el año lectivo en curso. Descarga el que necesites.",
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todos");

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  // Mapas auxiliares
  const catById = useMemo(() => {
    const m = new Map<number, DocumentoCategoriaPublica>();
    for (const c of categorias) m.set(c.id, c);
    return m;
  }, [categorias]);

  const docsVisibles = useMemo(() => {
    return documentos.filter((doc) => {
      const cat = catById.get(doc.categoria_id);
      const matchCat = categoriaActiva === "todos" || cat?.slug === categoriaActiva;
      const matchSearch = doc.titulo.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [documentos, catById, categoriaActiva, busqueda]);

  return (
    <section
      ref={ref}
      className="px-6 py-16 md:px-[160px] md:py-[64px]"
      style={{ background: "#F8F5F0" }}
    >
      {/* Cabecera */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease }}
        className="mb-10"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <span className="block w-6 h-px" style={{ background: "#C9A84C" }} />
          <span
            className="text-[10px] font-bold tracking-[2.5px]"
            style={{ color: "#C9A84C" }}
          >
            REPOSITORIO OFICIAL
          </span>
        </div>
        <h2
          className="text-3xl md:text-[40px] font-black leading-[1.15] tracking-tight mb-3"
          style={{ color: "#0D1825" }}
        >
          Documentos
          <br />
          Institucionales
        </h2>
        <p className="text-sm leading-[1.6] max-w-xl" style={{ color: "#0D182566" }}>
          Encuentra y descarga los documentos oficiales emitidos por la Unidad Educativa Atenas.
        </p>
      </motion.div>

      {/* Filtros + búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-center gap-4 mb-6"
      >
        <div className="flex flex-wrap gap-2">
          <FiltroChip
            label="Todos"
            activo={categoriaActiva === "todos"}
            onClick={() => setCategoriaActiva("todos")}
          />
          {categorias.map((c) => (
            <FiltroChip
              key={c.slug}
              label={c.nombre}
              activo={categoriaActiva === c.slug}
              onClick={() => setCategoriaActiva(c.slug)}
            />
          ))}
        </div>

        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg md:ml-auto"
          style={{ background: "#0D18250D", minWidth: 220 }}
        >
          <Search size={15} style={{ color: "#0D182560", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-[#0D182540]"
            style={{ color: "#0D1825" }}
          />
        </div>
      </motion.div>

      {/* Aviso */}
      {aviso && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease, delay: 0.15 }}
          className="flex items-center gap-4 px-5 py-3.5 rounded-lg mb-8"
          style={{ background: "#9e191510" }}
        >
          <span
            className="block w-0.5 self-stretch rounded-full flex-shrink-0"
            style={{ background: "#9e1915" }}
          />
          <p className="text-[13px] leading-[1.5]" style={{ color: "#0D182566" }}>
            {aviso}
          </p>
        </motion.div>
      )}

      {/* Tabla desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease, delay: 0.2 }}
        className="hidden md:block"
      >
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <colgroup>
            <col />
            <col style={{ width: 240 }} />
            <col style={{ width: 160 }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: "1px solid #0D182520" }}>
              <th
                className="text-left py-3 text-[10px] font-bold tracking-[1.5px]"
                style={{ color: "#0D182550" }}
              >
                DOCUMENTO
              </th>
              <th
                className="text-center py-3 text-[10px] font-bold tracking-[1.5px]"
                style={{ color: "#0D182550" }}
              >
                CATEGORÍA
              </th>
              <th
                className="text-right py-3 text-[10px] font-bold tracking-[1.5px]"
                style={{ color: "#0D182550" }}
              >
                ACCIÓN
              </th>
            </tr>
          </thead>
          <tbody>
            {docsVisibles.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-sm"
                  style={{ color: "#0D182560" }}
                >
                  No se encontraron documentos.
                </td>
              </tr>
            ) : (
              docsVisibles.map((doc, i) => {
                const cat = catById.get(doc.categoria_id);
                const col = PALETA[cat?.color ?? "gold"];
                const downloadHref = toDownloadUrl(doc.drive_url);
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, ease, delay: 0.22 + i * 0.06 }}
                    style={{ borderBottom: "1px solid #0D18251A" }}
                  >
                    <td className="py-5">
                      <div className="flex items-center gap-3.5">
                        {cat?.icono ? (
                          <DynamicIcon
                            name={cat.icono as never}
                            size={20}
                            style={{ color: col.iconColor, flexShrink: 0 }}
                          />
                        ) : (
                          <FileText
                            size={20}
                            style={{ color: col.iconColor, flexShrink: 0 }}
                          />
                        )}
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span
                            className="text-[14px] font-bold"
                            style={{ color: "#0D1825" }}
                          >
                            {doc.titulo}
                          </span>
                          {doc.descripcion && (
                            <span
                              className="text-[11px]"
                              style={{ color: "#0D182566" }}
                            >
                              {doc.descripcion}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <span
                        className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-semibold"
                        style={{ background: col.bg, color: col.text }}
                      >
                        {cat?.nombre ?? "—"}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <a
                        href={downloadHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-opacity hover:opacity-70"
                        style={{
                          border: `1px solid ${col.border}`,
                          color: col.text,
                        }}
                      >
                        <Download size={13} />
                        Descargar
                      </a>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease, delay: 0.2 }}
        className="md:hidden"
      >
        {docsVisibles.length === 0 ? (
          <p
            className="py-10 text-center text-sm"
            style={{ color: "#0D182560" }}
          >
            No se encontraron documentos.
          </p>
        ) : (
          docsVisibles.map((doc) => {
            const cat = catById.get(doc.categoria_id);
            const col = PALETA[cat?.color ?? "gold"];
            const downloadHref = toDownloadUrl(doc.drive_url);
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-3 py-4"
                style={{ borderBottom: "1px solid #0D18251A" }}
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    {cat?.icono ? (
                      <DynamicIcon
                        name={cat.icono as never}
                        size={14}
                        style={{ color: col.iconColor, flexShrink: 0 }}
                      />
                    ) : (
                      <FileText
                        size={14}
                        style={{ color: col.iconColor, flexShrink: 0 }}
                      />
                    )}
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[8px] font-bold"
                      style={{ background: col.bg, color: col.text }}
                    >
                      {cat?.nombre.split(" ")[0] ?? "DOC"}
                    </span>
                  </div>
                  <span
                    className="text-[13px] font-bold leading-[1.3]"
                    style={{ color: "#0D1825" }}
                  >
                    {doc.titulo}
                  </span>
                </div>
                <a
                  href={downloadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-bold transition-opacity hover:opacity-70"
                  style={{
                    border: `1px solid ${col.border}`,
                    color: col.text,
                  }}
                >
                  <Download size={12} />
                  PDF
                </a>
              </div>
            );
          })
        )}
      </motion.div>
    </section>
  );
}

function FiltroChip({
  label,
  activo,
  onClick,
}: {
  label: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
      style={
        activo
          ? { background: "#C9A84C", color: "#0D1825" }
          : { background: "#0D18250D", color: "#0D182580" }
      }
    >
      {label}
    </button>
  );
}
