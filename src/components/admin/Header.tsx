"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { AdminUser } from "@/lib/auth/types";

/**
 * Cabecera del backoffice: dice dónde estás y cómo volver.
 *
 * ANTES (hasta el 2026-08-21) el mapa tenía 16 entradas para 64 pantallas, y
 * resolvía por prefijo de texto. El resultado no era una cabecera vacía, que
 * sería lo de menos: era una cabecera que MENTÍA. Estabas en Galería y arriba
 * ponía «Contenido — Edita las páginas, notificaciones y recursos del sitio».
 * En Formularios, lo mismo. En Vacantes, lo mismo.
 *
 * Ahora están las 64, y las rutas con :parametro se resuelven por segmentos en
 * vez de por texto, que es lo que permite distinguir /paginas/nueva (crear) de
 * /paginas/abc-123 (editar) — con prefijos de texto, «nueva» y un id cualquiera
 * eran indistinguibles.
 */

type Entrada = {
  /** Ruta con `:algo` para los segmentos dinámicos */
  patron: string;
  titulo: string;
  /** Qué se hace aquí. Se muestra bajo el título. */
  subtitulo?: string;
  /**
   * Si es `false`, el segmento aparece en las migas de pan pero SIN enlace.
   * Se usa para los tramos que agrupan rutas pero no tienen página propia:
   * enlazarlos llevaría a un 404. Verificado contra los `page.tsx` existentes.
   */
  esPagina?: boolean;
};

const MAPA: Entrada[] = [
  { patron: "/admin", titulo: "Dashboard", subtitulo: "Resumen general del backoffice" },

  // --- Admisiones ---------------------------------------------------------
  {
    patron: "/admin/admisiones",
    titulo: "Solicitudes de admisión",
    subtitulo:
      "Pipeline completo: interesados, postulantes, evaluación, comité, admitidos y matriculados",
  },
  {
    patron: "/admin/admisiones/nueva",
    titulo: "Nueva solicitud",
    subtitulo: "Registra a mano una solicitud que llegó por teléfono o en secretaría",
  },
  {
    patron: "/admin/admisiones/metricas",
    titulo: "Métricas de admisiones",
    subtitulo: "Cómo va el proceso: embudo, mes a mes, detenidos y de dónde vienen los aspirantes",
  },
  {
    patron: "/admin/admisiones/cupos",
    titulo: "Cupos por nivel",
    subtitulo: "Configura cuántos estudiantes admite cada nivel",
  },
  {
    patron: "/admin/admisiones/archivos-banco",
    titulo: "Comprobantes de pago",
    subtitulo: "Archivos que subieron las familias al registrar su solicitud",
  },
  {
    patron: "/admin/admisiones/correos",
    titulo: "Correos automáticos",
    subtitulo: "Qué se le escribe a la familia en cada paso del proceso",
  },
  {
    patron: "/admin/admisiones/correos/:estado",
    titulo: "Editar correo automático",
    subtitulo: "Asunto y cuerpo del correo que sale al llegar a este estado",
  },
  {
    patron: "/admin/admisiones/:id",
    titulo: "Ficha de la solicitud",
    subtitulo: "Datos del aspirante, documentos, estado y bitácora",
  },

  // --- Contenido ----------------------------------------------------------
  {
    patron: "/admin/contenido",
    titulo: "Contenido",
    subtitulo: "Edita las páginas, notificaciones y recursos del sitio",
  },
  {
    patron: "/admin/contenido/paginas",
    titulo: "Páginas",
    subtitulo: "Edita el contenido de cada página del sitio público",
  },
  {
    patron: "/admin/contenido/paginas/nueva",
    titulo: "Crear nueva página",
    subtitulo: "Elige plantilla, slug y datos básicos",
  },
  {
    patron: "/admin/contenido/paginas/:id",
    titulo: "Editar página",
    subtitulo: "Los cambios se publican al guardar",
  },
  {
    patron: "/admin/contenido/notificaciones",
    titulo: "Notificaciones",
    subtitulo: "Avisos, popups y banners programables para el sitio público",
  },
  {
    patron: "/admin/contenido/notificaciones/nueva",
    titulo: "Nueva notificación",
    subtitulo: "Elige el tipo, el mensaje y cuándo se muestra",
  },
  {
    patron: "/admin/contenido/notificaciones/:id",
    titulo: "Editar notificación",
    subtitulo: "Mensaje, fechas de publicación y dónde aparece",
  },
  {
    patron: "/admin/contenido/formularios",
    titulo: "Formularios",
    subtitulo: "Crea formularios y decide a qué correo llegan las respuestas",
  },
  {
    patron: "/admin/contenido/formularios/nuevo",
    titulo: "Nuevo formulario",
    subtitulo: "Ponle nombre, elige el área y añade las preguntas",
  },
  {
    patron: "/admin/contenido/formularios/:id",
    titulo: "Editar formulario",
    subtitulo: "Preguntas, destinatarios y correo de confirmación",
  },
  {
    patron: "/admin/contenido/formularios/:id/respuestas",
    titulo: "Respuestas recibidas",
    subtitulo: "Lo que ha enviado la gente por este formulario",
  },
  {
    patron: "/admin/contenido/plantillas-formularios",
    titulo: "Plantillas de formularios",
    subtitulo: "Los formularios fijos del sitio: contacto, quejas y consulta por nivel",
  },
  {
    patron: "/admin/contenido/plantillas-formularios/:tipo",
    titulo: "Editar plantilla",
    subtitulo: "Textos y destinatarios de este formulario fijo",
  },
  {
    patron: "/admin/contenido/galeria",
    titulo: "Galería de imágenes",
    subtitulo: "Todas las fotos del sitio en un solo sitio: sube, busca y reutiliza",
  },
  {
    patron: "/admin/contenido/documentos",
    titulo: "Documentos",
    subtitulo: "Circulares, reglamentos y archivos descargables del sitio",
  },
  {
    patron: "/admin/contenido/documentos/nuevo",
    titulo: "Subir documento",
    subtitulo: "Archivo, categoría y a quién va dirigido",
  },
  {
    patron: "/admin/contenido/documentos/hero",
    titulo: "Portada de Documentos",
    subtitulo: "Título e imagen de cabecera de la página pública",
  },
  {
    patron: "/admin/contenido/documentos/categorias",
    titulo: "Categorías de documentos",
    subtitulo: "Cómo se agrupan los documentos en la página pública",
  },
  {
    patron: "/admin/contenido/documentos/:id",
    titulo: "Editar documento",
    subtitulo: "Nombre, categoría y archivo",
  },
  {
    patron: "/admin/contenido/cronograma",
    titulo: "Cronograma",
    subtitulo: "Calendario escolar que se publica en el sitio",
  },
  {
    patron: "/admin/contenido/cronograma/nuevo",
    titulo: "Nuevo evento",
    subtitulo: "Fecha, tipo y período al que pertenece",
  },
  {
    patron: "/admin/contenido/cronograma/hero",
    titulo: "Portada del Cronograma",
    subtitulo: "Título e imagen de cabecera de la página pública",
  },
  {
    patron: "/admin/contenido/cronograma/periodos",
    titulo: "Períodos del cronograma",
    subtitulo: "Quimestres y parciales en los que se agrupan los eventos",
  },
  {
    patron: "/admin/contenido/cronograma/tipos",
    titulo: "Tipos de evento",
    subtitulo: "Las etiquetas de color con las que se clasifica cada fecha",
  },
  {
    patron: "/admin/contenido/cronograma/:id",
    titulo: "Editar evento",
    subtitulo: "Fecha, tipo y período",
  },
  {
    patron: "/admin/contenido/vacantes",
    titulo: "Vacantes",
    subtitulo: "Las plazas abiertas que se publican en «Trabaja con nosotros»",
  },
  {
    patron: "/admin/contenido/vacantes/nueva",
    titulo: "Nueva vacante",
    subtitulo: "Puesto, requisitos y hasta cuándo se recibe",
  },
  {
    patron: "/admin/contenido/vacantes/:id",
    titulo: "Editar vacante",
    subtitulo: "Al despublicarla desaparece del sitio, pero no se borra",
  },
  {
    patron: "/admin/contenido/reconocimientos",
    titulo: "Reconocimientos",
    subtitulo: "Logros y distinciones del colegio, agrupados por categoría",
  },
  {
    patron: "/admin/contenido/reconocimientos/nueva",
    titulo: "Nueva categoría",
    subtitulo: "Cómo se agrupan los reconocimientos en la página pública",
  },
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId",
    titulo: "Categoría de reconocimientos",
    subtitulo: "Sus subcategorías y sus logros",
  },
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId/editar",
    titulo: "Editar categoría",
    subtitulo: "Nombre, descripción e imagen",
  },
  // `/logros` y `/subcategorias` agrupan rutas pero no tienen página propia.
  // Aparecen en las migas sin enlace: llevarían a un 404.
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId/logros",
    titulo: "Logros",
    esPagina: false,
  },
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId/logros/nuevo",
    titulo: "Nuevo logro",
    subtitulo: "Título, año y descripción del reconocimiento",
  },
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId/logros/:logroId",
    titulo: "Editar logro",
    subtitulo: "Título, año y descripción del reconocimiento",
  },
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId/subcategorias",
    titulo: "Subcategorías",
    esPagina: false,
  },
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId/subcategorias/nueva",
    titulo: "Nueva subcategoría",
    subtitulo: "Un grupo dentro de esta categoría",
  },
  {
    patron: "/admin/contenido/reconocimientos/:categoriaId/subcategorias/:subcategoriaId",
    titulo: "Editar subcategoría",
    subtitulo: "Nombre y orden dentro de la categoría",
  },

  // --- Usuarios -----------------------------------------------------------
  {
    patron: "/admin/usuarios",
    titulo: "Usuarios",
    subtitulo: "Gestiona quién accede al backoffice y con qué rol",
  },
  {
    patron: "/admin/usuarios/nuevo",
    titulo: "Crear nuevo usuario",
    subtitulo: "Solo el superadministrador puede crear cuentas",
  },
  {
    patron: "/admin/usuarios/:userId",
    titulo: "Editar usuario",
    subtitulo: "Nombre, correo y roles de esta cuenta",
  },

  // --- Configuración ------------------------------------------------------
  {
    patron: "/admin/configuracion",
    titulo: "Configuración",
    subtitulo: "Ajustes globales del sitio y del backoffice",
  },
  {
    patron: "/admin/configuracion/marca",
    titulo: "Marca",
    subtitulo: "Nombre, logo y lema que se muestran en todo el sitio",
  },
  {
    patron: "/admin/configuracion/contacto",
    titulo: "Datos de contacto",
    subtitulo: "Teléfonos, correo, dirección y mapa. Salen en el pie y en Contacto",
  },
  {
    patron: "/admin/configuracion/navbar",
    titulo: "Barra superior",
    subtitulo: "Lo que se ve arriba del todo en el sitio público",
  },
  {
    patron: "/admin/configuracion/mega-menu",
    titulo: "Menú principal",
    subtitulo: "Las categorías y enlaces del menú desplegable del sitio",
  },
  {
    patron: "/admin/configuracion/footer",
    titulo: "Pie de página",
    subtitulo: "Columnas de enlaces, redes sociales y aviso legal",
  },
  {
    patron: "/admin/configuracion/seo",
    titulo: "SEO",
    subtitulo: "Título, descripción e imagen con que el sitio aparece en Google y al compartirlo",
  },
  {
    patron: "/admin/configuracion/correos",
    titulo: "Envío de correos",
    subtitulo: "Servidor de salida y direcciones desde las que escribe la plataforma",
  },
  {
    patron: "/admin/configuracion/correos-diseno",
    titulo: "Diseño de los correos",
    subtitulo: "Cabecera, colores y pie con los que salen todos los correos",
  },
  {
    patron: "/admin/configuracion/chatbot",
    titulo: "Chatbot",
    subtitulo: "Respuestas del asistente que atiende en el sitio público",
  },
  {
    patron: "/admin/configuracion/integraciones",
    titulo: "Integraciones",
    subtitulo: "WhatsApp, analítica y otros servicios conectados al sitio",
  },
  {
    patron: "/admin/configuracion/anos-lectivos",
    titulo: "Años lectivos",
    subtitulo: "Catálogo editable de años lectivos del colegio",
  },
  {
    patron: "/admin/configuracion/documentos-admision",
    titulo: "Documentos de admisión",
    subtitulo: "Catálogo de documentos físicos a marcar en cada solicitud",
  },
  {
    patron: "/admin/configuracion/fechas-matriculas",
    titulo: "Fechas de matrículas",
    subtitulo: "Banner global con año lectivo, etapas y CTA para todas las páginas de matrículas",
  },
  {
    patron: "/admin/configuracion/admisiones-textos",
    titulo: "Textos de admisiones",
    subtitulo: "Lo que lee la familia en el formulario público y en los avisos del proceso",
  },

  // --- Documentación ------------------------------------------------------
  {
    patron: "/admin/documentacion",
    titulo: "Documentación",
    subtitulo: "Manual de uso del panel: cómo se hace cada cosa, paso a paso",
  },
  {
    patron: "/admin/documentacion/:slug",
    titulo: "Documentación",
    subtitulo: "Manual de uso del panel",
  },
];

/**
 * Compara una ruta real con un patrón, segmento a segmento.
 *
 * Devuelve la puntuación (más alta = más específico) o `null` si no encaja.
 * Un segmento literal puntúa más que uno dinámico, y por eso `/paginas/nueva`
 * le gana a `/paginas/:id` cuando la ruta es exactamente `/paginas/nueva`.
 */
function puntuar(segmentosRuta: string[], patron: string): number | null {
  const segmentosPatron = patron.split("/").filter(Boolean);
  if (segmentosPatron.length !== segmentosRuta.length) return null;

  let puntos = 0;
  for (let i = 0; i < segmentosPatron.length; i++) {
    const p = segmentosPatron[i];
    if (p.startsWith(":")) {
      puntos += 1;
    } else if (p === segmentosRuta[i]) {
      puntos += 2;
    } else {
      return null;
    }
  }
  return puntos;
}

function buscarEntrada(ruta: string): Entrada | null {
  const segmentos = ruta.split("/").filter(Boolean);
  let mejor: Entrada | null = null;
  let mejorPuntos = -1;

  for (const entrada of MAPA) {
    const puntos = puntuar(segmentos, entrada.patron);
    if (puntos !== null && puntos > mejorPuntos) {
      mejor = entrada;
      mejorPuntos = puntos;
    }
  }
  return mejor;
}

type Miga = { etiqueta: string; href: string | null };

/**
 * Construye las migas de pan recorriendo los prefijos de la ruta.
 *
 * El panel llega a seis niveles de profundidad —Contenido › Reconocimientos ›
 * una categoría › Subcategorías › una subcategoría— y hasta ahora la única
 * forma de saber dónde estabas era mirar la barra de direcciones del navegador.
 *
 * Se omiten el primer nivel (Dashboard, que ya es el icono de inicio) y el
 * último (que es el título grande justo debajo: repetirlo es ruido).
 */
function construirMigas(ruta: string): Miga[] {
  const segmentos = ruta.split("/").filter(Boolean); // ["admin", "contenido", ...]
  const migas: Miga[] = [];

  // Empieza en 2 para saltarse "/admin" a secas, y termina antes del último
  // segmento porque ese ya se muestra como título de la pantalla.
  for (let i = 2; i < segmentos.length; i++) {
    const prefijo = "/" + segmentos.slice(0, i).join("/");
    const entrada = buscarEntrada(prefijo);
    if (!entrada) continue;
    migas.push({
      etiqueta: entrada.titulo,
      href: entrada.esPagina === false ? null : prefijo,
    });
  }
  return migas;
}

export function Header({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const entrada = buscarEntrada(pathname);
  const titulo = entrada?.titulo ?? "Backoffice";
  const subtitulo = entrada?.subtitulo ?? "";
  const migas = construirMigas(pathname);

  const firstName = user.fullName.split(/\s+/)[0] || user.email;
  const esDashboard = pathname === "/admin";

  return (
    <header
      className="flex items-center justify-between px-8 flex-shrink-0"
      style={{
        // Con migas la cabecera necesita algo más de aire; sin ellas se queda
        // como estaba para no mover el resto de pantallas.
        minHeight: 64,
        paddingTop: migas.length > 0 ? 10 : 0,
        paddingBottom: migas.length > 0 ? 10 : 0,
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E4DD",
      }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        {migas.length > 0 && (
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1 flex-wrap"
            style={{ marginBottom: 2 }}
          >
            <Link
              href="/admin"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#6B6660",
                textDecoration: "none",
              }}
            >
              Inicio
            </Link>
            {migas.map((miga) => (
              <span key={miga.etiqueta} className="flex items-center gap-1">
                {/* Separador puramente decorativo: el orden ya lo dice el espaciado.
                    Va oculto a los lectores de pantalla y en un gris que se ve
                    (3.66:1), no en el gris claro de antes. */}
                <ChevronRight size={12} color="#8A857E" aria-hidden="true" />
                {miga.href ? (
                  <Link
                    href={miga.href}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#6B6660",
                      textDecoration: "none",
                    }}
                  >
                    {miga.etiqueta}
                  </Link>
                ) : (
                  /* Mismo color que las demás, a propósito. Lo que distingue a un
                     tramo sin página propia es que no responde al ratón, no que
                     esté más claro: #A0AABA sobre blanco da 2.35:1 y a 11px eso
                     no se lee. */
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#6B6660" }}>
                    {miga.etiqueta}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1A2B4A",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {titulo}
        </h1>
        <p
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "#6B6660",
            margin: 0,
          }}
        >
          {esDashboard ? `Hola ${firstName}, esto es lo que pasa hoy.` : subtitulo}
        </p>
      </div>
    </header>
  );
}
