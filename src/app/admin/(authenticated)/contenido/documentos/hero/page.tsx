import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { EditorHero } from "./EditorHero";

type HeroValue = {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  ghostText?: string | null;
  footnote?: string | null;
  bgImageSrc?: string | null;
};

const DEFAULT_HERO = {
  badge: "DOCUMENTOS INSTITUCIONALES",
  title: "Documentos Institucionales",
  subtitle:
    "Resoluciones, contratos, políticas y formularios para familias y estudiantes de la Unidad Educativa Atenas.",
  ghostText: "DOCUMENTOS",
  footnote: "",
  bgImageSrc: "",
};

export default async function HeroDocumentosPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "documentos_pagina_hero")
    .maybeSingle();

  const v = (data?.value as HeroValue | null) ?? null;

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/documentos"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Documentos
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <ImageIcon size={20} color="#1A2B4A" strokeWidth={2} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Cabecera de la página
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "6px 0 0", lineHeight: 1.6, maxWidth: 720 }}>
          Edita el hero (cabecera) que aparece en{" "}
          <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
            /documentos-institucionales
          </code>
          . Los cambios se reflejan en el sitio público en menos de 1 minuto.
        </p>
      </div>

      <EditorHero
        initial={{
          badge: v?.badge ?? DEFAULT_HERO.badge,
          title: v?.title ?? DEFAULT_HERO.title,
          subtitle: v?.subtitle ?? DEFAULT_HERO.subtitle,
          ghostText: v?.ghostText ?? DEFAULT_HERO.ghostText,
          footnote: v?.footnote ?? DEFAULT_HERO.footnote,
          bgImageSrc: v?.bgImageSrc ?? DEFAULT_HERO.bgImageSrc,
        }}
      />
    </div>
  );
}
