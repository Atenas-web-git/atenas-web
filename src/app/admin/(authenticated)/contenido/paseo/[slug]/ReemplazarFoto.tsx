"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { carasDesdeEquirectangular } from "@/lib/paseo/caras";
import { confirmarFotoAction, pedirSubidaFotoAction } from "../actions";

type Estado =
  | { fase: "quieto" }
  | { fase: "convirtiendo"; hechas: number; total: number }
  | { fase: "subiendo"; hechas: number; total: number }
  | { fase: "listo" }
  | { fase: "error"; mensaje: string };

/**
 * Reemplazar la fotografía 360° de un espacio.
 *
 * El trabajo pesado ocurre aquí, en el navegador: la foto de la cámara se parte
 * en las seis caras del cubo y se suben directamente a Supabase con permisos de
 * un solo uso. El servidor solo firma esos permisos y, al final, cambia el
 * número de versión del espacio.
 *
 * **Mientras no se confirme, el paseo sigue mostrando la foto anterior.** Si
 * algo se corta a medias, no queda un cubo con caras de dos fotos distintas.
 */
export function ReemplazarFoto({ slug }: { slug: string }) {
  const [estado, setEstado] = useState<Estado>({ fase: "quieto" });
  const [pendiente, iniciar] = useTransition();
  const entrada = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const trabajando = estado.fase === "convirtiendo" || estado.fase === "subiendo" || pendiente;

  async function alElegir(archivo: File) {
    try {
      setEstado({ fase: "convirtiendo", hechas: 0, total: 7 });

      const imagen = await createImageBitmap(archivo);
      const caras = await carasDesdeEquirectangular(imagen, {
        alAvanzar: (hechas, total) => setEstado({ fase: "convirtiendo", hechas, total }),
      });

      const permisos = await pedirSubidaFotoAction(slug);
      if (permisos.error || !permisos.permisos || !permisos.version) {
        setEstado({ fase: "error", mensaje: permisos.error ?? "No se pudo preparar la subida." });
        return;
      }

      const supabase = createClient();
      let hechas = 0;
      setEstado({ fase: "subiendo", hechas, total: permisos.permisos.length });

      for (const permiso of permisos.permisos) {
        const blob = caras[permiso.archivo];
        if (!blob) {
          setEstado({ fase: "error", mensaje: `Faltó generar ${permiso.archivo}.` });
          return;
        }
        const { error } = await supabase.storage
          .from("paseo")
          .uploadToSignedUrl(permiso.camino, permiso.token, blob, { contentType: "image/webp" });

        if (error) {
          setEstado({
            fase: "error",
            mensaje: `Se cortó al subir ${permiso.archivo}: ${error.message}. La foto anterior sigue publicada.`,
          });
          return;
        }
        setEstado({ fase: "subiendo", hechas: ++hechas, total: permisos.permisos.length });
      }

      iniciar(async () => {
        const fin = await confirmarFotoAction(slug, permisos.version!);
        if (fin.error) setEstado({ fase: "error", mensaje: fin.error });
        else {
          setEstado({ fase: "listo" });
          router.refresh();
        }
      });
    } catch (e) {
      setEstado({
        fase: "error",
        mensaje: e instanceof Error ? e.message : "No se pudo procesar la imagen.",
      });
    }
  }

  return (
    <section className="rounded-lg p-5 mt-5" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD" }}>
      <h2 className="flex items-center gap-2" style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", marginBottom: 4 }}>
        <Camera size={16} strokeWidth={2.5} />
        Reemplazar la fotografía
      </h2>

      <p style={{ fontSize: 14, color: "#6B6660", marginBottom: 12 }}>
        Sube la foto <strong>360° equirectangular</strong> que entrega la cámara: una sola imagen,
        del doble de ancha que de alta. Se prepara en tu computadora —tarda medio minuto— y el paseo
        solo cambia cuando termina del todo.
      </p>

      <input
        ref={entrada}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) alElegir(f);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={trabajando}
        onClick={() => entrada.current?.click()}
        className="inline-flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ height: 40, background: "#F4F1EB", color: "#1A2B4A", fontSize: 14, fontWeight: 600 }}
      >
        <Upload size={15} strokeWidth={2.5} />
        {trabajando ? "Trabajando…" : "Elegir la foto"}
      </button>

      {estado.fase === "convirtiendo" && (
        <p style={{ fontSize: 14, color: "#6B6660", marginTop: 10 }} role="status">
          Preparando la foto… {estado.hechas} de {estado.total}. No cierres esta pestaña.
        </p>
      )}

      {estado.fase === "subiendo" && (
        <p style={{ fontSize: 14, color: "#6B6660", marginTop: 10 }} role="status">
          Subiendo… {estado.hechas} de {estado.total}.
        </p>
      )}

      {estado.fase === "listo" && (
        <p
          className="px-4 py-3 rounded-md"
          style={{ marginTop: 10, background: "#D1FAE5", color: "#065F46", border: "1px solid #86EFAC", fontSize: 14 }}
          role="status"
        >
          Listo. La foto nueva ya se ve en el paseo.
        </p>
      )}

      {estado.fase === "error" && (
        <p
          className="px-4 py-3 rounded-md"
          style={{ marginTop: 10, background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", fontSize: 14 }}
          role="alert"
        >
          {estado.mensaje}
        </p>
      )}
    </section>
  );
}
