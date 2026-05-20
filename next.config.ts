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
    ];
  },
};

export default nextConfig;
