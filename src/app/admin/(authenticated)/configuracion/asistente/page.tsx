import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  getConfiguracionPrivada,
  mergeAsistente,
  type AsistenteConfig,
} from "@/lib/cms/getConfiguracion";
import { createAdminClient } from "@/lib/supabase/admin";
import { traerTodas } from "@/lib/supabase/paginar";
import { MAPA } from "@/components/admin/mapaPantallas";
import { MANUAL_MEDIDAS } from "@/lib/asistente/manual";
import { AsistenteConfigForm, type UsoAsistente } from "./AsistenteConfigForm";

const DIAS_DE_USO = 30;

/**
 * Cuánto se ha usado el asistente en los últimos 30 días, sumado desde
 * `asistente_uso`. Si la tabla no existe todavía (migración 094 sin correr)
 * devuelve `null` y la pantalla lo dice.
 */
type FilaUso = {
  pantalla: string;
  tokens_entrada: number | null;
  tokens_cache: number | null;
  tokens_salida: number | null;
  ok: boolean;
};

async function leerUsoReciente(): Promise<UsoAsistente> {
  const desde = new Date(Date.now() - DIAS_DE_USO * 24 * 60 * 60 * 1000).toISOString();

  // En bloques, no con `.limit()`: PostgREST corta en 1.000 filas y responde
  // 200, y a partir de mil preguntas al mes los números saldrían de un
  // subconjunto sin que nada lo dijera. Mismo arreglo que Métricas (2026-09-02).
  const { filas: data, completa, motivo } = await traerTodas<FilaUso>((d, h) =>
    createAdminClient()
      .from("asistente_uso")
      .select("pantalla, tokens_entrada, tokens_cache, tokens_salida, ok")
      .gte("created_at", desde)
      .order("id", { ascending: true })
      .range(d, h)
  );

  if (!completa && data.length === 0) {
    // Sin tabla (migración 094 sin correr) o sin acceso: la pantalla lo dice.
    console.error("[asistente] no se pudo leer el uso:", motivo);
    return null;
  }

  const porPantalla = new Map<string, number>();
  const uso = {
    dias: DIAS_DE_USO,
    completo: completa,
    preguntas: 0,
    fallidas: 0,
    tokensEntrada: 0,
    tokensCache: 0,
    tokensSalida: 0,
    porPantalla: [] as { titulo: string; preguntas: number }[],
  };

  for (const fila of data) {
    uso.preguntas += 1;
    if (!fila.ok) uso.fallidas += 1;
    uso.tokensEntrada += fila.tokens_entrada ?? 0;
    uso.tokensCache += fila.tokens_cache ?? 0;
    uso.tokensSalida += fila.tokens_salida ?? 0;
    porPantalla.set(fila.pantalla, (porPantalla.get(fila.pantalla) ?? 0) + 1);
  }

  uso.porPantalla = [...porPantalla.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([patron, preguntas]) => ({
      titulo: MAPA.find((e) => e.patron === patron)?.titulo ?? patron,
      preguntas,
    }));

  return uso;
}

export default async function AsistenteConfigPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN])) redirect("/admin");

  const [raw, uso] = await Promise.all([
    getConfiguracionPrivada<Partial<AsistenteConfig>>("asistente"),
    leerUsoReciente(),
  ]);
  const config = mergeAsistente(raw);

  // La API key llega al formulario enmascarada: "••••…last4". Así la clave
  // completa nunca viaja en el HTML del navegador.
  const keyConfigured = config.apiKey.trim().length > 0;
  const maskedKey = keyConfigured
    ? "•".repeat(Math.max(20, config.apiKey.length - 4)) + config.apiKey.slice(-4)
    : "";

  const initial: AsistenteConfig = { ...config, apiKey: maskedKey };

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/configuracion"
        className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "var(--ds-texto-suave)", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Configuración
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ds-texto)", margin: 0 }}>
          Asistente del panel
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--ds-texto-suave)",
            margin: "4px 0 0",
            maxWidth: 760,
            lineHeight: 1.5,
          }}
        >
          El botón <strong>Ayuda</strong> que aparece abajo a la derecha en todo el panel.
          Responde con el manual de Documentación ({MANUAL_MEDIDAS.articulos} artículos),
          sabe en qué pantalla está quien pregunta y guía paso a paso. <strong>No cambia
          nada por nadie</strong>: solo explica cómo hacerlo. La inteligencia artificial la
          paga el colegio con su propia cuenta.
        </p>
      </div>

      <AsistenteConfigForm initial={initial} keyConfigured={keyConfigured} uso={uso} />
    </div>
  );
}
