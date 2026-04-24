import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { ListaDetalle } from "@/components/matriculas/ListaDetalle";
import { FooterCTA } from "@/components/home/FooterCTA";

interface NivelConfig {
  icon: string;
  nombre: string;
  grados: string;
  ghostText: string;
  items: string[];
  nota?: string;
}

const NIVELES: Record<string, NivelConfig> = {
  inicial: {
    icon: "🌱",
    nombre: "Inicial",
    grados: "1ro y 2do Inicial",
    ghostText: "INICIAL",
    items: [
      "Mochila con ruedas mediana",
      "Lonchera térmica con sello hermético",
      "Botella de agua de 500 ml",
      "Plastilina de 12 colores",
      "Crayones gruesos x 12",
      "Marcadores lavables x 10",
      "Tijeras punta roma",
      "Goma en barra grande",
      "Folder de plástico A4",
      "Caja de témperas x 8",
      "Pinceles N° 6 y N° 10 (1 c/u)",
      "Delantal o mandil para pintura",
    ],
    nota: "Todos los materiales deben estar marcados con el nombre completo del estudiante.",
  },
  elemental: {
    icon: "📚",
    nombre: "EGB Elemental",
    grados: "1ro – 4to EGB",
    ghostText: "ELEMENTAL",
    items: [
      "Mochila escolar resistente",
      "Lonchera térmica",
      "Botella de agua 600 ml",
      "Cuadernos cuadriculados A4 x 6",
      "Cuaderno de composición 100 hojas x 4",
      "Lápices HB x 6",
      "Estuche con borrador, tajalápiz y regla 30 cm",
      "Colores de madera x 24",
      "Marcadores x 12",
      "Tijeras escolares",
      "Goma líquida 240 ml",
      "Goma en barra x 2",
      "Carpeta de cartón con elástico x 4",
      "Protectores plásticos A4 x 20",
      "Cuaderno de dibujo A4",
      "Cartulinas de colores x 10",
      "Plastilina de 12 colores",
      "Calculadora básica",
    ],
    nota: "Para 3ro y 4to EGB, incluir además un diccionario de la lengua española.",
  },
  media: {
    icon: "✏️",
    nombre: "EGB Media",
    grados: "5to – 7mo EGB",
    ghostText: "MEDIA",
    items: [
      "Mochila escolar con compartimentos",
      "Lonchera",
      "Botella de agua 750 ml",
      "Cuadernos cuadriculados A4 x 6",
      "Cuaderno de composición 200 hojas x 2",
      "Lápices HB x 4",
      "Bolígrafos azul y negro x 3 c/u",
      "Estuche completo (compás, transportador, escuadras)",
      "Regla 30 cm",
      "Colores de madera x 24",
      "Marcadores x 12",
      "Tijeras escolares",
      "Goma líquida 240 ml",
      "Carpeta archivadora A4",
      "Protectores plásticos A4 x 30",
      "Cuaderno de dibujo A4",
      "Calculadora científica",
      "Diccionario de la lengua española",
      "Diccionario de inglés-español",
      "Atlas geográfico",
    ],
  },
  superior: {
    icon: "🔬",
    nombre: "EGB Superior",
    grados: "8vo – 10mo EGB",
    ghostText: "SUPERIOR",
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
      "Goma líquida",
      "Corrector líquido",
      "Post-its x 2 paquetes",
      "Cuaderno de laboratorio A4",
      "Guantes de nitrilo (caja de 20)",
      "Lentes de seguridad transparentes",
      "Mandil blanco (para laboratorio)",
      "Botella de agua 1 litro",
    ],
    nota: "El mandil blanco para laboratorio es obligatorio a partir de 9no EGB.",
  },
  bgu: {
    icon: "🎓",
    nombre: "BGU",
    grados: "1ro – 3ro BGU",
    ghostText: "BGU",
    items: [
      "Mochila o morral",
      "Cuadernos universitarios A4 x 5",
      "Bolígrafos azul, negro y rojo x 3 c/u",
      "Resaltadores x 6 colores",
      "Calculadora financiera / científica",
      "Estuche de geometría",
      "Regla 30 cm",
      "Carpeta archivadora doble A4 x 3",
      "Protectores plásticos A4 x 100",
      "USB 16 GB mínimo",
      "Agenda o planificador",
      "Diccionario inglés-español avanzado",
      "Post-its x 3 paquetes",
      "Goma líquida y corrector",
      "Cuaderno de laboratorio",
      "Mandil blanco (obligatorio)",
      "Guantes de nitrilo (caja de 20)",
      "Lentes de seguridad",
      "Botella de agua 1 litro",
      "Carpeta portafolio transparente",
    ],
  },
  ib: {
    icon: "★",
    nombre: "IB Diploma",
    grados: "1ro – 2do IB",
    ghostText: "IB DIPLOMA",
    items: [
      "Mochila resistente",
      "Cuadernos universitarios A4 x 6 (por materia)",
      "Bolígrafos azul, negro y rojo x 4 c/u",
      "Resaltadores multicolor x 6",
      "Calculadora gráfica TI-84 o equivalente autorizado",
      "Carpeta archivadora doble A4 x 4",
      "Protectores plásticos A4 x 100",
      "USB 32 GB mínimo",
      "Agenda o planificador académico",
      "Diccionarios por idioma (según asignaturas seleccionadas)",
      "Post-its x 4 paquetes",
      "Goma y corrector",
      "Cuaderno de laboratorio (ciencias)",
      "Mandil blanco (laboratorio)",
      "Guantes de nitrilo (caja de 20)",
      "Lentes de seguridad",
      "Audífonos para uso personal en sala de cómputo",
      "Botella de agua 1 litro",
    ],
    nota: "La lista específica de textos IB por asignatura se comunica al inicio del año lectivo según la elección de materias de cada estudiante.",
  },
};

export function generateStaticParams() {
  return Object.keys(NIVELES).map((nivel) => ({ nivel }));
}

export async function generateMetadata({ params }: { params: Promise<{ nivel: string }> }): Promise<Metadata> {
  const { nivel } = await params;
  const config = NIVELES[nivel];
  if (!config) return { title: "No encontrado" };
  return {
    title: `Lista de Útiles ${config.nombre} 2026–2027 | Atenas`,
    description: `Lista completa de materiales escolares para ${config.grados} en la Unidad Educativa Atenas para el año lectivo 2026–2027.`,
  };
}

export default async function ListaNivelPage({ params }: { params: Promise<{ nivel: string }> }) {
  const { nivel } = await params;
  const config = NIVELES[nivel];
  if (!config) notFound();

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="MATRÍCULAS · LISTAS"
          title={`Útiles — ${config.nombre}`}
          subtitle={`Lista completa de materiales para ${config.grados} en el año lectivo 2026–2027.`}
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
