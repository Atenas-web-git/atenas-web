/**
 * Tipos, defaults y merge PUROS para los textos editables del flujo
 * público de admisiones (/admisiones/formulario + /admisiones/seguimiento).
 *
 * La lógica del wizard (validaciones, estado del step, submit) permanece
 * en código — esto cubre solo strings y opciones visibles.
 *
 * Patrón #26: cada campo "string" del editor se trim()ea al guardar; si
 * queda vacío se cae al default. Los textareas con listas se parsean por
 * salto de línea.
 */

// ── Tipos ──────────────────────────────────────────────────────────────────

export type CampoTexto = { label: string; placeholder: string };

export type AdmisionesTextosConfig = {
  formulario: {
    headerTitle: string;
    backLabel: string;

    pasoTitulos: { paso1: string; paso2: string; paso3: string; paso4: string };
    pasoSubtitulos: { paso1: string; paso2: string; paso3: string; paso4: string };

    camposEstudiante: {
      nombresLabel: string;
      nombresPlaceholder: string;
      apellidosLabel: string;
      apellidosPlaceholder: string;
      fechaNacLabel: string;
      nivelLabel: string;
      nivelPlaceholder: string;
      institucionLabel: string;
      institucionPlaceholder: string;
    };

    camposRepresentante: {
      nombresLabel: string;
      nombresPlaceholder: string;
      apellidosLabel: string;
      apellidosPlaceholder: string;
      relacionLabel: string;
      relacionPlaceholder: string;
      correoLabel: string;
      correoPlaceholder: string;
      telefonoLabel: string;
      telefonoPlaceholder: string;
    };

    camposAdicional: {
      comoEnteradoLabel: string;
      comoEnteradoPlaceholder: string;
      anioIngresoLabel: string;
      anioIngresoPlaceholder: string;
      comentariosLabel: string;
      comentariosPlaceholder: string;
    };

    opciones: {
      // Listas separadas por salto de línea.
      niveles: string[];
      relaciones: string[];
      comoEnterado: string[];
    };

    confirmacion: {
      seccionEstudiante: string;
      seccionRepresentante: string;
      seccionAdicional: string;
      botonEditar: string;
      mensajeFinal: string;
    };

    navegacion: {
      anterior: string;
      siguiente: string;
      enviar: string;
      enviando: string;
    };

    exito: {
      titulo: string;
      descripcion: string;
      etiquetaSeguimiento: string;
      queSigueTitulo: string;
      queSigueBullets: string[];
      botonVolver: string;
      botonInicio: string;
    };

    privacidad: {
      // El texto puede contener el marcador {{politica}} donde se
      // insertará el link con label `politicaLabel` apuntando a /politicas.
      texto: string;
      politicaLabel: string;
    };
  };

  seguimiento: {
    headerTitle: string;
    backLabel: string;
    introTitle: string;
    introDescription: string;
  };
};

// ── Defaults ───────────────────────────────────────────────────────────────

export const ADMISIONES_TEXTOS_DEFAULT: AdmisionesTextosConfig = {
  formulario: {
    headerTitle: "Proceso de Admisión",
    backLabel: "← Volver al sitio",

    pasoTitulos: {
      paso1: "Datos del Estudiante",
      paso2: "Datos del Representante",
      paso3: "Información Adicional",
      paso4: "Confirma los datos para la recepción de los requisitos de admisión",
    },
    pasoSubtitulos: {
      paso1: "Información del estudiante que desea ingresar a la institución.",
      paso2: "Información de la persona responsable del estudiante.",
      paso3: "Cuéntanos un poco más para personalizar el proceso de admisión.",
      paso4: "Revisa los datos antes de enviar. Puedes editarlos si es necesario.",
    },

    camposEstudiante: {
      nombresLabel: "Nombres",
      nombresPlaceholder: "Ej. María José",
      apellidosLabel: "Apellidos",
      apellidosPlaceholder: "Ej. Pérez Romero",
      fechaNacLabel: "Fecha de nacimiento",
      nivelLabel: "Nivel al que aplica",
      nivelPlaceholder: "Selecciona el nivel...",
      institucionLabel: "Institución de origen (opcional)",
      institucionPlaceholder: "Ej. Unidad Educativa Sagrado Corazón",
    },

    camposRepresentante: {
      nombresLabel: "Nombres",
      nombresPlaceholder: "Ej. Carlos Andrés",
      apellidosLabel: "Apellidos",
      apellidosPlaceholder: "Ej. Espinoza Torres",
      relacionLabel: "Relación con el estudiante",
      relacionPlaceholder: "Padre / Madre / Tutor legal...",
      correoLabel: "Correo electrónico",
      correoPlaceholder: "correo@ejemplo.com",
      telefonoLabel: "Teléfono / Celular",
      telefonoPlaceholder: "+593 9__ ___ ____",
    },

    camposAdicional: {
      comoEnteradoLabel: "¿Cómo se enteró del colegio?",
      comoEnteradoPlaceholder: "Selecciona una opción...",
      anioIngresoLabel: "Año lectivo de ingreso",
      anioIngresoPlaceholder: "Selecciona el año...",
      comentariosLabel: "Comentarios adicionales (opcional)",
      comentariosPlaceholder:
        "Escribe aquí cualquier información adicional que desees compartir con el equipo de admisiones...",
    },

    opciones: {
      niveles: [
        "Educación Inicial",
        "EGB Elemental y Media",
        "EGB Superior",
        "Bachillerato IB",
      ],
      relaciones: ["Padre", "Madre", "Tutor legal", "Abuelo/a", "Otro"],
      comoEnterado: [
        "Redes sociales",
        "Recomendación de amigo o familiar",
        "Página web del colegio",
        "Evento o feria educativa",
        "Otro",
      ],
    },

    confirmacion: {
      seccionEstudiante: "Datos del Estudiante",
      seccionRepresentante: "Datos del Representante",
      seccionAdicional: "Información Adicional",
      botonEditar: "Editar",
      mensajeFinal: "¡Nos pondremos en contacto contigo lo más pronto posible!",
    },

    navegacion: {
      anterior: "← Anterior",
      siguiente: "Siguiente →",
      enviar: "Enviar solicitud",
      enviando: "Enviando...",
    },

    exito: {
      titulo: "¡Solicitud enviada exitosamente!",
      descripcion:
        "Hemos recibido tu solicitud. Nuestro equipo la revisará y se pondrá en contacto contigo muy pronto.",
      etiquetaSeguimiento: "N° de seguimiento",
      queSigueTitulo: "¿Qué sigue?",
      queSigueBullets: [
        "Recibirás un correo de confirmación en los próximos minutos.",
        "Revisaremos tu solicitud en 1–2 días hábiles.",
        "Te contactaremos para coordinar una visita o entrevista.",
      ],
      botonVolver: "← Volver a admisiones",
      botonInicio: "Ir al inicio",
    },

    privacidad: {
      texto:
        "Al enviar aceptas nuestra {{politica}}. Tus datos son usados únicamente para el proceso de admisión.",
      politicaLabel: "Política de Privacidad",
    },
  },

  seguimiento: {
    headerTitle: "Seguimiento de Solicitud",
    backLabel: "← Volver al sitio",
    introTitle: "Consulta el estado de tu solicitud",
    introDescription:
      "Ingresa el número de seguimiento que recibiste por correo al iniciar tu proceso de admisión.",
  },
};

// ── Merge tolerante ────────────────────────────────────────────────────────

function pickStr(v: unknown, fallback: string): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s || fallback;
}

function pickList(v: unknown, fallback: string[]): string[] {
  if (Array.isArray(v)) {
    const cleaned = v
      .filter((x): x is string => typeof x === "string")
      .map((x) => x.trim())
      .filter(Boolean);
    return cleaned.length > 0 ? cleaned : fallback;
  }
  return fallback;
}

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export function mergeAdmisionesTextos(
  input: DeepPartial<AdmisionesTextosConfig> | null
): AdmisionesTextosConfig {
  const def = ADMISIONES_TEXTOS_DEFAULT;
  if (!input) return def;

  const f = (input.formulario ?? {}) as DeepPartial<AdmisionesTextosConfig["formulario"]>;
  const s = (input.seguimiento ?? {}) as DeepPartial<AdmisionesTextosConfig["seguimiento"]>;

  return {
    formulario: {
      headerTitle: pickStr(f.headerTitle, def.formulario.headerTitle),
      backLabel: pickStr(f.backLabel, def.formulario.backLabel),

      pasoTitulos: {
        paso1: pickStr(f.pasoTitulos?.paso1, def.formulario.pasoTitulos.paso1),
        paso2: pickStr(f.pasoTitulos?.paso2, def.formulario.pasoTitulos.paso2),
        paso3: pickStr(f.pasoTitulos?.paso3, def.formulario.pasoTitulos.paso3),
        paso4: pickStr(f.pasoTitulos?.paso4, def.formulario.pasoTitulos.paso4),
      },
      pasoSubtitulos: {
        paso1: pickStr(f.pasoSubtitulos?.paso1, def.formulario.pasoSubtitulos.paso1),
        paso2: pickStr(f.pasoSubtitulos?.paso2, def.formulario.pasoSubtitulos.paso2),
        paso3: pickStr(f.pasoSubtitulos?.paso3, def.formulario.pasoSubtitulos.paso3),
        paso4: pickStr(f.pasoSubtitulos?.paso4, def.formulario.pasoSubtitulos.paso4),
      },

      camposEstudiante: {
        nombresLabel: pickStr(f.camposEstudiante?.nombresLabel, def.formulario.camposEstudiante.nombresLabel),
        nombresPlaceholder: pickStr(f.camposEstudiante?.nombresPlaceholder, def.formulario.camposEstudiante.nombresPlaceholder),
        apellidosLabel: pickStr(f.camposEstudiante?.apellidosLabel, def.formulario.camposEstudiante.apellidosLabel),
        apellidosPlaceholder: pickStr(f.camposEstudiante?.apellidosPlaceholder, def.formulario.camposEstudiante.apellidosPlaceholder),
        fechaNacLabel: pickStr(f.camposEstudiante?.fechaNacLabel, def.formulario.camposEstudiante.fechaNacLabel),
        nivelLabel: pickStr(f.camposEstudiante?.nivelLabel, def.formulario.camposEstudiante.nivelLabel),
        nivelPlaceholder: pickStr(f.camposEstudiante?.nivelPlaceholder, def.formulario.camposEstudiante.nivelPlaceholder),
        institucionLabel: pickStr(f.camposEstudiante?.institucionLabel, def.formulario.camposEstudiante.institucionLabel),
        institucionPlaceholder: pickStr(f.camposEstudiante?.institucionPlaceholder, def.formulario.camposEstudiante.institucionPlaceholder),
      },

      camposRepresentante: {
        nombresLabel: pickStr(f.camposRepresentante?.nombresLabel, def.formulario.camposRepresentante.nombresLabel),
        nombresPlaceholder: pickStr(f.camposRepresentante?.nombresPlaceholder, def.formulario.camposRepresentante.nombresPlaceholder),
        apellidosLabel: pickStr(f.camposRepresentante?.apellidosLabel, def.formulario.camposRepresentante.apellidosLabel),
        apellidosPlaceholder: pickStr(f.camposRepresentante?.apellidosPlaceholder, def.formulario.camposRepresentante.apellidosPlaceholder),
        relacionLabel: pickStr(f.camposRepresentante?.relacionLabel, def.formulario.camposRepresentante.relacionLabel),
        relacionPlaceholder: pickStr(f.camposRepresentante?.relacionPlaceholder, def.formulario.camposRepresentante.relacionPlaceholder),
        correoLabel: pickStr(f.camposRepresentante?.correoLabel, def.formulario.camposRepresentante.correoLabel),
        correoPlaceholder: pickStr(f.camposRepresentante?.correoPlaceholder, def.formulario.camposRepresentante.correoPlaceholder),
        telefonoLabel: pickStr(f.camposRepresentante?.telefonoLabel, def.formulario.camposRepresentante.telefonoLabel),
        telefonoPlaceholder: pickStr(f.camposRepresentante?.telefonoPlaceholder, def.formulario.camposRepresentante.telefonoPlaceholder),
      },

      camposAdicional: {
        comoEnteradoLabel: pickStr(f.camposAdicional?.comoEnteradoLabel, def.formulario.camposAdicional.comoEnteradoLabel),
        comoEnteradoPlaceholder: pickStr(f.camposAdicional?.comoEnteradoPlaceholder, def.formulario.camposAdicional.comoEnteradoPlaceholder),
        anioIngresoLabel: pickStr(f.camposAdicional?.anioIngresoLabel, def.formulario.camposAdicional.anioIngresoLabel),
        anioIngresoPlaceholder: pickStr(f.camposAdicional?.anioIngresoPlaceholder, def.formulario.camposAdicional.anioIngresoPlaceholder),
        comentariosLabel: pickStr(f.camposAdicional?.comentariosLabel, def.formulario.camposAdicional.comentariosLabel),
        comentariosPlaceholder: pickStr(f.camposAdicional?.comentariosPlaceholder, def.formulario.camposAdicional.comentariosPlaceholder),
      },

      opciones: {
        niveles: pickList(f.opciones?.niveles, def.formulario.opciones.niveles),
        relaciones: pickList(f.opciones?.relaciones, def.formulario.opciones.relaciones),
        comoEnterado: pickList(f.opciones?.comoEnterado, def.formulario.opciones.comoEnterado),
      },

      confirmacion: {
        seccionEstudiante: pickStr(f.confirmacion?.seccionEstudiante, def.formulario.confirmacion.seccionEstudiante),
        seccionRepresentante: pickStr(f.confirmacion?.seccionRepresentante, def.formulario.confirmacion.seccionRepresentante),
        seccionAdicional: pickStr(f.confirmacion?.seccionAdicional, def.formulario.confirmacion.seccionAdicional),
        botonEditar: pickStr(f.confirmacion?.botonEditar, def.formulario.confirmacion.botonEditar),
        mensajeFinal: pickStr(f.confirmacion?.mensajeFinal, def.formulario.confirmacion.mensajeFinal),
      },

      navegacion: {
        anterior: pickStr(f.navegacion?.anterior, def.formulario.navegacion.anterior),
        siguiente: pickStr(f.navegacion?.siguiente, def.formulario.navegacion.siguiente),
        enviar: pickStr(f.navegacion?.enviar, def.formulario.navegacion.enviar),
        enviando: pickStr(f.navegacion?.enviando, def.formulario.navegacion.enviando),
      },

      exito: {
        titulo: pickStr(f.exito?.titulo, def.formulario.exito.titulo),
        descripcion: pickStr(f.exito?.descripcion, def.formulario.exito.descripcion),
        etiquetaSeguimiento: pickStr(f.exito?.etiquetaSeguimiento, def.formulario.exito.etiquetaSeguimiento),
        queSigueTitulo: pickStr(f.exito?.queSigueTitulo, def.formulario.exito.queSigueTitulo),
        queSigueBullets: pickList(f.exito?.queSigueBullets, def.formulario.exito.queSigueBullets),
        botonVolver: pickStr(f.exito?.botonVolver, def.formulario.exito.botonVolver),
        botonInicio: pickStr(f.exito?.botonInicio, def.formulario.exito.botonInicio),
      },

      privacidad: {
        texto: pickStr(f.privacidad?.texto, def.formulario.privacidad.texto),
        politicaLabel: pickStr(f.privacidad?.politicaLabel, def.formulario.privacidad.politicaLabel),
      },
    },

    seguimiento: {
      headerTitle: pickStr(s.headerTitle, def.seguimiento.headerTitle),
      backLabel: pickStr(s.backLabel, def.seguimiento.backLabel),
      introTitle: pickStr(s.introTitle, def.seguimiento.introTitle),
      introDescription: pickStr(s.introDescription, def.seguimiento.introDescription),
    },
  };
}
