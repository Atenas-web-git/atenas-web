import type { MetadataRoute } from "next";
import {
  getCategoriasReconocimientos,
  getSubcategoriasReconocimientos,
} from "@/lib/cms/getReconocimientos";

const BASE = "https://atenas.edu.ec";
const UPDATED = new Date("2026-05-13");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = (
    url: string,
    priority: number = 0.7,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"
  ) => ({ url: `${BASE}${url}`, lastModified: UPDATED, changeFrequency, priority });

  // Las rutas de Reconocimientos ahora son dinámicas (categorías + subcategorías
  // viven en `reconocimientos_categorias` y `_subcategorias` desde sesión 31).
  // Las leemos de BD para que el sitemap se mantenga sincronizado. Si Supabase
  // falla, el helper retorna [] y el sitemap simplemente omite esa sección.
  let reconocimientosUrls: MetadataRoute.Sitemap = [];
  try {
    const cats = await getCategoriasReconocimientos();
    const catUrls = cats.map((c) => page(`/reconocimientos/${c.slug}`, 0.7));
    const subUrlsArrays = await Promise.all(
      cats.map(async (c) => {
        const subs = await getSubcategoriasReconocimientos(c.id);
        return subs.map((s) => page(`/reconocimientos/${c.slug}/${s.slug}`, 0.6));
      })
    );
    reconocimientosUrls = [...catUrls, ...subUrlsArrays.flat()];
  } catch {
    // Si la BD no responde, dejamos vacío el bloque de reconocimientos
    reconocimientosUrls = [];
  }

  return [
    // Home
    page("/", 1.0, "weekly"),

    // Secciones de alto tráfico
    page("/admisiones", 0.9, "monthly"),
    page("/academico/ib", 0.9, "monthly"),
    page("/contactos", 0.9, "monthly"),
    page("/matriculas", 0.9, "monthly"),

    // El Atenas
    page("/el-atenas/historia", 0.8),
    page("/el-atenas/mision", 0.8),
    page("/el-atenas/vision", 0.8),
    page("/el-atenas/valores", 0.8),
    page("/politicas", 0.7),
    page("/politicas/calidad", 0.7),
    page("/politicas/seguridad", 0.7),
    page("/politicas/clientes", 0.7),
    page("/politicas/proveedores", 0.7),
    page("/el-atenas/directiva-ppff", 0.6),
    page("/el-atenas/directorio-fcea", 0.6),

    // Académico — Niveles
    page("/academico/niveles", 0.8),
    page("/academico/niveles/inicial", 0.7),
    page("/academico/niveles/egb-elemental-media", 0.7),
    page("/academico/niveles/egb-superior", 0.7),

    // Académico — IB
    page("/academico/ib/atributos", 0.8),
    page("/academico/ib/infraestructura", 0.7),
    page("/academico/ib/documentos", 0.7),
    page("/academico/ib/escuela-padres", 0.7),
    page("/academico/ib/visitas", 0.7),
    page("/academico/ib/politicas", 0.6),
    page("/academico/ib/capacitacion", 0.7),

    // Admisiones por nivel
    page("/admisiones/inicial", 0.8),
    page("/admisiones/egb-elemental-media", 0.8),
    page("/admisiones/egb-superior", 0.8),
    page("/admisiones/ib", 0.8),

    // Espacios de Desarrollo
    page("/espacios", 0.8),
    page("/espacios/vase", 0.7),
    page("/espacios/cas", 0.7),
    page("/espacios/idioma", 0.7),
    page("/espacios/cultura", 0.7),
    page("/espacios/educacion-fisica", 0.7),
    page("/espacios/intercambio", 0.7),
    page("/espacios/extracurriculares", 0.7),

    // Reconocimientos — generadas dinámicamente desde BD
    ...reconocimientosUrls,

    // Matrículas
    page("/matriculas/proceso", 0.8),
    page("/matriculas/valores", 0.8),
    page("/matriculas/autorizaciones", 0.6),

    // Documentos y Servicios
    page("/documentos-institucionales", 0.7),
    page("/servicios", 0.7),
    page("/servicios/bar-cafeteria", 0.6),
    page("/servicios/biblioteca", 0.6),
    page("/servicios/transporte", 0.6),
    page("/servicios/dispensario-medico", 0.6),
    page("/servicios/llave-aprendizaje", 0.6),
    page("/servicios/becas", 0.7),
    page("/servicios/seguro-estudiantil", 0.6),
    page("/servicios/quejas-sugerencias", 0.6),

    // Cronograma
    page("/cronograma-anual", 0.7, "weekly"),

    // Trabaja y Políticas
    page("/trabaja-con-nosotros", 0.7),
  ];
}
