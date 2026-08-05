import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
