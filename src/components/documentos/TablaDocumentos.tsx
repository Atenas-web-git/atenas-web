"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  FileCheck,
  Shield,
  BookOpen,
  PenLine,
  GitBranch,
  Clipboard,
  Search,
  Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Categoria =
  | "Contratos y Acuerdos"
  | "Políticas Institucionales"
  | "Formularios y Solicitudes";

interface Documento {
  id: number;
  nombre: string;
  categoria: Categoria;
  Icono: LucideIcon;
  href: string;
}

const DOCUMENTOS: Documento[] = [
  {
    id: 1,
    nombre: "Resolución de Pensiones",
    categoria: "Contratos y Acuerdos",
    Icono: FileText,
    href: "#",
  },
  {
    id: 2,
    nombre: "Contrato de Prestación de Servicios",
    categoria: "Contratos y Acuerdos",
    Icono: FileCheck,
    href: "#",
  },
  {
    id: 3,
    nombre: "Consentimiento de Datos Personales",
    categoria: "Contratos y Acuerdos",
    Icono: Shield,
    href: "#",
  },
  {
    id: 4,
    nombre: "Código de Convivencia",
    categoria: "Políticas Institucionales",
    Icono: BookOpen,
    href: "#",
  },
  {
    id: 5,
    nombre: "Declaración Juramentada",
    categoria: "Contratos y Acuerdos",
    Icono: PenLine,
    href: "#",
  },
  {
    id: 6,
    nombre: "Rutas de Manejo de Conflictos",
    categoria: "Políticas Institucionales",
    Icono: GitBranch,
    href: "#",
  },
  {
    id: 7,
    nombre: "Solicitud de Inasistencia",
    categoria: "Formularios y Solicitudes",
    Icono: Clipboard,
    href: "#",
  },
];

const CATEGORIAS = [
  "Todos",
  "Contratos y Acuerdos",
  "Políticas Institucionales",
  "Formularios y Solicitudes",
] as const;

const ETIQUETAS_MOBILE: Record<Categoria, string> = {
  "Contratos y Acuerdos": "Contratos",
  "Políticas Institucionales": "Políticas",
  "Formularios y Solicitudes": "Formularios",
};

const PALETA: Record<
  Categoria,
  { bg: string; text: string; border: string; iconColor: string }
> = {
  "Contratos y Acuerdos": {
    bg: "#C9A84C14",
    text: "#8B6914",
    border: "#C9A84C4D",
    iconColor: "#C9A84C",
  },
  "Políticas Institucionales": {
    bg: "#9e191514",
    text: "#9e1915",
    border: "#9e19154D",
    iconColor: "#9e1915",
  },
  "Formularios y Solicitudes": {
    bg: "#0D948814",
    text: "#0D9488",
    border: "#0D94884D",
    iconColor: "#0D9488",
  },
};

const ease = [0.25, 0.1, 0.25, 1] as const;

export function TablaDocumentos() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todos");

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const docsVisibles = DOCUMENTOS.filter((doc) => {
    const matchCat =
      categoriaActiva === "Todos" || doc.categoria === categoriaActiva;
    const matchSearch = doc.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section
      ref={ref}
      className="px-6 py-16 md:px-[160px] md:py-[64px]"
      style={{ background: "#F8F5F0" }}
    >
      {/* Cabecera de sección */}
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
        <p
          className="text-sm leading-[1.6] max-w-xl"
          style={{ color: "#0D182566" }}
        >
          Encuentra y descarga los documentos oficiales emitidos por la Unidad
          Educativa Atenas.
        </p>
      </motion.div>

      {/* Controles: filtros + búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-center gap-4 mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((cat) => {
            const activo = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                style={
                  activo
                    ? { background: "#C9A84C", color: "#0D1825" }
                    : { background: "#0D18250D", color: "#0D182580" }
                }
              >
                {cat}
              </button>
            );
          })}
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

      {/* Tira de aviso */}
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
          Todos los documentos están vigentes para el año lectivo 2026–2027.
          Descarga el que necesites.
        </p>
      </motion.div>

      {/* Tabla desktop — <table> garantiza alineación perfecta de columnas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease, delay: 0.2 }}
        className="hidden md:block"
      >
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <colgroup>
            <col />
            <col style={{ width: 220 }} />
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
                const col = PALETA[doc.categoria];
                const { Icono } = doc;
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      ease,
                      delay: 0.22 + i * 0.06,
                    }}
                    style={{ borderBottom: "1px solid #0D18251A" }}
                  >
                    <td className="py-5">
                      <div className="flex items-center gap-3.5">
                        <Icono
                          size={20}
                          style={{ color: col.iconColor, flexShrink: 0 }}
                        />
                        <span
                          className="text-[14px] font-bold"
                          style={{ color: "#0D1825" }}
                        >
                          {doc.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <span
                        className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-semibold"
                        style={{ background: col.bg, color: col.text }}
                      >
                        {doc.categoria}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <a
                        href={doc.href}
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

      {/* Lista mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease, delay: 0.2 }}
        className="md:hidden"
      >
        {docsVisibles.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color: "#0D182560" }}>
            No se encontraron documentos.
          </p>
        ) : (
          docsVisibles.map((doc, i) => {
            const col = PALETA[doc.categoria];
            const { Icono } = doc;
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-3 py-4"
                style={{ borderBottom: "1px solid #0D18251A" }}
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icono
                      size={14}
                      style={{ color: col.iconColor, flexShrink: 0 }}
                    />
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[8px] font-bold"
                      style={{ background: col.bg, color: col.text }}
                    >
                      {ETIQUETAS_MOBILE[doc.categoria]}
                    </span>
                  </div>
                  <span
                    className="text-[13px] font-bold leading-[1.3]"
                    style={{ color: "#0D1825" }}
                  >
                    {doc.nombre}
                  </span>
                </div>
                <a
                  href={doc.href}
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
