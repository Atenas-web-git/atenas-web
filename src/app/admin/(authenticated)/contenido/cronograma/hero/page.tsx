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
  badge: "UNIDAD EDUCATIVA ATENAS",
  title: "Cronograma Anual 2026 – 2027",
  subtitle:
    "Calendario del año lectivo Sierra con todas las fechas clave para estudiantes, familias y docentes.",
  ghostText: "CRONOGRAMA",
  footnote: "",
  bgImageSrc: "",
};

export default async function HeroCronogramaPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "cronograma_pagina_hero")
    .maybeSingle();

  const v = (data?.value as HeroValue | null) ?? null;

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/cronograma"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver al cronograma
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <ImageIcon size={20} color="#1A2B4A" strokeWidth={2} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Cabecera de la página
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "6px 0 0", lineHeight: 1.6, maxWidth: 720 }}>
          Edita el hero (cabecera) que aparece en{" "}
          <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
            /cronograma-anual
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
