/**
 * Sección que inserta un formulario del motor dentro de una página.
 *
 * Server component: lee la definición con service_role y le pasa al cliente
 * solo la parte pública, sin los correos internos del colegio.
 *
 * Se engancha en `PlantillaRenderer`, así que cualquiera de las plantillas del
 * CMS puede llevar formulario sin tocar sus 20 editores: la página apunta al
 * formulario por su id y esto lo pinta al final del contenido.
 *
 * Si el formulario no existe o está desactivado no renderiza nada. Es
 * deliberado: desactivar es la forma de retirar un formulario del sitio sin
 * borrar las respuestas recibidas, y la página debe seguir sirviéndose.
 */

import {
  getFormularioPublicoPorId,
  getFormularioPublico,
} from "@/lib/formularios/getFormulario";
import { FormularioDinamico } from "./FormularioDinamico";

type Props = {
  /** Id del formulario (el enganche desde `paginas.formulario_id`). */
  formularioId?: string | null;
  /** Alternativa por slug, para las rutas físicas que lo fijan en código. */
  slug?: string;
  /** Fondo de la sección. `cream` es el de las secciones intercaladas. */
  fondo?: "blanco" | "cream";
  /**
   * Valores con los que arranca el formulario, por key de campo.
   *
   * Lo usan las páginas de vacante: el mismo formulario de postulación sirve
   * para todas, y cada una llega con su cargo ya puesto. Así el colegio
   * mantiene un solo formulario —como hace hoy— pero sabe a qué vacante
   * postuló cada quien sin depender de que lo escriban bien.
   */
  valoresIniciales?: Record<string, string>;
};

export async function BloqueFormulario({
  formularioId,
  slug,
  fondo = "cream",
  valoresIniciales,
}: Props) {
  if (!formularioId && !slug) return null;

  const formulario = formularioId
    ? await getFormularioPublicoPorId(formularioId)
    : await getFormularioPublico(slug!);

  if (!formulario || formulario.campos.length === 0) return null;

  return (
    <section
      id={`formulario-${formulario.slug}`}
      className="px-[24px] py-[56px] sm:px-[40px] sm:py-[80px]"
      style={{
        background: fondo === "cream" ? "var(--color-cream)" : "#FFFFFF",
      }}
    >
      <div
        className="mx-auto w-full max-w-[720px] rounded-[12px] border p-[24px] sm:p-[40px]"
        style={{ borderColor: "#E8E4DD", background: "#FFFFFF" }}
      >
        <FormularioDinamico
          formulario={formulario}
          valoresIniciales={valoresIniciales}
        />
      </div>
    </section>
  );
}
