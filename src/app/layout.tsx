import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { FloatingBoot } from "@/components/shared/FloatingBoot";
import { FloatingChatbot, getChatbotConfig, chatbotIsLive } from "@/components/chatbot/FloatingChatbot";
import { NotificacionesPublicas } from "@/components/notificaciones/NotificacionesPublicas";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  getConfiguracion,
  mergeMarca,
  mergeContacto,
  mergeIntegraciones,
  mergeSeo,
  type Marca,
  type Contacto,
  type Integraciones,
  type Seo,
} from "@/lib/cms/getConfiguracion";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/**
 * SEO defaults globales — editables desde /admin/configuracion/seo.
 * Lee `configuracion_global[seo]` con `mergeSeo()` para garantizar campos
 * completos aún si el JSONB de la BD está parcial.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seoRaw = await getConfiguracion<Partial<Seo>>("seo");
  const seo = mergeSeo(seoRaw);

  return {
    metadataBase: new URL("https://atenas.edu.ec"),
    title: {
      default: seo.titleDefault,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      locale: seo.ogLocale,
      siteName: seo.siteName,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.siteName} — Izamba, Ambato`,
        },
      ],
    },
    twitter: {
      card: seo.twitterCard,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Configuración editable desde /admin/configuracion/*.
  const [marcaRaw, contactoRaw, integracionesRaw, chatbotCfg] = await Promise.all([
    getConfiguracion<Partial<Marca>>("marca"),
    getConfiguracion<Partial<Contacto>>("contacto"),
    getConfiguracion<Partial<Integraciones>>("integraciones"),
    getChatbotConfig(),
  ]);
  const marca = mergeMarca(marcaRaw);
  const contacto = mergeContacto(contactoRaw);
  const integraciones = mergeIntegraciones(integracionesRaw);

  // Si el chatbot está activo + tiene API key configurada, reemplaza al
  // botón flotante de WhatsApp. Sino, prevalece el WhatsApp configurado
  // en /admin/configuracion/contacto.
  const chatbotLive = chatbotIsLive(chatbotCfg);

  const isPoppins = marca.tipografia.trim().toLowerCase() === "poppins";

  // Override de las CSS variables del @theme en globals.css.
  const htmlStyle = {
    "--color-navy": marca.paleta.navy,
    "--color-red": marca.paleta.rojo,
    "--color-gold": marca.paleta.dorado,
    "--color-cream": marca.paleta.offWhite,
    "--color-ink": marca.paleta.dark,
    ...(isPoppins ? {} : { "--font-sans": `"${marca.tipografia}", sans-serif` }),
  } as React.CSSProperties;

  // JSON-LD del SEO local con datos del CMS.
  const jsonLd = buildJsonLd(marca, contacto);

  // Si GTM está configurado, GTM gestiona TODOS los tags (GA4, Pixel FB, TikTok)
  // internamente. Los pixels standalone solo se inyectan cuando NO hay GTM, para
  // evitar doble disparo y doble counting de conversiones.
  const inyectaGTM = !!integraciones.gtmId;
  const inyectaGA4Standalone = !inyectaGTM && !!integraciones.ga4Id;
  const inyectaPixelFBStandalone = !inyectaGTM && !!integraciones.facebookPixel;
  const inyectaTikTokStandalone = !inyectaGTM && !!integraciones.tiktokPixel;

  return (
    <html lang="es" className={poppins.variable} style={htmlStyle}>
      <head>
        {!isPoppins && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(marca.tipografia)}:wght@300;400;500;600;700;800&display=swap`}
            rel="stylesheet"
          />
        )}

        {/* Verificaciones de propiedad */}
        {integraciones.googleVerify && (
          <meta name="google-site-verification" content={integraciones.googleVerify} />
        )}
        {integraciones.metaVerify && (
          <meta name="facebook-domain-verification" content={integraciones.metaVerify} />
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
      </head>
      <body className="min-h-full font-sans antialiased">
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NotificacionesPublicas />
        {children}
        {chatbotLive ? (
          <FloatingChatbot />
        ) : (
          <FloatingBoot
            numero={contacto.whatsapp.numero}
            mensaje={contacto.whatsapp.mensaje}
            activo={contacto.whatsapp.activo}
          />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
