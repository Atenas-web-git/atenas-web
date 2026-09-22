import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BotonFlotante } from "@/components/publico/BotonFlotante";
import { NotificacionesPublicas } from "@/components/notificaciones/NotificacionesPublicas";
import {
  getConfiguracion,
  mergeMarca,
  mergeContacto,
  mergeIntegraciones,
  type Marca,
  type Contacto,
  type Integraciones,
} from "@/lib/cms/getConfiguracion";
import { jsonParaScript } from "@/lib/cms/htmlSeguro";

/**
 * Layout del SITIO PÚBLICO.
 *
 * ⚠️ Aquí vive TODO lo que habla con un tercero: Google Tag Manager, GA4, los
 * pixels de Meta y TikTok, Vercel Analytics y Speed Insights, el chatbot y las
 * notificaciones. **No puede subir al layout raíz.**
 *
 * Por qué, medido el 2026-08-19: el panel colgaba del layout raíz y heredaba
 * estas etiquetas. GA4 y los pixels no mandan la URL en la cabecera `Referer`
 * —donde `Referrer-Policy` la taparía—, la mandan dentro del evento como
 * `page_location`, con la query string. Y el buscador de solicitudes vive en la
 * URL: `/admin/admisiones?q=Pérez`. Traducido: el apellido de un menor que
 * teclea secretaría viajaba a Google y a Meta. Estaba latente porque el colegio
 * todavía no ha configurado ningún pixel; se separó antes de que lo configure.
 *
 * La regla, para quien venga después: **si una etiqueta manda datos fuera, va
 * en este archivo, nunca en `app/layout.tsx`.**
 *
 * Y una segunda regla, que sostiene a la primera: **todo enlace que cruce del
 * panel al sitio público, o al revés, abre pestaña nueva.** Separar por layout
 * protege la carga completa de la página, pero `gtag`, `fbq` y `ttq` se quedan
 * vivos en `window` una vez ejecutados: si alguien navegara con un `<Link>`
 * desde una página pública hasta el panel, sin recargar, GA4 seguiría
 * escuchando el historial y mandaría la URL del panel. Hoy no ocurre —ningún
 * enlace público apunta a `/admin`, y **los trece** del panel hacia el sitio
 * llevan `target="_blank"`, comprobados uno a uno el 2026-09-22—, y por eso
 * conviene que quede escrito antes de que alguien añada el catorce.
 */

/**
 * Las verificaciones de propiedad viven aquí y no en el raíz porque Google y
 * Meta las buscan en la portada, que es pública. Así el panel no las lleva.
 */
export async function generateMetadata(): Promise<Metadata> {
  const integraciones = mergeIntegraciones(
    await getConfiguracion<Partial<Integraciones>>("integraciones")
  );

  return {
    verification: {
      ...(integraciones.googleVerify ? { google: integraciones.googleVerify } : {}),
      ...(integraciones.metaVerify
        ? { other: { "facebook-domain-verification": integraciones.metaVerify } }
        : {}),
    },
  };
}

function buildJsonLd(marca: Marca, contacto: Contacto) {
  // Tomamos el primer teléfono y email para el campo principal del schema.org;
  // los demás van en `contactPoint[]` como puntos de contacto adicionales.
  const telefonoPrincipal = contacto.telefonos[0]?.numero.replace(/[^+0-9]/g, "") ?? "";
  const emailPrincipal = contacto.emails[0]?.email ?? "";

  const contactPoints = contacto.telefonos
    .filter((t) => t.numero)
    .map((t) => ({
      "@type": "ContactPoint" as const,
      telephone: t.numero.replace(/[^+0-9]/g, ""),
      contactType: t.label,
      ...(t.extension ? { contactOption: `ext ${t.extension}` } : {}),
      availableLanguage: "Spanish",
    }));

  const sameAs = [
    contacto.redes.facebook,
    contacto.redes.instagram,
    contacto.redes.youtube,
    contacto.redes.tiktok,
    contacto.redes.x,
    contacto.redes.linkedin,
  ].filter(Boolean);

  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": "https://atenas.edu.ec/#organization",
      name: "Unidad Educativa Atenas",
      alternateName: ["Colegio Atenas", "U.E. Atenas"],
      url: "https://atenas.edu.ec",
      logo: {
        "@type": "ImageObject",
        url: "https://atenas.edu.ec/opengraph-image",
        width: 1200,
        height: 630,
      },
      image: "https://atenas.edu.ec/opengraph-image",
      description:
        "La institución referente de Ambato, Ecuador. 50 años de educación de excelencia con Bachillerato Internacional IB acreditado y certificación ISO 9001.",
      address: {
        "@type": "PostalAddress",
        streetAddress: marca.institucion.direccion || "Calle Gabriel Román s/n y Av. Pedro Vásconez",
        addressLocality: "Izamba",
        addressRegion: "Tungurahua",
        postalCode: "180103",
        addressCountry: "EC",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -1.1856,
        longitude: -78.5734,
      },
      telephone: telefonoPrincipal || "+59332854281",
      email: emailPrincipal || "admisiones@atenas.edu.ec",
      foundingDate: String(marca.institucion.anioFundacion ?? 1976),
      priceRange: "$$",
      areaServed: [
        { "@type": "City", name: "Ambato" },
        { "@type": "AdministrativeArea", name: "Tungurahua" },
        { "@type": "AdministrativeArea", name: "Ecuador" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "17:00",
        },
      ],
      contactPoint: contactPoints.length > 0 ? contactPoints : [
        {
          "@type": "ContactPoint",
          telephone: "+59332854281",
          contactType: "admissions",
          email: "admisiones@atenas.edu.ec",
          availableLanguage: "Spanish",
        },
      ],
      accreditation: [
        "International Baccalaureate Organization",
        "ISO 9001",
        "Ministerio de Educación del Ecuador",
      ],
      sameAs: sameAs.length > 0 ? sameAs : [
        "https://www.facebook.com/atenasambato",
        "https://www.instagram.com/ueatenas.ambato",
        "https://www.youtube.com/@UnidadEducativaAtenasOficial",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Niveles Educativos",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "Educación Inicial" },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Educación General Básica",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Bachillerato Internacional IB",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://atenas.edu.ec/#website",
      url: "https://atenas.edu.ec",
      name: "Unidad Educativa Atenas",
      publisher: { "@id": "https://atenas.edu.ec/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://atenas.edu.ec/admisiones?nivel={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
  };
}

export default async function LayoutPublico({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Configuración editable desde /admin/configuracion/*.
  const [marcaRaw, contactoRaw, integracionesRaw] = await Promise.all([
    getConfiguracion<Partial<Marca>>("marca"),
    getConfiguracion<Partial<Contacto>>("contacto"),
    getConfiguracion<Partial<Integraciones>>("integraciones"),
  ]);
  const marca = mergeMarca(marcaRaw);
  const contacto = mergeContacto(contactoRaw);
  const integraciones = mergeIntegraciones(integracionesRaw);

  // JSON-LD del SEO local con datos del CMS.
  const jsonLd = buildJsonLd(marca, contacto);

  // Si GTM está configurado, GTM gestiona TODOS los tags (GA4, Pixel FB, TikTok)
  // internamente. Los pixels standalone solo se inyectan cuando NO hay GTM, para
  // evitar doble disparo y doble counting de conversiones.
  const inyectaGTM = !!integraciones.gtmId;
  const inyectaGA4Standalone = !inyectaGTM && !!integraciones.ga4Id;
  const inyectaPixelFBStandalone = !inyectaGTM && !!integraciones.facebookPixel;
  const inyectaTikTokStandalone = !inyectaGTM && !!integraciones.tiktokPixel;

  // Los scripts se pintan al principio del cuerpo, no en el `<head>`: un layout
  // anidado no puede escribir en la cabecera. Funcionan igual —los tres
  // inyectan su propia etiqueta al cargarse—, pero **arrancan más tarde**, y
  // eso es un precio, no una recomendación: Google pide GTM lo más arriba
  // posible del `<head>`. Se pierden las visitas que rebotan en menos de un
  // segundo, y el día que haya que usar Consent Mode habrá que replantearlo,
  // porque exige ejecutarse antes que cualquier etiqueta. El precio se paga a
  // cambio de que el panel no las herede.
  // La tipografía del sitio la elige el colegio en Configuración › Marca. Si no
  // es Poppins —que viene servida desde el propio dominio— hay que pedírsela a
  // Google Fonts, y esa petición es de las que no puede heredar el panel.
  // `precedence` es lo que hace que React la suba al `<head>`.
  const tipografiaPropia = marca.tipografia.trim().toLowerCase() !== "poppins";

  return (
    <>
      {tipografiaPropia && (
        <link
          rel="stylesheet"
          precedence="default"
          href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(marca.tipografia)}:wght@300;400;500;600;700;800&display=swap`}
        />
      )}

      {/* Google Tag Manager (inyecta GA4 internamente si está configurado dentro de GTM) */}
      {inyectaGTM && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${integraciones.gtmId}');`,
          }}
        />
      )}

      {/* Google Analytics 4 (standalone, solo si NO hay GTM) */}
      {inyectaGA4Standalone && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${integraciones.ga4Id}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${integraciones.ga4Id}');`,
            }}
          />
        </>
      )}

      {/* Facebook Pixel — solo si NO hay GTM (con GTM se gestiona ahí) */}
      {inyectaPixelFBStandalone && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${integraciones.facebookPixel}');fbq('track','PageView');`,
          }}
        />
      )}

      {/* TikTok Pixel — solo si NO hay GTM */}
      {inyectaTikTokStandalone && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${integraciones.tiktokPixel}');ttq.page();}(window, document, 'ttq');`,
          }}
        />
      )}

      {/* GTM noscript fallback */}
      {inyectaGTM && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${integraciones.gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      {/* Facebook Pixel noscript fallback — solo si NO hay GTM */}
      {inyectaPixelFBStandalone && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${integraciones.facebookPixel}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonParaScript(jsonLd) }}
      />
      <NotificacionesPublicas />
      {children}
      <BotonFlotante />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
