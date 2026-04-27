import type { MetadataRoute } from "next";

const BASE = "https://atenas.edu.ec";
const UPDATED = new Date("2026-04-27");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    url: string,
    priority: number = 0.7,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"
  ) => ({ url: `${BASE}${url}`, lastModified: UPDATED, changeFrequency, priority });

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
    page("/el-atenas/politica-calidad", 0.7),
    page("/el-atenas/politica-seguridad", 0.7),
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

    // Reconocimientos
    page("/reconocimientos/deportivos", 0.7),
    page("/reconocimientos/deportivos/basquetbol", 0.6),
    page("/reconocimientos/deportivos/atletismo", 0.6),
    page("/reconocimientos/deportivos/futbol", 0.6),
    page("/reconocimientos/deportivos/natacion", 0.6),
    page("/reconocimientos/academicos", 0.7),
    page("/reconocimientos/academicos/olimpiadas", 0.6),
    page("/reconocimientos/academicos/ib", 0.6),
    page("/reconocimientos/academicos/cambridge", 0.6),
    page("/reconocimientos/academicos/ciencia", 0.6),

    // Matrículas
    page("/matriculas/proceso", 0.8),
    page("/matriculas/valores", 0.8),
    page("/matriculas/listas", 0.7),
    page("/matriculas/listas/inicial", 0.6),
    page("/matriculas/listas/elemental", 0.6),
    page("/matriculas/listas/media", 0.6),
    page("/matriculas/listas/superior", 0.6),
    page("/matriculas/listas/bgu", 0.6),
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

    // Cronograma, Comunidad, Revista
    page("/cronograma-anual", 0.7, "weekly"),
    page("/comunidad", 0.7),
    page("/revista", 0.7, "weekly"),

    // Trabaja y Políticas
    page("/trabaja-con-nosotros", 0.7),
    page("/politicas", 0.5, "yearly"),
    page("/politicas/clientes", 0.5, "yearly"),
    page("/politicas/proveedores", 0.5, "yearly"),
  ];
}
