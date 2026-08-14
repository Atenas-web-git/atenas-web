import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";
import { NIVELES } from "../constants";
import { TODOS_LOS_GRADOS } from "@/lib/admisiones/grados";
import { AdmisionesSubNav } from "../SubNav";
import { CuposFormClient } from "./CuposFormClient";

export default async function CuposPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const sp = await searchParams;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  // Cargar años lectivos activos desde la BD
  const { data: anosData } = await supabase
    .from("anos_lectivos")
    .select("codigo, nombre, activo")
    .eq("activo", true)
    .order("codigo", { ascending: true });

  const anos = anosData ?? [];
  const codigos = anos.map((a) => a.codigo);

  // Si no hay años configurados, mostrar mensaje
  if (anos.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <AdmisionesSubNav />
        <div
          className="flex flex-col items-center justify-center gap-4 py-16 px-6"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 12,
          }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            Aún no hay años lectivos configurados.
          </p>
          {hasRole(user, ROLES.SUPERADMIN) && (
            <Link
              href="/admin/configuracion/anos-lectivos"
              className="px-4 rounded-md transition-opacity hover:opacity-80"
              style={{
                height: 38,
                display: "inline-flex",
                alignItems: "center",
                background: "#1A2B4A",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Configurar años lectivos →
            </Link>
          )}
        </div>
      </div>
    );
  }

  const anoLectivo = codigos.includes(sp.ano ?? "") ? (sp.ano as string) : codigos[0];

  // Estados que cuentan como «esperando»: los que siguen vivos en el pipeline.
  const ESTADOS_ACTIVOS = [
    "interesado",
    "postulante",
    "postulacion_completa",
    "en_evaluacion",
    "en_revision_comite",
    "admitido",
  ];

  const [{ data: cuposData }, { data: solicitudes }] = await Promise.all([
    supabase
      .from("cupos_admision")
      .select("nivel, grado, cupos_total")
      .eq("ano_lectivo", anoLectivo),
    // Una sola consulta y se agrupa aquí, en vez de dos por cada nivel y año:
    // con 15 años escolares eso serían treinta viajes a la base para pintar
    // una tabla.
    //
    // Y se filtra por AÑO LECTIVO, que antes no se hacía: la ocupación contaba
    // todas las solicitudes de la historia contra un cupo que sí es anual, así
    // que cambiar de pestaña no cambiaba el número.
    // Se traen TODAS y se separan aquí. Filtrar por año en la consulta hacía
    // desaparecer de la pantalla —de las tarjetas, del resumen y del detalle—
    // las solicitudes sin año lectivo, y el año lectivo es un campo OPCIONAL
    // del formulario público: no es un resto del pasado, seguirá entrando.
    supabase
      .from("solicitudes_admision")
      .select("est_nivel, est_grado, estado, anio_ingreso"),
  ]);

  const todas = solicitudes ?? [];
  const filas = todas.filter((f) => f.anio_ingreso === anoLectivo);

  function contar(filtro: (f: (typeof filas)[number]) => boolean) {
    return {
      ocupados: filas.filter((f) => filtro(f) && f.estado === "matriculado").length,
      esperando: filas.filter((f) => filtro(f) && ESTADOS_ACTIVOS.includes(f.estado)).length,
    };
  }

  const cupoDe = (nivel: string, grado: string) =>
    (cuposData ?? []).find((c) => c.nivel === nivel && (c.grado ?? "") === grado)?.cupos_total ?? 0;

  // Resumen por nivel. Solo las filas con `grado` vacío, que son las del nivel
  // completo — si no se filtrara, en cuanto exista el primer cupo por año esta
  // tabla enseñaría ese número como si fuera el del nivel entero.
  const cupos = NIVELES.map((nivel) => ({
    nivel,
    cupos_total: cupoDe(nivel, ""),
    ...contar((f) => f.est_nivel === nivel),
  }));

  // Detalle por año escolar.
  const cuposPorGrado = TODOS_LOS_GRADOS.map(({ nivel, grado }) => ({
    nivel,
    grado,
    cupos_total: cupoDe(nivel, grado),
    ...contar((f) => f.est_nivel === nivel && f.est_grado === grado),
  }));

  // Las solicitudes anteriores al 2026-08-11 no tienen año escolar, así que no
  // suman en ninguna fila del detalle. Se dice en pantalla en vez de dejar que
  // los números no cuadren sin explicación.
  const cuenta = (f: (typeof todas)[number]) =>
    ESTADOS_ACTIVOS.concat("matriculado").includes(f.estado);

  const sinGrado = filas.filter((f) => !f.est_grado && cuenta(f)).length;

  // Y las que no caen en NINGUNA pestaña: sin año lectivo, o con uno que ya no
  // está en el catálogo. No aparecen en ninguna cifra de esta pantalla, así que
  // se dicen.
  const sinAnoLectivo = todas.filter(
    (f) => cuenta(f) && !codigos.includes(f.anio_ingreso ?? "")
  ).length;

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Gestión de Cupos
          </h1>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
            Configura los cupos disponibles por nivel y, si quieres, año por año
          </p>
        </div>

        {/* Tabs año lectivo */}
        <div
          className="flex items-center flex-wrap"
          style={{
            border: "1px solid #E8E4DD",
            borderRadius: 8,
            background: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          {anos.map((ano) => {
            const isActive = ano.codigo === anoLectivo;
            return (
              <Link
                key={ano.codigo}
                href={`/admin/admisiones/cupos?ano=${ano.codigo}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 36,
                  paddingLeft: 16,
                  paddingRight: 16,
                  background: isActive ? "#1A2B4A" : "transparent",
                  color: isActive ? "#FFFFFF" : "#6B6660",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.15s ease",
                }}
              >
                {ano.codigo}
              </Link>
            );
          })}
        </div>
      </div>

      <CuposFormClient
        anoLectivo={anoLectivo}
        cupos={cupos}
        cuposPorGrado={cuposPorGrado}
        sinGrado={sinGrado}
        sinAnoLectivo={sinAnoLectivo}
      />
    </div>
  );
}
