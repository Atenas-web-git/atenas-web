import type { Articulo } from "./ArticuloCard";

export const ARTICULOS: Articulo[] = [
  {
    id: "1",
    slug: "estudiantes-atenas-puntajes-perfectos-ib-2026",
    titulo: "Estudiantes Atenas obtienen puntajes perfectos en exámenes IB 2026",
    extracto: "Seis estudiantes del Bachillerato Internacional lograron puntajes máximos, posicionando a Atenas entre las mejores instituciones IB de Ecuador.",
    categoria: "Bachillerato IB",
    fecha: "15 ene 2026",
    minLectura: 5,
    imagen: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
    destacado: true,
  },
  {
    id: "2",
    slug: "metodologias-ludicas-educacion-inicial",
    titulo: "Nuevas metodologías lúdicas transforman el aprendizaje en los primeros años",
    extracto: "El programa de educación inicial de Atenas incorpora juego simbólico, psicomotricidad y música para potenciar el desarrollo cognitivo.",
    categoria: "Educación Inicial",
    fecha: "10 ene 2026",
    minLectura: 3,
    imagen: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
  },
  {
    id: "3",
    slug: "equipo-futbol-torneo-nacional-2026",
    titulo: "Equipo de fútbol Atenas clasifica al torneo nacional intercolegiado 2026",
    extracto: "Con una racha de 8 victorias consecutivas, el equipo masculino aseguró su lugar en la fase final del campeonato nacional.",
    categoria: "Deportes",
    fecha: "8 ene 2026",
    minLectura: 4,
    imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  },
  {
    id: "4",
    slug: "festival-arte-2026",
    titulo: "Festival de Arte Atenas reúne a 400 estudiantes en una exhibición memorable",
    extracto: "Pintura, escultura, danza y teatro se fusionaron en una celebración del talento creativo de la comunidad Atenas.",
    categoria: "Cultura",
    fecha: "5 ene 2026",
    minLectura: 3,
    imagen: "https://images.unsplash.com/photo-1560523159-4a9692d222ef?w=600&q=80",
  },
  {
    id: "5",
    slug: "feria-ciencias-2026",
    titulo: "Feria de ciencias 2026: proyectos que sorprendieron a los jueces",
    extracto: "Energía solar, biodegradables y robótica: los proyectos de secundaria demostraron que la innovación nace en las aulas.",
    categoria: "Académico",
    fecha: "3 ene 2026",
    minLectura: 4,
    imagen: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
  },
  {
    id: "6",
    slug: "programa-becas-ib-2026",
    titulo: "Programa de becas IB para estudiantes de alto rendimiento académico",
    extracto: "El colegio anuncia cinco becas completas para el Diploma IB, abiertas a estudiantes con promedio superior a 9.5.",
    categoria: "Bachillerato IB",
    fecha: "28 dic 2025",
    minLectura: 2,
    imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  },
];

export const ARTICULO_DESTACADO = ARTICULOS.find(a => a.destacado) ?? ARTICULOS[0];
export const ARTICULOS_RECIENTES = ARTICULOS.filter(a => !a.destacado).slice(0, 3);
