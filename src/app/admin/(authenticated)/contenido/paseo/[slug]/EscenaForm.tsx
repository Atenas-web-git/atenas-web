"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import {
  guardarEscenaAction,
  publicarEscenaAction,
  type PaseoActionState,
} from "../actions";

const INICIAL: PaseoActionState = { error: null, ok: false };

export function EscenaForm({
  escena,
  grupos,
  accesosEntrantes,
}: {
  escena: {
    slug: string;
    titulo: string;
    descripcion: string | null;
    grupo: string;
    orden: number;
    publicada: boolean;
  };
  grupos: string[];
  accesosEntrantes: number;
}) {
  // ⚠️ El estado NO se descarta. En agosto se escribió
  // `const [, accion] = useActionState(...)` en otra pantalla y el error del
  // servidor no llegaba nunca: el formulario fallaba en silencio.
  const [estado, guardar, guardando] = useActionState(guardarEscenaAction, INICIAL);
  const [estadoPub, publicar, publicando] = useActionState(publicarEscenaAction, INICIAL);

  const error = estado.error ?? estadoPub.error;
  const guardado = estado.ok || estadoPub.ok;

  return (
    <>
      {error && (
        <p
          className="px-4 py-3 rounded-md mb-4"
          style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", fontSize: 14 }}
          role="alert"
        >
          {error}
        </p>
      )}

      {guardado && !error && (
        <p
          className="px-4 py-3 rounded-md mb-4"
          style={{ background: "#D1FAE5", color: "#065F46", border: "1px solid #86EFAC", fontSize: 14 }}
          role="status"
        >
          Guardado. El cambio ya se ve en el paseo.
        </p>
      )}

      <form action={guardar} className="rounded-lg p-5 mb-5" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD" }}>
        <input type="hidden" name="slug" value={escena.slug} />

        <label className="block mb-4">
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A2B4A", marginBottom: 6 }}>
            Nombre del espacio
          </span>
          <input
            name="titulo"
            defaultValue={escena.titulo}
            required
            maxLength={80}
            className="w-full px-3 rounded-md"
            style={{ height: 40, fontSize: 15, color: "#2C2C2C" }}
          />
        </label>

        <label className="block mb-4">
          <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A2B4A", marginBottom: 6 }}>
            Descripción <span style={{ fontWeight: 400, color: "#6B6660" }}>(opcional)</span>
          </span>
          <textarea
            name="descripcion"
            defaultValue={escena.descripcion ?? ""}
            rows={3}
            maxLength={400}
            className="w-full px-3 py-2 rounded-md"
            style={{ fontSize: 15, color: "#2C2C2C" }}
          />
          <span style={{ fontSize: 13, color: "#6B6660" }}>
            Se lee debajo del recorrido cuando alguien entra a este espacio.
          </span>
        </label>

        <div className="flex flex-wrap gap-4 mb-5">
          <label style={{ flex: "1 1 14rem" }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A2B4A", marginBottom: 6 }}>
              Zona
            </span>
            <select
              name="grupo"
              defaultValue={escena.grupo}
              className="w-full px-3 rounded-md"
              style={{ height: 40, fontSize: 15, color: "#2C2C2C" }}
            >
              {grupos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label style={{ flex: "0 1 8rem" }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A2B4A", marginBottom: 6 }}>
              Orden
            </span>
            <input
              name="orden"
              type="number"
              min={1}
              max={99}
              defaultValue={escena.orden}
              className="w-full px-3 rounded-md"
              style={{ height: 40, fontSize: 15, color: "#2C2C2C" }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="inline-flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ height: 40, background: "#1A2B4A", color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}
        >
          <Save size={15} strokeWidth={2.5} />
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      <form action={publicar} className="rounded-lg p-5" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD" }}>
        <input type="hidden" name="slug" value={escena.slug} />
        <input type="hidden" name="publicada" value={escena.publicada ? "0" : "1"} />

        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", marginBottom: 6 }}>
          {escena.publicada ? "Este espacio se ve en el paseo" : "Este espacio está escondido"}
        </h2>

        <p style={{ fontSize: 14, color: "#6B6660", marginBottom: 12 }}>
          {escena.publicada
            ? accesosEntrantes > 0
              ? `Si lo escondes, los ${accesosEntrantes} accesos que llevan a él dejarán de verse en los demás espacios.`
              : "Ningún otro espacio lleva a este, así que esconderlo no afecta al recorrido."
            : "Nadie lo ve todavía. Al mostrarlo, vuelven a aparecer los accesos que llevan a él."}
        </p>

        <button
          type="submit"
          disabled={publicando}
          className="inline-flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{
            height: 40,
            background: escena.publicada ? "#F4F1EB" : "#1A2B4A",
            color: escena.publicada ? "#1A2B4A" : "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {escena.publicada ? <EyeOff size={15} strokeWidth={2.5} /> : <Eye size={15} strokeWidth={2.5} />}
          {publicando ? "Guardando…" : escena.publicada ? "Esconder del paseo" : "Mostrar en el paseo"}
        </button>
      </form>
    </>
  );
}
