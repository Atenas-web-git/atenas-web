import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Newspaper, Calendar, Image as ImageIcon, FileBox, Trophy, Mail, ClipboardList, BriefcaseBusiness, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole, type AdminUser } from "@/lib/auth/types";
import {
  puedeVerPaginas,
  puedeVerFormularios,
  puedeVerVacantes,
  plantillasVisibles,
} from "@/lib/auth/areas";

/**
 * Qué secciones ve cada rol.
 *
 * `visible` es obligatoria: una sección sin ella se le muestra a todo el
 * mundo, y eso fue exactamente el problema que resolvió la migración 079.
 * Talento Humano solo ve las cuatro de «Trabaja con nosotros».
 */
const SECCIONES: {
  href: string;
  title: string;
  description: string;
  icon: typeof FileText;
  activa: boolean;
  visible: (u: AdminUser) => boolean;
}[] = [
  {
    href: "/admin/contenido/paginas",
    title: "Páginas",
    description: "Misión, Visión, Valores, secciones institucionales, niveles, servicios. Editor por plantillas.",
    icon: FileText,
    activa: true,
    visible: puedeVerPaginas,
  },
  {
    href: "/admin/contenido/notificaciones",
    title: "Notificaciones",
    description: "Avisos, popups y alertas para visitantes del sitio. Programables con fechas de inicio y fin.",
    icon: Newspaper,
    activa: true,
    visible: (u) => !hasRole(u, ROLES.EDITOR_TALENTO),
  },
  {
    href: "/admin/contenido/cronograma",
    title: "Cronograma escolar",
    description: "Eventos del año lectivo con fechas, períodos (quimestres / trimestres) y tipos editables.",
    icon: Calendar,
    activa: true,
    visible: (u) => !hasRole(u, ROLES.EDITOR_TALENTO),
  },
  {
    href: "/admin/contenido/galeria",
    title: "Galería",
    description: "Catálogo de imágenes reutilizables del sitio. Reusa fotos ya subidas.",
    icon: ImageIcon,
    activa: true,
    visible: (u) => !hasRole(u, ROLES.EDITOR_TALENTO),
  },
  {
    href: "/admin/contenido/documentos",
    title: "Documentos",
    description: "PDFs descargables (políticas, autorizaciones, formularios) hospedados en Google Drive.",
    icon: FileBox,
    activa: true,
    visible: (u) => !hasRole(u, ROLES.EDITOR_TALENTO),
  },
  {
    href: "/admin/contenido/reconocimientos",
    title: "Reconocimientos",
    description: "Categorías (académicos, deportivos, profesionales), subcategorías, logros y galerías de fotos.",
    icon: Trophy,
    activa: true,
    visible: (u) => !hasRole(u, ROLES.EDITOR_TALENTO),
  },
  {
    href: "/admin/contenido/formularios",
    title: "Formularios",
    description: "Crea tus propios formularios, elige sus campos y colócalos en cualquier página. Las respuestas llegan a una bandeja aquí mismo.",
    icon: ClipboardList,
    activa: true,
    visible: puedeVerFormularios,
  },
  {
    href: "/admin/contenido/vacantes",
    title: "Vacantes",
    description: "Ofertas de empleo de «Trabaja con nosotros». Cada vacante tiene su página y su formulario, y las postulaciones llegan por separado.",
    icon: BriefcaseBusiness,
    activa: true,
    visible: puedeVerVacantes,
  },
  {
    href: "/admin/contenido/plantillas-formularios",
    title: "Plantillas de correo para formularios",
    // Sin la lista de nombres: a Talento Humano le anunciaría cuatro
    // plantillas que su rol no le deja abrir.
    description: "Correos automáticos que recibe quien completa uno de los formularios públicos del sitio.",
    icon: Mail,
    activa: true,
    visible: (u) => (plantillasVisibles(u)?.length ?? 1) > 0,
  },
];

export default async function ContenidoIndexPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (
    !hasAnyRole(user, [
      ROLES.SUPERADMIN,
      ROLES.EDITOR_COMM,
      ROLES.EDITOR_ACADEMICO,
      ROLES.EDITOR_TALENTO,
    ])
  ) {
    redirect("/admin");
  }

  const secciones = SECCIONES.filter((s) => s.visible(user));

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Contenido del sitio
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0" }}>
          Edita el contenido del sitio público desde aquí. Los cambios se reflejan automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {secciones.map((s) => {
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
                      fontSize: 11,
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
                    fontSize: 13,
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
