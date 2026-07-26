import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ExternalLink, Printer } from "lucide-react";
import { SECCIONES, INDICE, TOTAL_ARTICULOS } from "./contenido";
import { IconoSeccion } from "./IconoSeccion";
import { BuscadorClient } from "./BuscadorClient";

export const metadata: Metadata = {
  title: "Documentación",
  robots: { index: false, follow: false },
};

/** Atajos a las tareas que más se repiten en el día a día. */
const ATAJOS: { titulo: string; href: string }[] = [
  { titulo: "Editar el texto de una página", href: "/admin/documentacion/paginas#editar" },
  { titulo: "Subir una foto correctamente", href: "/admin/documentacion/editor#imagenes" },
  { titulo: "Publicar un aviso o popup", href: "/admin/documentacion/notificaciones#crear-notificacion" },
  { titulo: "Cambiar el estado de una solicitud", href: "/admin/documentacion/admisiones#ficha" },
  { titulo: "Subir un documento PDF", href: "/admin/documentacion/documentos#publicar-documento" },
  { titulo: "Crear un usuario del panel", href: "/admin/documentacion/usuarios#crear-usuario" },
  { titulo: "El correo no llegó", href: "/admin/documentacion/correos#no-llegan" },
  { titulo: "Guardé y no veo el cambio", href: "/admin/documentacion/buenas-practicas#problemas" },
];

export default function DocumentacionIndexPage() {
  return (
    <div className="flex flex-col gap-7 p-8" style={{ maxWidth: 1080 }}>
      {/* Portada */}
      <div
        className="flex flex-col gap-3 px-7 py-6"
        style={{
          background: "linear-gradient(135deg, #1A2B4A 0%, #24365C 100%)",
          borderRadius: 14,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "#C9A84C",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Manual de uso
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.25 }}>
          Cómo se maneja la plataforma web
          <br />
          de la Unidad Educativa Atenas
        </h1>
        <p style={{ fontSize: 13.5, color: "#C6CFDE", margin: 0, lineHeight: 1.65, maxWidth: 660 }}>
          Todo lo que se puede hacer desde este panel, explicado paso a paso. Está aquí dentro a
          propósito: solo lo ve quien tiene usuario y contraseña, y se actualiza junto con el
          sistema. {TOTAL_ARTICULOS} artículos en {SECCIONES.length} secciones.
        </p>
      </div>

      {/* Buscador */}
      <BuscadorClient indice={INDICE} />

      {/* Atajos */}
      <div className="flex flex-col gap-3">
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Lo que más se busca
        </h2>
        <div className="flex flex-wrap gap-2">
          {ATAJOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-2 px-3.5 transition-opacity hover:opacity-70"
              style={{
                height: 34,
                background: "#FFFFFF",
                border: "1px solid #E8E4DD",
                borderRadius: 100,
                textDecoration: "none",
                fontSize: 12.5,
                fontWeight: 500,
                color: "#1A2B4A",
              }}
            >
              {a.titulo}
              <ArrowRight size={12} color="#C9A84C" strokeWidth={2.5} />
            </Link>
          ))}
        </div>
      </div>

      {/* Secciones */}
      <div className="flex flex-col gap-3">
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Todas las secciones
        </h2>
        <p style={{ fontSize: 12.5, color: "#6B6660", margin: "-4px 0 4px" }}>
          Están en el orden recomendado para leerlas por primera vez.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECCIONES.map((s, i) => (
            <Link
              key={s.slug}
              href={`/admin/documentacion/${s.slug}`}
              className="flex flex-col gap-3 p-5 transition-all hover:opacity-80"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DD",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center"
                  style={{ width: 34, height: 34, background: "#F4F1EB", borderRadius: 8 }}
                >
                  <IconoSeccion nombre={s.icono} size={17} color="#1A2B4A" />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#D8D3CA",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                  {s.titulo}
                </h3>
                <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.55 }}>
                  {s.descripcion}
                </p>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#A0AABA",
                  borderTop: "1px solid #F1EEE8",
                  paddingTop: 8,
                  marginTop: "auto",
                }}
              >
                {s.paraQuien}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pie */}
      <div
        className="flex flex-col gap-2.5 px-5 py-4"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Dos cosas prácticas
        </h2>
        <div className="flex items-start gap-2.5">
          <Printer size={14} color="#6B6660" strokeWidth={2} style={{ flexShrink: 0, marginTop: 3 }} />
          <p style={{ fontSize: 12.5, color: "#6B6660", margin: 0, lineHeight: 1.6 }}>
            Cualquier sección se puede <strong style={{ color: "#1A2B4A" }}>imprimir o guardar en PDF</strong>{" "}
            con <code>Ctrl + P</code> (o <code>Cmd + P</code>). El menú lateral se oculta solo al imprimir.
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <ExternalLink size={14} color="#6B6660" strokeWidth={2} style={{ flexShrink: 0, marginTop: 3 }} />
          <p style={{ fontSize: 12.5, color: "#6B6660", margin: 0, lineHeight: 1.6 }}>
            Ten el <strong style={{ color: "#1A2B4A" }}>sitio público abierto en otra pestaña</strong> mientras
            trabajas. Después de cada cambio, recárgalo y confirma el resultado con tus propios ojos.
          </p>
        </div>
      </div>
    </div>
  );
}
