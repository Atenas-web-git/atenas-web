import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Newspaper, Calendar, Image as ImageIcon, FileBox, Trophy, Mail, ClipboardList, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

const SECCIONES = [
  {
    href: "/admin/contenido/paginas",
    title: "Páginas",
    description: "Misión, Visión, Valores, secciones institucionales, niveles, servicios. Editor por plantillas.",
    icon: FileText,
    activa: true,
  },
  {
    href: "/admin/contenido/notificaciones",
    title: "Notificaciones",
    description: "Avisos, popups y alertas para visitantes del sitio. Programables con fechas de inicio y fin.",
    icon: Newspaper,
    activa: true,
  },
  {
    href: "/admin/contenido/cronograma",
    title: "Cronograma escolar",
    description: "Eventos del año lectivo con fechas, períodos (quimestres / trimestres) y tipos editables.",
    icon: Calendar,
    activa: true,
  },
  {
    href: "/admin/contenido/galeria",
    title: "Galería",
    description: "Catálogo de imágenes reutilizables del sitio. Reusa fotos ya subidas.",
    icon: ImageIcon,
    activa: true,
  },
  {
    href: "/admin/contenido/documentos",
    title: "Documentos",
    description: "PDFs descargables (políticas, autorizaciones, formularios) hospedados en Google Drive.",
    icon: FileBox,
    activa: true,
  },
  {
    href: "/admin/contenido/reconocimientos",
    title: "Reconocimientos",
    description: "Categorías (académicos, deportivos, profesionales), subcategorías, logros y galerías de fotos.",
    icon: Trophy,
    activa: true,
  },
  {
    href: "/admin/contenido/formularios",
    title: "Formularios",
    description: "Crea tus propios formularios, elige sus campos y colócalos en cualquier página. Las respuestas llegan a una bandeja aquí mismo.",
    icon: ClipboardList,
    activa: true,
  },
  {
    href: "/admin/contenido/plantillas-formularios",
    title: "Plantillas de correo para formularios",
    description: "Correos automáticos que se envían al admin cuando alguien usa los formularios públicos (Contactos, Quejas, Trabaja con nosotros, Admisiones).",
    icon: Mail,
    activa: true,
  },
];

export default async function ContenidoIndexPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Contenido del sitio
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          Edita el contenido del sitio público desde aquí. Los cambios se reflejan automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECCIONES.map((s) => {
          const Icon = s.icon;
          const card = (
            <div
              className="flex flex-col gap-3 p-5 transition-all"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DD",
                borderRadius: 12,
                opacity: s.activa ? 1 : 0.55,
                cursor: s.activa ? "pointer" : "default",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    background: "#F4F1EB",
                    borderRadius: 8,
                  }}
                >
                  <Icon size={18} color="#1A2B4A" strokeWidth={2} />
                </div>
                {s.activa ? (
                  <ArrowRight size={14} color="#6B6660" strokeWidth={2} />
                ) : (
                  <span
                    className="inline-flex items-center px-2 rounded-full"
                    style={{
                      height: 20,
                      background: "#F4F1EB",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#6B6660",
                      letterSpacing: 0.5,
                    }}
                  >
                    Próximamente
                  </span>
                )}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1A2B4A",
                    margin: 0,
                  }}
                >
                  {s.title}
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "#6B6660",
                    margin: "4px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {s.description}
                </p>
              </div>
            </div>
          );
          return s.activa ? (
            <Link key={s.href} href={s.href} style={{ textDecoration: "none" }}>
              {card}
            </Link>
          ) : (
            <div key={s.href}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
