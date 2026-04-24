import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { ListaDetalle } from "@/components/matriculas/ListaDetalle";
import { FooterCTA } from "@/components/home/FooterCTA";

interface GradoConfig {
  nombre: string;
  ghostText: string;
  subtitle: string;
  grados: string;
  icon: string;
  items: string[];
  nota?: string;
}

const GRADOS: Record<string, GradoConfig> = {
  "inicial-2-1": {
    nombre: "Inicial 2.1",
    ghostText: "INICIAL",
    subtitle: "Lista de útiles y material escolar para Inicial 2.1 — año lectivo 2026–2027.",
    grados: "1er año de Educación Inicial",
    icon: "🌱",
    items: [
      "Mochila con ruedas mediana (sin candado)",
      "Lonchera térmica con sello hermético",
      "Botella de agua 500 ml con tapa de palanca",
      "Plastilina de 12 colores (blanda)",
      "Crayones gruesos x 8",
      "Marcadores lavables punta gruesa x 8",
      "Tijeras punta roma",
      "Goma en barra mediana",
      "Folder de plástico A4 transparente",
      "Caja de témperas x 6",
      "Pincel N° 10 redondo",
      "Delantal o mandil para pintura",
    ],
    nota: "Todos los materiales deben marcarse con el nombre completo del estudiante.",
  },
  "inicial-2-2": {
    nombre: "Inicial 2.2",
    ghostText: "INICIAL",
    subtitle: "Lista de útiles y material escolar para Inicial 2.2 — año lectivo 2026–2027.",
    grados: "2do año de Educación Inicial",
    icon: "🌱",
    items: [
      "Mochila con ruedas mediana (sin candado)",
      "Lonchera térmica con sello hermético",
      "Botella de agua 500 ml con tapa de palanca",
      "Plastilina de 12 colores",
      "Crayones gruesos x 12",
      "Marcadores lavables punta gruesa x 12",
      "Marcadores delgados x 8",
      "Tijeras punta roma",
      "Goma en barra grande",
      "Carpeta de plástico A4 transparente",
      "Caja de témperas x 8",
      "Pincel N° 8 y N° 12 (1 c/u)",
      "Cuaderno espiral 50 hojas cuadriculado",
      "Lápices HB x 4",
      "Estuche escolar",
      "Delantal o mandil para pintura",
    ],
    nota: "Todos los materiales deben marcarse con el nombre completo del estudiante.",
  },
  "primer-grado": {
    nombre: "Primer grado",
    ghostText: "1ER GRADO",
    subtitle: "Lista de útiles para 1er grado de EGB — año lectivo 2026–2027.",
    grados: "1er grado EGB",
    icon: "📚",
    items: [
      "Mochila escolar resistente",
      "Lonchera térmica",
      "Botella de agua 500 ml",
      "Cuadernos cuadriculados A4 x 4",
      "Cuaderno de composición 50 hojas x 2",
      "Lápices HB x 6",
      "Estuche con borrador y tajalápiz",
      "Colores de madera x 12",
      "Marcadores lavables x 8",
      "Tijeras escolares punta redonda",
      "Goma líquida 120 ml",
      "Goma en barra",
      "Plastilina x 12 colores",
      "Cartulinas de colores x 6",
      "Carpeta plástica A4 con sujetador",
    ],
    nota: "Los cuadernos deben forrarse con plástico transparente antes del inicio de clases.",
  },
  "segundo-grado": {
    nombre: "Segundo grado",
    ghostText: "2DO GRADO",
    subtitle: "Lista de útiles para 2do grado de EGB — año lectivo 2026–2027.",
    grados: "2do grado EGB",
    icon: "📚",
    items: [
      "Mochila escolar resistente",
      "Lonchera térmica",
      "Botella de agua 600 ml",
      "Cuadernos cuadriculados A4 x 5",
      "Cuaderno de composición 50 hojas x 2",
      "Lápices HB x 6",
      "Estuche con borrador, tajalápiz y regla 20 cm",
      "Colores de madera x 24",
      "Marcadores lavables x 10",
      "Tijeras escolares punta redonda",
      "Goma líquida 240 ml",
      "Goma en barra x 2",
      "Plastilina x 12 colores",
      "Cartulinas de colores x 8",
      "Carpeta plástica A4 con sujetador",
      "Cuaderno de dibujo 50 hojas",
    ],
    nota: "Los cuadernos deben forrarse con plástico transparente antes del inicio de clases.",
  },
  "3ro-7mo": {
    nombre: "3ro a 7mo grado",
    ghostText: "3RO–7MO",
    subtitle: "Lista de útiles para 3er a 7mo grado de EGB Elemental y Media — año lectivo 2026–2027.",
    grados: "3ro – 7mo grado EGB",
    icon: "✏️",
    items: [
      "Mochila escolar con compartimentos",
      "Lonchera",
      "Botella de agua 600 ml",
      "Cuadernos cuadriculados A4 x 6",
      "Cuaderno de composición 100 hojas x 2",
      "Lápices HB x 4",
      "Bolígrafos azul y negro x 3 c/u",
      "Estuche con compás, transportador, escuadras y regla 30 cm",
      "Colores de madera x 24",
      "Marcadores x 10",
      "Tijeras escolares",
      "Goma líquida 240 ml",
      "Carpeta archivadora A4",
      "Protectores plásticos A4 x 20",
      "Cuaderno de dibujo A4",
      "Calculadora básica",
      "Diccionario de la lengua española",
      "Atlas geográfico",
    ],
    nota: "Para 6to y 7mo grado: incluir además diccionario inglés-español y calculadora científica.",
  },
  "8vo-10mo": {
    nombre: "8vo a 10mo grado",
    ghostText: "8VO–10MO",
    subtitle: "Lista de útiles para 8vo a 10mo grado de EGB Superior — año lectivo 2026–2027.",
    grados: "8vo – 10mo grado EGB",
    icon: "🔬",
    items: [
      "Mochila o morral resistente",
      "Cuadernos cuadriculados A4 x 5",
      "Cuaderno de composición 200 hojas x 3",
      "Bolígrafos azul, negro y rojo x 3 c/u",
      "Resaltadores x 4 colores",
      "Estuche de geometría completo",
      "Calculadora científica",
      "Regla 30 cm y 60 cm",
      "Carpeta archivadora doble A4 x 2",
      "Protectores plásticos A4 x 50",
      "USB 8 GB mínimo",
      "Diccionario inglés-español",
      "Diccionario de la lengua española",
      "Atlas geográfico actualizado",
      "Goma líquida y corrector",
      "Post-its x 2 paquetes",
      "Cuaderno de laboratorio A4",
      "Guantes de nitrilo (caja de 20)",
      "Lentes de seguridad transparentes",
      "Mandil blanco (laboratorio)",
      "Botella de agua 1 litro",
    ],
    nota: "El mandil blanco para laboratorio es obligatorio a partir de 9no grado.",
  },
  "ib": {
    nombre: "Bachillerato Internacional",
    ghostText: "IB DIPLOMA",
    subtitle: "Lista de útiles para el programa IB Diploma — año lectivo 2026–2027.",
    grados: "1ro y 2do año IB Diploma",
    icon: "★",
    items: [
      "Mochila resistente",
      "Cuadernos universitarios A4 x 6 (uno por materia IB)",
      "Bolígrafos azul, negro y rojo x 4 c/u",
      "Resaltadores multicolor x 6",
      "Calculadora gráfica TI-84 o equivalente autorizado por IBO",
      "Carpeta archivadora doble A4 x 4",
      "Protectores plásticos A4 x 100",
      "USB 32 GB mínimo",
      "Agenda o planificador académico",
      "Diccionarios por idioma (según asignaturas seleccionadas)",
      "Post-its x 4 paquetes",
      "Goma y corrector",
      "Cuaderno de laboratorio (ciencias IB)",
      "Mandil blanco (laboratorio)",
      "Guantes de nitrilo (caja de 20)",
      "Lentes de seguridad",
      "Audífonos para uso en sala de cómputo",
      "Botella de agua 1 litro",
    ],
    nota: "La lista de textos IB por asignatura se comunica al inicio del año lectivo según la elección de materias de cada estudiante.",
  },
};

export function generateStaticParams() {
  return Object.keys(GRADOS).map((grado) => ({ grado }));
}

export async function generateMetadata({ params }: { params: Promise<{ grado: string }> }): Promise<Metadata> {
  const { grado } = await params;
  const config = GRADOS[grado];
  if (!config) return { title: "No encontrado" };
  return {
    title: `Lista de Útiles — ${config.nombre} 2026–2027 | Atenas`,
    description: config.subtitle,
  };
}

export default async function GradoPage({ params }: { params: Promise<{ grado: string }> }) {
  const { grado } = await params;
  const config = GRADOS[grado];
  if (!config) notFound();

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="MATRÍCULAS · LISTA DE ÚTILES"
          title={config.nombre}
          subtitle={config.subtitle}
          ghostText={config.ghostText}
        />
        <NavMatriculas current="listas" />
        <ListaDetalle
          icon={config.icon}
          nombre={config.nombre}
          grados={config.grados}
          items={config.items}
          nota={config.nota}
        />
        <FooterCTA />
      </main>
    </>
  );
}
