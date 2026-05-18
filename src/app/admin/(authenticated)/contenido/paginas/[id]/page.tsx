import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";
import {
  PLANTILLAS,
  type ContenidoPlantillaA,
  type ContenidoPlantillaB,
  type ContenidoPlantillaC,
  type ContenidoPlantillaD,
  type ContenidoPlantillaF,
  type ContenidoPlantillaG,
  type ContenidoPlantillaH,
  type ContenidoPlantillaI,
  type ContenidoPlantillaJ,
  type ContenidoPlantillaK,
  type ContenidoPlantillaL,
  type ContenidoPlantillaM,
  type ContenidoPlantillaN,
  type ContenidoPlantillaO,
  type ContenidoPlantillaP,
  type ContenidoPlantillaQ,
} from "../../plantillas";
import { EditorPlantillaA } from "./EditorPlantillaA";
import { EditorPlantillaB } from "./EditorPlantillaB";
import { EditorPlantillaC } from "./EditorPlantillaC";
import { EditorPlantillaD } from "./EditorPlantillaD";
import { EditorPlantillaF } from "./EditorPlantillaF";
import { EditorPlantillaG } from "./EditorPlantillaG";
import { EditorPlantillaH } from "./EditorPlantillaH";
import { EditorPlantillaI } from "./EditorPlantillaI";
import { EditorPlantillaJ } from "./EditorPlantillaJ";
import { EditorPlantillaK } from "./EditorPlantillaK";
import { EditorPlantillaL } from "./EditorPlantillaL";
import { EditorPlantillaM } from "./EditorPlantillaM";
import { EditorPlantillaN } from "./EditorPlantillaN";
import { EditorPlantillaO } from "./EditorPlantillaO";
import { EditorPlantillaP } from "./EditorPlantillaP";
import { EditorPlantillaQ } from "./EditorPlantillaQ";
import { CambiarPlantillaBtn } from "./CambiarPlantillaBtn";
import { EliminarPaginaClient } from "./EliminarPaginaClient";

export default async function EditarPaginaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data: pagina } = await supabase
    .from("paginas")
    .select("id, slug, titulo, plantilla, contenido, meta_title, meta_description, publicada, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (!pagina) notFound();

  const plantillaInfo = PLANTILLAS[pagina.plantilla as keyof typeof PLANTILLAS];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/admin/contenido/paginas"
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Volver al listado
        </Link>
        {pagina.publicada && (
          <a
            href={`/${pagina.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
            style={{
              height: 32,
              background: "#F4F1EB",
              fontSize: 12,
              color: "#1A2B4A",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <ExternalLink size={12} strokeWidth={2.5} />
            Ver pública
          </a>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
              {pagina.titulo}
            </h1>
            <span
              className="inline-flex items-center px-2 rounded-full"
              style={{
                height: 20,
                background: "#EFF6FF",
                fontSize: 10,
                fontWeight: 700,
                color: "#1E40AF",
                letterSpacing: 0.3,
              }}
              title={plantillaInfo?.nombre ?? pagina.plantilla}
            >
              Plantilla {plantillaInfo?.letra ?? "?"}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#6B6660", margin: "4px 0 0" }}>
            <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              /{pagina.slug}
            </code>
            {" · "}
            {plantillaInfo?.nombre}
          </p>
        </div>
        <CambiarPlantillaBtn
          paginaId={pagina.id}
          plantillaActual={pagina.plantilla as Parameters<typeof CambiarPlantillaBtn>[0]["plantillaActual"]}
          slug={pagina.slug}
        />
      </div>

      {pagina.plantilla === "tpl_a_hero_texto" && (
        <EditorPlantillaA
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaA}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_b_hero_grid" && (
        <EditorPlantillaB
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaB}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_c_hero_pasos" && (
        <EditorPlantillaC
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaC}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_d_hero_detalle" && (
        <EditorPlantillaD
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaD}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_f_hero_academico" && (
        <EditorPlantillaF
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaF}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_g_landing_ib" && (
        <EditorPlantillaG
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaG}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_h_landing_niveles" && (
        <EditorPlantillaH
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaH}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_i_historia" && (
        <EditorPlantillaI
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaI}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_j_landing_matriculas" && (
        <EditorPlantillaJ
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaJ}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_k_ficha_servicio" && (
        <EditorPlantillaK
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaK}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_l_ficha_espacio" && (
        <EditorPlantillaL
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaL}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_m_home" && (
        <EditorPlantillaM
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaM}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_n_trabaja" && (
        <EditorPlantillaN
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaN}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_o_admision_nivel" && (
        <EditorPlantillaO
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaO}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_p_admisiones_landing" && (
        <EditorPlantillaP
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaP}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla === "tpl_q_contactos_pagina" && (
        <EditorPlantillaQ
          paginaId={pagina.id}
          slug={pagina.slug}
          initialTitulo={pagina.titulo}
          initialContenido={pagina.contenido as ContenidoPlantillaQ}
          initialMetaTitle={pagina.meta_title ?? ""}
          initialMetaDescription={pagina.meta_description ?? ""}
          initialPublicada={pagina.publicada}
        />
      )}

      {pagina.plantilla !== "tpl_a_hero_texto" &&
        pagina.plantilla !== "tpl_b_hero_grid" &&
        pagina.plantilla !== "tpl_c_hero_pasos" &&
        pagina.plantilla !== "tpl_d_hero_detalle" &&
        pagina.plantilla !== "tpl_f_hero_academico" &&
        pagina.plantilla !== "tpl_g_landing_ib" &&
        pagina.plantilla !== "tpl_h_landing_niveles" &&
        pagina.plantilla !== "tpl_i_historia" &&
        pagina.plantilla !== "tpl_j_landing_matriculas" &&
        pagina.plantilla !== "tpl_k_ficha_servicio" &&
        pagina.plantilla !== "tpl_l_ficha_espacio" &&
        pagina.plantilla !== "tpl_m_home" &&
        pagina.plantilla !== "tpl_n_trabaja" &&
        pagina.plantilla !== "tpl_o_admision_nivel" &&
        pagina.plantilla !== "tpl_p_admisiones_landing" &&
        pagina.plantilla !== "tpl_q_contactos_pagina" && (
        <div
          className="px-5 py-4 rounded-md"
          style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
        >
          <p style={{ fontSize: 13, color: "#92400E", margin: 0 }}>
            La plantilla <strong>{plantillaInfo?.nombre}</strong> aún no tiene editor implementado. Próximamente.
          </p>
        </div>
      )}

      {/* Zona peligrosa: solo superadmin */}
      {hasRole(user, ROLES.SUPERADMIN) && (
        <div
          className="flex flex-col gap-3 p-5"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 12,
          }}
        >
          <h2
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6B6660",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              margin: 0,
            }}
          >
            Zona peligrosa
          </h2>
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
            Eliminar la página borra el registro de Supabase. La ruta pública dejará de funcionar inmediatamente.
          </p>
          <EliminarPaginaClient paginaId={pagina.id} titulo={pagina.titulo} />
        </div>
      )}
    </div>
  );
}
