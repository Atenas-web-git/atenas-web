import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail, ChevronRight, Check, X } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { plantillasVisibles } from "@/lib/auth/areas";
import {
  TIPOS_PLANTILLA_FORMULARIO,
  TIPOS_PLANTILLA_INFO,
} from "./constants";
import { FORMULARIOS_GESTIONADOS_APARTE } from "@/lib/formularios/gestionadosAparte";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function PlantillasFormulariosPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  // `null` = todas. Talento Humano solo ve la de «Trabaja con nosotros»; las
  // otras cuatro son de comunicaciones y admisiones.
  const visibles = plantillasVisibles(user);
  if (visibles !== null && visibles.length === 0) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  let consultaPlantillas = supabase
    .from("plantillas_correo_formularios")
    .select("tipo, asunto, activo, updated_at");
  if (visibles !== null) consultaPlantillas = consultaPlantillas.in("tipo", visibles);
  const { data: plantillas } = await consultaPlantillas;

  // Qué formulario usa cada plantilla. Sin esto, el nombre de la plantilla es
  // lo único que hay para adivinarlo, y en un panel que va a usar gente no
  // técnica eso es pedir demasiado.
  const { data: formularios } = await supabase
    .from("formularios")
    .select("nombre, plantilla_correo")
    .not("plantilla_correo", "is", null);

  const usadaPor = new Map<string, string[]>();
  for (const f of (formularios ?? []) as { nombre: string; plantilla_correo: string }[]) {
    usadaPor.set(f.plantilla_correo, [
      ...(usadaPor.get(f.plantilla_correo) ?? []),
      f.nombre,
    ]);
  }
  for (const f of FORMULARIOS_GESTIONADOS_APARTE) {
    usadaPor.set(f.plantillaCorreo, [
      ...(usadaPor.get(f.plantillaCorreo) ?? []),
      f.nombre,
    ]);
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Contenido
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Plantillas de correo para formularios
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#6B6660",
            margin: "4px 0 0",
            maxWidth: 720,
          }}
        >
          Correos de confirmación que recibe el usuario que llena un formulario público.
          El correo interno que llega al admin del colegio se genera automáticamente con los
          datos del envío y no requiere plantilla.
        </p>
      </div>

      <div
        className="flex items-start gap-3 px-5 py-4 rounded-lg"
        style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
      >
        <Mail size={18} color="#1E40AF" strokeWidth={2} />
        <p style={{ fontSize: 13, color: "#1E40AF", margin: 0, lineHeight: 1.6 }}>
          Las plantillas comparten el mismo wrapper navy de admisiones para mantener una
          identidad visual consistente. Cada plantilla tiene sus propias variables
          disponibles (mostradas en el editor).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {TIPOS_PLANTILLA_FORMULARIO.filter(
          (tipo) => visibles === null || visibles.includes(tipo)
        ).map((tipo) => {
          const info = TIPOS_PLANTILLA_INFO[tipo];
          const plantilla = (plantillas ?? []).find((p) => p.tipo === tipo);
          const existe = !!plantilla;
          const activo = plantilla?.activo ?? false;

          return (
            <Link
              key={tipo}
              href={`/admin/contenido/plantillas-formularios/${tipo}`}
              className="flex items-center gap-4 p-5 transition-all hover:shadow-sm"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DD",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  background: `${info.color}15`,
                  borderRadius: 10,
                }}
              >
                <Mail size={18} color={info.color} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1A2B4A",
                      margin: 0,
                    }}
                  >
                    {info.label}
                  </h3>
                  {existe ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 rounded-full"
                      style={{
                        height: 20,
                        background: activo ? "#D1FAE5" : "#FEE2E2",
                        fontSize: 10,
                        fontWeight: 700,
                        color: activo ? "#065F46" : "#991B1B",
                      }}
                    >
                      {activo ? (
                        <Check size={10} strokeWidth={3} />
                      ) : (
                        <X size={10} strokeWidth={3} />
                      )}
                      {activo ? "Activa" : "Pausada"}
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center px-2 rounded-full"
                      style={{
                        height: 20,
                        background: "#F4F1EB",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#6B6660",
                      }}
                    >
                      Sin configurar
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#6B6660",
                    margin: "4px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {info.description}
                </p>
                {usadaPor.has(tipo) && (
                  <p style={{ fontSize: 11, color: "#6B6660", margin: "6px 0 0" }}>
                    Formulario: <strong>{usadaPor.get(tipo)!.join(", ")}</strong>
                  </p>
                )}
                <p style={{ fontSize: 11, color: "#A0AABA", margin: "6px 0 0" }}>
                  Última edición: {formatDate(plantilla?.updated_at ?? null)}
                </p>
              </div>
              <ChevronRight size={16} color="#A0AABA" strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
