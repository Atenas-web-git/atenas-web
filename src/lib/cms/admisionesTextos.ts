/**
 * Tipos, constantes y helpers PUROS para los textos chicos editables
 * de /admisiones/formulario y /admisiones/seguimiento.
 *
 * Solo cubre headers e intros — la lógica del wizard y la búsqueda
 * del estado de solicitud permanece en código (patrón #25).
 */

export type AdmisionesTextosConfig = {
  formulario: {
    headerTitle: string;
    backLabel: string;
  };
  seguimiento: {
    headerTitle: string;
    backLabel: string;
    introTitle: string;
    introDescription: string;
  };
};

export const ADMISIONES_TEXTOS_DEFAULT: AdmisionesTextosConfig = {
  formulario: {
    headerTitle: "Proceso de Admisión",
    backLabel: "← Volver al sitio",
  },
  seguimiento: {
    headerTitle: "Seguimiento de Solicitud",
    backLabel: "← Volver al sitio",
    introTitle: "Consulta el estado de tu solicitud",
    introDescription:
      "Ingresa el número de seguimiento que recibiste por correo al iniciar tu proceso de admisión.",
  },
};

export function mergeAdmisionesTextos(
  input: Partial<AdmisionesTextosConfig> | null
): AdmisionesTextosConfig {
  if (!input) return ADMISIONES_TEXTOS_DEFAULT;
  const def = ADMISIONES_TEXTOS_DEFAULT;
  return {
    formulario: {
      headerTitle:
        input.formulario?.headerTitle?.trim() || def.formulario.headerTitle,
      backLabel: input.formulario?.backLabel?.trim() || def.formulario.backLabel,
    },
    seguimiento: {
      headerTitle:
        input.seguimiento?.headerTitle?.trim() || def.seguimiento.headerTitle,
      backLabel: input.seguimiento?.backLabel?.trim() || def.seguimiento.backLabel,
      introTitle: input.seguimiento?.introTitle?.trim() || def.seguimiento.introTitle,
      introDescription:
        input.seguimiento?.introDescription?.trim() || def.seguimiento.introDescription,
    },
  };
}
