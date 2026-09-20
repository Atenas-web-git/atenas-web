import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Compass, ExternalLink, EyeOff } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

type Escena = {
  slug: string;
  titulo: string;
  grupo: string;
  orden_grupo: number;
  orden: number;
  carpeta: string;
  version_imagen: number;
  publicada: boolean;
};

export default async function PaseoPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();

  const { data: escenas = [] } = await supabase
    .from("paseo_escenas")
    .select("slug, titulo, grupo, orden_grupo, orden, carpeta, version_imagen, publicada")
    .order("orden_grupo")
    .order("orden");

  // Cuántos accesos llegan a cada espacio. Es el dato que evita que alguien
  // esconda un espacio sin saber que deja tres accesos apuntando al vacío.
  const { data: puntos = [] } = await supabase
    .from("paseo_puntos")
    .select("destino:destino_id ( slug )");

  const entrantes = new Map<string, number>();
  for (const p of (puntos ?? []) as unknown as { destino: { slug: string } | null }[]) {
    if (!p.destino) continue;
    entrantes.set(p.destino.slug, (entrantes.get(p.destino.slug) ?? 0) + 1);
  }

  const lista = (escenas ?? []) as Escena[];
  const porGrupo = new Map<string, Escena[]>();
  for (const e of lista) {
    if (!porGrupo.has(e.grupo)) porGrupo.set(e.grupo, []);
    porGrupo.get(e.grupo)!.push(e);
  }

  const publicadas = lista.filter((e) => e.publicada).length;

  return (
    <div className="p-6 md:p-8" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Link
        href="/admin/contenido"
        className="inline-flex items-center gap-1.5 mb-4"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Contenido
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="flex items-center gap-2" style={{ fontSize: 24, fontWeight: 700, color: "#1A2B4A" }}>
            <Compass size={22} strokeWidth={2.5} />
            Paseo virtual
          </h1>
          <p style={{ fontSize: 14, color: "#6B6660", marginTop: 4 }}>
            {lista.length} espacios del campus, {publicadas} visibles para las familias.
          </p>
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

      {[...porGrupo.entries()].map(([grupo, delGrupo]) => (
        <section key={grupo} className="mb-6">
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#6B6660", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 8 }}>
            {grupo}
          </h2>

          <ul className="rounded-lg overflow-hidden" style={{ border: "1px solid #E8E4DD", background: "#FFFFFF", listStyle: "none", margin: 0, padding: 0 }}>
            {delGrupo.map((e, i) => (
              <li
                key={e.slug}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
                style={{ borderTop: i === 0 ? "none" : "1px solid #E8E4DD", background: e.publicada ? "#FFFFFF" : "#FAFAF8" }}
              >
                {/* Un espacio escondido no sirve su foto —eso es lo que hace
                    «esconder»—, así que aquí se pinta un hueco con nombre en
                    vez de una imagen rota que parecería un error del panel. */}
                {e.publicada ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`/api/paseo/imagen/${e.carpeta}/v${e.version_imagen}/thumbnail.webp`}
                    alt=""
                    width={72}
                    height={36}
                    style={{ borderRadius: 4, objectFit: "cover", background: "#F4F1EB" }}
                  />
                ) : (
                  <span
                    className="inline-flex items-center justify-center"
                    style={{ width: 72, height: 36, borderRadius: 4, background: "#F4F1EB", color: "#6B6660" }}
                    aria-hidden
                  >
                    <EyeOff size={14} strokeWidth={2.5} />
                  </span>
                )}

                <Link
                  href={`/admin/contenido/paseo/${e.slug}`}
                  style={{ fontSize: 15, fontWeight: 600, color: "#1A2B4A", textDecoration: "none", flex: "1 1 12rem" }}
                >
                  {e.titulo}
                </Link>

                <span style={{ fontSize: 13, color: "#6B6660" }}>
                  {(entrantes.get(e.slug) ?? 0) === 1
                    ? "1 acceso llega aquí"
                    : `${entrantes.get(e.slug) ?? 0} accesos llegan aquí`}
                </span>

                {!e.publicada && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                    style={{ fontSize: 12, fontWeight: 600, background: "#FEF3C7", color: "#92400E" }}
                  >
                    <EyeOff size={12} strokeWidth={2.5} />
                    Escondido
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
