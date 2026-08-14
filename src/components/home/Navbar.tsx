import { getMegaMenu, type MenuCategoria } from "@/lib/cms/getMegaMenu";
import {
  getConfiguracion,
  mergeMegaMenu,
  mergeContacto,
  mergeNavbar,
  type MegaMenuConfig,
  type Contacto,
  type NavbarConfig,
} from "@/lib/cms/getConfiguracion";
import { NavbarClient } from "./NavbarClient";

/**
 * Estructura fallback del mega-menú — replica el contenido hardcoded original
 * para los casos en que la BD esté vacía o falle (entornos sin migración 032
 * aplicada, fallos de red, etc.). Los IDs son strings estables (no UUIDs) que
 * no chocan con los reales.
 */
const FALLBACK_MENU: MenuCategoria[] = [
  {
    id: "fb-quienes-somos",
    label: "Quiénes Somos",
    href: null,
    badge: null,
    items: [
      { id: "fb-historia",         label: "Historia & 50 Años",      href: "/el-atenas/historia",           external: false, badge: null },
      { id: "fb-mision",           label: "Misión",                  href: "/el-atenas/mision",             external: false, badge: null },
      { id: "fb-vision",           label: "Visión",                  href: "/el-atenas/vision",             external: false, badge: null },
      { id: "fb-valores",          label: "Valores Institucionales", href: "/el-atenas/valores",            external: false, badge: null },
      { id: "fb-pol-calidad",      label: "Política de Calidad",     href: "/politicas/calidad",            external: false, badge: null },
      { id: "fb-pol-seguridad",    label: "Política de Seguridad",   href: "/politicas/seguridad",          external: false, badge: null },
      { id: "fb-directiva-ppff",   label: "Directiva de PPFF",       href: "/el-atenas/directiva-ppff",     external: false, badge: null },
      { id: "fb-directorio-fcea",  label: "Directorio FCEA",         href: "/el-atenas/directorio-fcea",    external: false, badge: null },
    ],
  },
  {
    id: "fb-espacios",
    label: "Espacios de Desarrollo",
    href: null,
    badge: null,
    items: [
      { id: "fb-vase",         label: "Proyecto VASE",     href: "/espacios/vase",             external: false, badge: null },
      { id: "fb-cas",          label: "Proyecto CAS",      href: "/espacios/cas",              external: false, badge: null },
      { id: "fb-idioma",       label: "Idioma Extranjero", href: "/espacios/idioma",           external: false, badge: null },
      { id: "fb-cultura",      label: "Cultura Estética",  href: "/espacios/cultura",          external: false, badge: null },
      { id: "fb-edu-fisica",   label: "Educación Física",  href: "/espacios/educacion-fisica", external: false, badge: null },
      { id: "fb-intercambio",  label: "Intercambio",       href: "/espacios/intercambio",      external: false, badge: null },
      { id: "fb-extracurriculares", label: "Extracurriculares", href: "/espacios/extracurriculares", external: false, badge: null },
    ],
  },
  {
    id: "fb-reconocimientos",
    label: "Reconocimientos",
    href: null,
    badge: null,
    items: [
      { id: "fb-deportivos", label: "Logros Deportivos", href: "/reconocimientos/deportivos", external: false, badge: null },
      { id: "fb-academicos", label: "Logros Académicos", href: "/reconocimientos/academicos", external: false, badge: null },
    ],
  },
  {
    id: "fb-academico",
    label: "Académico",
    href: null,
    badge: null,
    items: [
      { id: "fb-acad-inicial", label: "Educación Inicial",               href: "/academico/niveles/inicial",             external: false, badge: null },
      { id: "fb-acad-egbem",   label: "EGB Elemental y Media",           href: "/academico/niveles/egb-elemental-media", external: false, badge: null },
      { id: "fb-acad-egbs",    label: "EGB Superior",                    href: "/academico/niveles/egb-superior",        external: false, badge: null },
      { id: "fb-acad-ib",      label: "Bachillerato Internacional (IB)", href: "/academico/ib",                          external: false, badge: null },
    ],
  },
  {
    id: "fb-admisiones",
    label: "Admisiones",
    href: null,
    badge: null,
    items: [
      { id: "fb-adm-inicial", label: "Educación Inicial",     href: "/admisiones/inicial",             external: false, badge: null },
      { id: "fb-adm-egbem",   label: "EGB Elemental y Media", href: "/admisiones/egb-elemental-media", external: false, badge: null },
      { id: "fb-adm-egbs",    label: "EGB Superior",          href: "/admisiones/egb-superior",        external: false, badge: null },
      { id: "fb-adm-ib",      label: "Bachillerato IB",       href: "/admisiones/ib",                  external: false, badge: null },
      { id: "fb-adm-visita",  label: "Agenda una visita",     href: "/admisiones#visita",              external: false, badge: null },
    ],
  },
  {
    id: "fb-matriculas",
    label: "Matrículas",
    href: null,
    badge: null,
    items: [
      { id: "fb-mat-proceso", label: "Proceso de Matrícula",     href: "/matriculas/proceso",        external: false, badge: null },
      { id: "fb-mat-valores", label: "Valores Referenciales",    href: "/matriculas/valores",        external: false, badge: null },
      { id: "fb-mat-auto",    label: "Autorizaciones bancarias", href: "/matriculas/autorizaciones", external: false, badge: null },
    ],
  },
  {
    id: "fb-documentos",
    label: "Documentos Institucionales",
    href: null,
    badge: null,
    items: [
      { id: "fb-doc-todos", label: "Ver todos los documentos →", href: "/documentos-institucionales", external: false, badge: null },
    ],
  },
  {
    id: "fb-servicios",
    label: "Servicios",
    href: null,
    badge: null,
    items: [
      { id: "fb-srv-bar",       label: "Bar / Cafetería",       href: "/servicios/bar-cafeteria",      external: false, badge: null },
      { id: "fb-srv-biblio",    label: "Biblioteca",            href: "/servicios/biblioteca",         external: false, badge: null },
      { id: "fb-srv-transp",    label: "Transporte",            href: "/servicios/transporte",         external: false, badge: null },
      { id: "fb-srv-med",       label: "Dispensario Médico",    href: "/servicios/dispensario-medico", external: false, badge: null },
      { id: "fb-srv-llave",     label: "Llave del Aprendizaje", href: "/servicios/llave-aprendizaje",  external: false, badge: null },
      { id: "fb-srv-becas",     label: "Becas",                 href: "/servicios/becas",              external: false, badge: null },
      { id: "fb-srv-seguro",    label: "Seguro Estudiantil",    href: "/servicios/seguro-estudiantil", external: false, badge: null },
      { id: "fb-srv-quejas",    label: "Quejas y Sugerencias",  href: "/servicios/quejas-sugerencias", external: false, badge: null },
    ],
  },
  {
    id: "fb-plataformas",
    label: "Nuestras Plataformas",
    href: null,
    badge: null,
    items: [
      { id: "fb-plat-aleks",  label: "Aleks",                            href: "https://latam.aleks.com/?_s=6114732018736631",                         external: true, badge: null },
      { id: "fb-plat-elibro", label: "eLibro",                           href: "https://elibro.net/es/lc/atenas/login_usuario/?next=/es/lc/atenas/inicio/", external: true, badge: null },
      { id: "fb-plat-biblio", label: "Biblioteca Virtual Institucional", href: "http://biblioteca.atenas.edu.ec:8085/librum/buea/",                    external: true, badge: null },
    ],
  },
];

/**
 * Server async wrapper que lee el mega-menú del CMS y lo pasa al cliente.
 *
 * Si la BD está vacía o falla (typical en entornos sin migración 032
 * aplicada), usa `FALLBACK_MENU` con la estructura hardcoded original.
 *
 * Editable desde `/admin/configuracion/mega-menu` (superadmin).
 */
/**
 * Construye los datos de contacto que se muestran en la franja inferior
 * del mega-menú (teléfono al lado derecho en desktop + bloque
 * "Contacto" en mobile). Se derivan del primer teléfono y email de
 * `configuracion_global['contacto']` — no se duplican.
 */
function deriveContactoDelMenu(contacto: Contacto) {
  const tel = contacto.telefonos[0];
  const email = contacto.emails[0];
  const phoneLine = tel
    ? `${tel.numero}${tel.extension ? ` ext. ${tel.extension}` : ""}`
    : "";
  const mobileContactLines: string[] = [];
  if (tel) {
    const extension = tel.extension ? ` ext. ${tel.extension}` : "";
    const label = tel.label ? ` (${tel.label})` : "";
    mobileContactLines.push(`${tel.numero}${extension}${label}`);
  }
  if (email) mobileContactLines.push(email.email);
  return { phoneLine, mobileContactLines };
}

export async function Navbar() {
  const [categoriasDB, megaMenuRaw, contactoRaw, navbarRaw] = await Promise.all([
    getMegaMenu(),
    getConfiguracion<Partial<MegaMenuConfig>>("mega_menu"),
    getConfiguracion<Partial<Contacto>>("contacto"),
    getConfiguracion<Partial<NavbarConfig>>("navbar"),
  ]);
  const categorias = categoriasDB.length > 0 ? categoriasDB : FALLBACK_MENU;
  const megaMenuCfg = mergeMegaMenu(megaMenuRaw);
  const contacto = mergeContacto(contactoRaw);
  const navbarCfg = mergeNavbar(navbarRaw);
  const contactoMenu = deriveContactoDelMenu(contacto);
  return (
    <NavbarClient
      categorias={categorias}
      megaMenuCfg={megaMenuCfg}
      navbarCfg={navbarCfg}
      phoneLine={contactoMenu.phoneLine}
      mobileContactLines={contactoMenu.mobileContactLines}
    />
  );
}
