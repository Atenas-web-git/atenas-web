import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No hace falta anunciar con qué está hecho el sitio en cada respuesta.
  poweredByHeader: false,

  /*
    El tope de lo que puede viajar en una server action.

    **Next lo pone en 1 MB por defecto**, y las dos subidas del panel que van
    por server action —los adjuntos de una solicitud y el banco de archivos—
    prometían 5 y 10 MB en pantalla. Una cédula o una partida de nacimiento
    escaneada pasa de 1 MB sin esfuerzo: el archivo se rechazaba con un 413 y,
    como el proyecto no tiene `error.tsx`, no caía en ninguna pantalla de error.
    Quien subía no sabía por qué no se subía.

    4 MB y no más: **Vercel corta el cuerpo de la petición en 4,5 MB**, así que
    prometer 10 sería cambiar una mentira por otra. Los dos topes del servidor y
    los dos textos de pantalla se bajaron a este número.

    Las subidas que NO pasan por aquí y por eso admiten más: las imágenes y
    videos del CMS (`/api/admin/upload-*`) y los adjuntos de los formularios
    públicos, que van firmados directo a Storage.
  */
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "atenas.edu.ec",
      },
      // Supabase Storage — bucket "contenido" para imágenes del CMS
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  /*
    Cabeceras de seguridad. El proyecto no enviaba ninguna.

    Aquí y no en `src/proxy.ts` porque el proxy solo corre para `/admin/:path*`
    y el sitio público se quedaría fuera.

    ## Sobre la CSP: va la mitad que no cuesta nada

    Lo caro de una CSP en Next es el `nonce`, que hace falta para `script-src`
    y `default-src` y **obliga a renderizar dinámicas** las 117 páginas que hoy
    son estáticas: más lento para las familias y más caro de operar.

    Pero solo esas dos directivas piden nonce. Las de abajo son estáticas,
    caben aquí y no fuerzan nada. Aplazar la CSP entera por el coste de la
    mitad era dejar sin poner lo que sí sale gratis.

    Lo que queda pendiente, en su ficha: `script-src` con nonce, y `frame-src`
    —que hay que probar antes, porque puede dejar en blanco la vista previa de
    correos, que va en un `srcDoc` sin origen propio.

    Nota para el día que se haga: mientras el colegio pueda meter etiquetas
    desde GTM, un `script-src` estricto sirve de poco. GTM existe justamente
    para inyectar scripts de terceros en caliente.
  */
  async headers() {
    const comunes = [
      // El navegador respeta el Content-Type que mandamos en vez de adivinarlo.
      //
      // Alcance real: lo que sirve NUESTRO dominio. Los archivos que sube el
      // colegio al CMS —imágenes, videos, hojas de vida, adjuntos de una
      // solicitud— los sirve Supabase Storage desde `*.supabase.co`, donde
      // esta cabecera no llega: ahí manda Supabase.
      { key: "X-Content-Type-Options", value: "nosniff" },
      // Al salir hacia otro sitio se manda el origen, nunca la ruta completa:
      // una URL de `/admin` puede llevar el número de una solicitud.
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // Nada del sitio pide cámara, micrófono, pagos ni USB. Se apagan también
      // para lo que embebemos, que es de terceros.
      //
      // ⚠️ NO añadir `fullscreen=()` «por coherencia»: rompe el botón de
      // pantalla completa del mapa de /contactos y los vídeos de YouTube de
      // las plantillas I y M.
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), payment=(), usb=()",
      },
    ];

    /*
      Las directivas de CSP que NO necesitan nonce. Sin `default-src`, que es
      válido: una CSP parcial se aplica solo a lo que nombra.

      - `object-src 'none'`  — nada de Flash, applets ni `<embed>`. El sitio no
                               usa ninguno y es un sumidero clásico.
      - `base-uri 'self'`    — impide que un `<base>` inyectado redirija todas
                               las rutas relativas de la página a otro dominio.
      - `form-action 'self'` — un formulario del panel no puede postear fuera.
                               Comprobado: todos van a `/api/*` o a server
                               actions del mismo origen.
    */
    const cspSinNonce = "object-src 'none'; base-uri 'self'; form-action 'self'";

    /*
      El orden importa y no es el intuitivo: Next aplica TODAS las reglas que
      casan, y para una misma cabecera **gana la última**. Con la regla de
      `/admin` puesta primero, el comodín de abajo la pisaba y el panel salía
      con SAMEORIGIN. Comprobado en la respuesta real.
    */
    return [
      {
        source: "/:path*",
        headers: [
          ...comunes,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value: `${cspSinNonce}; frame-ancestors 'self'`,
          },
        ],
      },
      {
        // El panel no se embebe en ningún sitio, ni siquiera en el nuestro:
        // enmarcarlo es cómo se engaña a alguien para que pulse un botón que
        // no ve. Sus formularios son server actions que borran y publican.
        //
        // `frame-ancestors` es el sustituto moderno de X-Frame-Options; van
        // los dos porque no todos los navegadores en uso honran el primero.
        source: "/admin/:path*",
        headers: [
          ...comunes,
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: `${cspSinNonce}; frame-ancestors 'none'`,
          },
          // El panel no manda referrer a nadie: sus URLs llevan el número de
          // una solicitud, y no hay ni un enlace externo que lo necesite.
          { key: "Referrer-Policy", value: "no-referrer" },
          /*
            NO hay `Cache-Control` para el panel, y no por olvido. Se probó en
            los dos sitios posibles y ninguno gana: en las páginas HTML de
            `/admin`, Next impone la suya de render dinámico
            (`no-cache, must-revalidate`) por encima de esta configuración y
            también por encima de `src/proxy.ts`.

            Y ponerlo en el proxy tiene un efecto peor: sí gana en las rutas de
            API, así que le quitaba el `private` al CSV, que es justo el que
            sí importa. Cada exportación pone la suya en su propia respuesta.

            `no-cache` permite guardar y revalidar; `no-store` es no guardar.
            La diferencia queda anotada en la ficha de cabeceras.
          */
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/el-atenas/politica-calidad",
        destination: "/politicas/calidad",
        permanent: true,
      },
      {
        source: "/el-atenas/politica-seguridad",
        destination: "/politicas/seguridad",
        permanent: true,
      },
      // La subcategoría «Ciencia y Tech» vivía en una dirección que decía
      // «oratoria» — un slug mal copiado en el seed de la migración 035. Se
      // corrigió en la 072; esto evita que se rompa cualquier enlace ya
      // compartido o indexado. La segunda regla cubre sus subrutas
      // (/galeria, /logros).
      {
        source: "/reconocimientos/academicos/oratoria",
        destination: "/reconocimientos/academicos/ciencia-y-tech",
        permanent: true,
      },
      {
        source: "/reconocimientos/academicos/oratoria/:resto*",
        destination: "/reconocimientos/academicos/ciencia-y-tech/:resto*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
