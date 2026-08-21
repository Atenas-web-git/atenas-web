/**
 * Tipos, constantes y helpers PUROS para el contenido editable de
 * la página pública /contactos.
 *
 * Vive aparte de `getConfiguracion.ts` para que los client components
 * puedan importar los tipos sin arrastrar `next/headers` (patrón #25).
 *
 * Datos de contacto primarios (teléfono central, dirección, horario,
 * email principal, redes) NO se duplican acá — se leen de
 * `configuracion_global['contacto']`. Solo se guarda lo que es
 * exclusivamente "texto/contenido" de la página /contactos.
 */

import { urlDeMapa } from "./htmlSeguro";

export type ExtensionContacto = {
  /** Número de extensión (ej. "100"). */
  ext: string;
  /** Departamento al que pertenece (ej. "Recepción / Asistente General"). */
  dept: string;
  /** Si true, se resalta en color navy (vs. gris claro). */
  primary: boolean;
};

export type ContactosPaginaConfig = {
  hero: {
    eyebrow: string;
    /** Título a 2 líneas (segunda en dorado). */
    titleLine1: string;
    titleLine2: string;
    /** Párrafo descriptivo (acepta \n para saltos de línea). */
    description: string;
    /** Línea pequeña inferior (dirección decorativa). */
    caption: string;
    /** Texto enorme decorativo del fondo. */
    ghostText: string;
    /** Imagen de fondo con overlay oscuro. */
    bgImage: string;
    /** Tarjeta flotante a la derecha del hero (desktop). */
    tarjeta: {
      titulo: string;
      subtitulo: string;
    };
  };
  canales: {
    eyebrow: string;
    heading: string;
    /** Foto del banner de transición sobre la sección de canales. */
    bannerImagen: string;
    tarjetaTelefono: {
      titulo: string;
      /** Lista de extensiones (la primera con `primary: true` se ve destacada). */
      extensiones: ExtensionContacto[];
    };
    tarjetaDireccion: {
      titulo: string;
      horarioLaboral: string;
      horarioFinde: string;
    };
    tarjetaEmail: {
      titulo: string;
      descripcion: string;
      ctaLabel: string;
      /**
       * Destino del botón. Si está vacío, usa `mailto:${emailPrincipal}`
       * (correo automático con el cliente de correo del visitante). Si
       * tiene valor, se respeta literal — útil para apuntar a un
       * formulario externo (Google Forms, Typeform), a una URL absoluta,
       * a un mailto custom con asunto/cuerpo precargado, etc.
       */
      ctaHref: string;
    };
  };
  formulario: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    submitLabel: string;
    successTitle: string;
    successText: string;
  };
  mapa: {
    /** URL del iframe de Google Maps Embed. */
    embedUrl: string;
    /** Texto del badge sobre el mapa (al lado derecho para no chocar con la card nativa de Google). */
    badgeText: string;
  };
};

export const CONTACTOS_PAGINA_DEFAULT: ContactosPaginaConfig = {
  hero: {
    eyebrow: "Unidad Educativa Atenas",
    titleLine1: "Estamos",
    titleLine2: "aquí para ti.",
    description:
      "Escríbenos, llámanos o visítanos.\nNuestro equipo está listo para orientarte en todo lo que necesites.",
    caption: "Calle Gabriel Román s/n y Av. Pedro Vásconez · Izamba, Ambato",
    ghostText: "CONTACTOS",
    bgImage:
      "https://images.unsplash.com/photo-1604960198403-53793a3916b5?w=1440&q=80",
    tarjeta: {
      titulo: "Contáctanos",
      subtitulo: "Respuesta rápida garantizada",
    },
  },
  canales: {
    eyebrow: "Información de contacto",
    heading: "Canales de atención",
    bannerImagen:
      "https://images.unsplash.com/photo-1758270703733-3663d99c9dd7?w=1440&q=80",
    tarjetaTelefono: {
      titulo: "Teléfono Central",
      extensiones: [
        { ext: "100", dept: "Recepción / Asistente General", primary: true },
        { ext: "140", dept: "Secretaría Colegio", primary: false },
        { ext: "150", dept: "Secretaría Escuela", primary: false },
        { ext: "260", dept: "Secretaría IB", primary: false },
        { ext: "190", dept: "Tesorería", primary: false },
        { ext: "135", dept: "Admisiones", primary: false },
        { ext: "112 / 180", dept: "Servicio al Cliente", primary: false },
      ],
    },
    tarjetaDireccion: {
      titulo: "Dirección y Horario",
      horarioLaboral: "Lunes a Viernes  ·  7:30 – 15:30",
      horarioFinde: "Sábado y Domingo  ·  Cerrado",
    },
    tarjetaEmail: {
      titulo: "Correo Electrónico",
      descripcion:
        "Para consultas sobre admisiones, matrículas y servicios institucionales. Respondemos en máximo 48 horas.",
      ctaLabel: "Enviar correo",
      ctaHref: "",
    },
  },
  formulario: {
    eyebrow: "Escríbenos",
    heading: "Envíanos un mensaje",
    subtitle: "Te responderemos en máximo 48 horas hábiles.",
    submitLabel: "Enviar mensaje",
    successTitle: "¡Mensaje enviado!",
    successText: "Gracias por contactarnos. Nuestro equipo te responderá pronto.",
  },
  mapa: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.913587059848!2d-78.58488182487221!3d-1.22019589876816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d380d94d5ebf2d%3A0x48c002fa0be9f24a!2sUnidad%20Educativa%20Atenas!5e0!3m2!1ses!2sec!4v1776877754704!5m2!1ses!2sec",
    badgeText: "Izamba · Ambato, Ecuador",
  },
};

export function mergeContactosPagina(
  input: Partial<ContactosPaginaConfig> | null
): ContactosPaginaConfig {
  if (!input) return CONTACTOS_PAGINA_DEFAULT;

  const def = CONTACTOS_PAGINA_DEFAULT;

  const extensiones: ExtensionContacto[] = Array.isArray(
    input.canales?.tarjetaTelefono?.extensiones
  )
    ? input.canales!.tarjetaTelefono!.extensiones
        .map((e) => ({
          ext: String(e?.ext ?? "").trim(),
          dept: String(e?.dept ?? "").trim(),
          primary: Boolean(e?.primary),
        }))
        .filter((e) => e.ext && e.dept)
    : def.canales.tarjetaTelefono.extensiones;

  return {
    hero: {
      eyebrow: input.hero?.eyebrow?.trim() || def.hero.eyebrow,
      titleLine1: input.hero?.titleLine1?.trim() || def.hero.titleLine1,
      titleLine2: input.hero?.titleLine2?.trim() || def.hero.titleLine2,
      description: input.hero?.description ?? def.hero.description,
      caption: input.hero?.caption?.trim() || def.hero.caption,
      ghostText: input.hero?.ghostText?.trim() || def.hero.ghostText,
      bgImage: input.hero?.bgImage?.trim() || def.hero.bgImage,
      tarjeta: {
        titulo: input.hero?.tarjeta?.titulo?.trim() || def.hero.tarjeta.titulo,
        subtitulo: input.hero?.tarjeta?.subtitulo?.trim() || def.hero.tarjeta.subtitulo,
      },
    },
    canales: {
      eyebrow: input.canales?.eyebrow?.trim() || def.canales.eyebrow,
      heading: input.canales?.heading?.trim() || def.canales.heading,
      bannerImagen: input.canales?.bannerImagen?.trim() || def.canales.bannerImagen,
      tarjetaTelefono: {
        titulo:
          input.canales?.tarjetaTelefono?.titulo?.trim() ||
          def.canales.tarjetaTelefono.titulo,
        extensiones:
          extensiones.length > 0 ? extensiones : def.canales.tarjetaTelefono.extensiones,
      },
      tarjetaDireccion: {
        titulo:
          input.canales?.tarjetaDireccion?.titulo?.trim() ||
          def.canales.tarjetaDireccion.titulo,
        horarioLaboral:
          input.canales?.tarjetaDireccion?.horarioLaboral?.trim() ||
          def.canales.tarjetaDireccion.horarioLaboral,
        horarioFinde:
          input.canales?.tarjetaDireccion?.horarioFinde?.trim() ||
          def.canales.tarjetaDireccion.horarioFinde,
      },
      tarjetaEmail: {
        titulo:
          input.canales?.tarjetaEmail?.titulo?.trim() ||
          def.canales.tarjetaEmail.titulo,
        descripcion:
          input.canales?.tarjetaEmail?.descripcion?.trim() ||
          def.canales.tarjetaEmail.descripcion,
        ctaLabel:
          input.canales?.tarjetaEmail?.ctaLabel?.trim() ||
          def.canales.tarjetaEmail.ctaLabel,
        ctaHref:
          input.canales?.tarjetaEmail?.ctaHref?.trim() ??
          def.canales.tarjetaEmail.ctaHref,
      },
    },
    formulario: {
      eyebrow: input.formulario?.eyebrow?.trim() || def.formulario.eyebrow,
      heading: input.formulario?.heading?.trim() || def.formulario.heading,
      subtitle: input.formulario?.subtitle?.trim() || def.formulario.subtitle,
      submitLabel: input.formulario?.submitLabel?.trim() || def.formulario.submitLabel,
      successTitle: input.formulario?.successTitle?.trim() || def.formulario.successTitle,
      successText: input.formulario?.successText?.trim() || def.formulario.successText,
    },
    mapa: {
      // Se valida el anfitrión, no solo el esquema: esto va al `src` de un
      // iframe que ocupa media pantalla. Si no es un mapa de Google, se cae al
      // del colegio en vez de incrustar una página ajena.
      embedUrl: urlDeMapa(input.mapa?.embedUrl) ?? def.mapa.embedUrl,
      badgeText: input.mapa?.badgeText?.trim() || def.mapa.badgeText,
    },
  };
}
