import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { EscenaForm } from "./EscenaForm";

export const dynamic = "force-dynamic";

export default async function EscenaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    redirect("/admin");
  }

  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: escena } = await supabase
    .from("paseo_escenas")
    .select("id, slug, titulo, descripcion, grupo, orden, carpeta, version_imagen, publicada")
    .eq("slug", slug)
    .maybeSingle();

  if (!escena) notFound();

  const [{ data: grupos = [] }, { data: salientes = [] }, { count: entrantes }] = await Promise.all([
    supabase.from("paseo_escenas").select("grupo").order("orden_grupo"),
    supabase
      .from("paseo_puntos")
      .select("etiqueta, orden, destino:destino_id ( slug, titulo )")
      .eq("escena_id", escena.id)
      .order("orden"),
    supabase
      .from("paseo_puntos")
      .select("id", { count: "exact", head: true })
      .eq("destino_id", escena.id),
  ]);

  const listaGrupos = [...new Set(((grupos ?? []) as { grupo: string }[]).map((g) => g.grupo))];
  const accesos = (salientes ?? []) as unknown as {
    etiqueta: string;
    destino: { slug: string; titulo: string } | null;
  }[];

  return (
    <div className="p-6 md:p-8" style={{ maxWidth: 820, margin: "0 auto" }}>
      <Link
        href="/admin/contenido/paseo"
        className="inline-flex items-center gap-1.5 mb-4"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Paseo virtual
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/paseo/imagen/${escena.carpeta}/v${escena.version_imagen}/thumbnail.webp`}
            alt=""
            width={96}
            height={48}
            style={{ borderRadius: 6, objectFit: "cover", background: "#F4F1EB" }}
          />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A2B4A" }}>{escena.titulo}</h1>
            <p style={{ fontSize: 13, color: "#6B6660" }}>{escena.grupo}</p>
          </div>
        </div>

        <Link
          href="/paseo-virtual"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
          style={{ height: 36, background: "#F4F1EB", fontSize: 14, color: "#1A2B4A", fontWeight: 500, textDecoration: "none" }}
        >
          <ExternalLink size={14} strokeWidth={2.5} />
          Ver el paseo
        </Link>
      </div>

      <EscenaForm
        escena={{
          slug: escena.slug,
          titulo: escena.titulo,
          descripcion: escena.descripcion,
          grupo: escena.grupo,
          orden: escena.orden,
          publicada: escena.publicada,
        }}
        grupos={listaGrupos}
        accesosEntrantes={entrantes ?? 0}
      />

      <section className="rounded-lg p-5 mt-5" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", marginBottom: 4 }}>
          Desde aquí se puede ir a {accesos.length} {accesos.length === 1 ? "espacio" : "espacios"}
        </h2>
        <p style={{ fontSize: 13, color: "#6B6660", marginBottom: 12 }}>
          Los accesos vienen del recorrido original y <strong>no se cambian desde el panel</strong>.
          Si hay que mover uno o crear otro, escríbenos y lo hacemos nosotros.
        </p>

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {accesos.map((a, i) => (
            <li
              key={i}
              className="flex items-center gap-2 py-2"
              style={{ borderTop: i === 0 ? "none" : "1px solid #E8E4DD", fontSize: 14, color: "#2C2C2C" }}
            >
              <span>{a.etiqueta || <em style={{ color: "#6B6660" }}>sin texto</em>}</span>
              <ArrowRight size={14} strokeWidth={2.5} color="#6B6660" />
              {a.destino ? (
                <Link href={`/admin/contenido/paseo/${a.destino.slug}`} style={{ color: "#1A2B4A", fontWeight: 600, textDecoration: "none" }}>
                  {a.destino.titulo}
                </Link>
              ) : (
                <span style={{ color: "#991B1B" }}>destino borrado</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
