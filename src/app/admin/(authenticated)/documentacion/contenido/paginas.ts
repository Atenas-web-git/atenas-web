import type { Seccion } from "../tipos";

export const EDITOR: Seccion = {
  slug: "editor",
  titulo: "Cómo funciona el editor",
  descripcion:
    "La mecánica común a todas las pantallas de edición: guardar, publicar, subir imágenes, iconos, texto enriquecido y ordenar elementos.",
  icono: "MousePointerClick",
  paraQuien: "Quien edite contenido — léela antes que nada",
  articulos: [
    {
      id: "plantillas",
      titulo: "La idea clave: plantillas",
      resumen: "Cada página usa un molde diseñado. Tú rellenas campos, el diseño se mantiene solo.",
      bloques: [
        {
          t: "p",
          texto:
            "Ninguna página se arma «a mano» arrastrando bloques. Cada página del sitio usa una **plantilla**: un molde ya diseñado con sus secciones (portada, tarjetas, galerías, pasos numerados…).",
        },
        {
          t: "p",
          texto:
            "Tú solo **rellenas los campos** de esa plantilla. El diseño, los colores, las animaciones y la versión móvil se resuelven solos. Es imposible «romper» el diseño escribiendo un texto.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "La plantilla de una página **se elige al crearla** y después no se puede cambiar libremente. Si una página necesita otra estructura, se crea nueva.",
        },
      ],
    },
    {
      id: "guardar",
      titulo: "Guardar y publicar",
      resumen: "El botón Guardar, el interruptor de publicación y cómo confirmar que el cambio se aplicó.",
      bloques: [
        {
          t: "p",
          texto:
            "En la parte de arriba de cada editor hay una barra que se queda fija mientras haces scroll. Contiene dos cosas:",
        },
        {
          t: "campos",
          items: [
            {
              campo: "Interruptor de publicación",
              desc: "Dice **Página publicada** o **Página en borrador (no visible al público)**. En borrador, la página existe en el panel pero **no se ve en el sitio**.",
            },
            {
              campo: "Botón «Guardar cambios»",
              desc: "Nada se guarda solo. Si sales de la pantalla sin pulsarlo, **pierdes lo que escribiste**.",
            },
          ],
        },
        {
          t: "pasos",
          items: [
            "Haz tus cambios.",
            "Pulsa **Guardar cambios**.",
            "Espera el aviso verde **Guardado ✓** junto al botón. Si en su lugar aparece un texto rojo, el cambio **no** se guardó: lee el mensaje.",
            "Abre la página en el sitio público y confirma que se ve como esperabas.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "El sitio público guarda copias temporales para ir rápido. Si acabas de guardar y no ves el cambio, **recarga la página** (`Ctrl + Shift + R` o `Cmd + Shift + R`) y espera unos segundos.",
        },
      ],
    },
    {
      id: "imagenes",
      titulo: "Subir y elegir imágenes",
      resumen: "Los dos caminos para poner una foto, el texto alternativo y el peso recomendado.",
      bloques: [
        {
          t: "p",
          texto: "Todo campo de imagen del panel ofrece las mismas dos opciones:",
        },
        {
          t: "campos",
          items: [
            {
              campo: "Subir imagen",
              desc: "Carga una foto desde tu computadora. Formatos aceptados: **JPG, PNG, WEBP, GIF y AVIF**. Peso máximo: **10 MB**.",
            },
            {
              campo: "Elegir del catálogo",
              desc: "Reutiliza una foto ya subida antes. Evita duplicados y es más rápido. Todas las imágenes subidas quedan en **Contenido › Galería**.",
            },
          ],
        },
        { t: "sub", texto: "El texto alternativo" },
        {
          t: "p",
          texto:
            "Junto a cada imagen hay un campo de **texto alternativo** (a veces abreviado «alt»). Describe brevemente lo que se ve en la foto: *«Estudiantes de bachillerato en el laboratorio de química»*.",
        },
        {
          t: "lista",
          items: [
            "Lo lee Google para entender la imagen — ayuda al posicionamiento.",
            "Lo lee el software de personas con discapacidad visual.",
            "Se muestra si la imagen no carga.",
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "**Sube fotos livianas.** Una foto de 8 MB directa de la cámara hace lento el sitio en celulares. Redúcela antes de subirla; entre 200 KB y 500 KB es suficiente para casi todo.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Algunas secciones aceptan **video** en vez de imagen (MP4 o WEBM, máximo **15 MB**). Los videos grandes del sitio, como el del Inicio y el de Historia, no se suben: se enlazan desde **YouTube** pegando la dirección del video.",
        },
      ],
    },
    {
      id: "controles",
      titulo: "Controles que se repiten",
      resumen: "Iconos, texto enriquecido, subrayado rojo, ghost text, orden de elementos y campos opcionales.",
      bloques: [
        {
          t: "campos",
          items: [
            {
              campo: "Selector de iconos",
              desc: "Algunas tarjetas llevan un icono. Se elige de una lista buscando por nombre; hay cientos disponibles.",
            },
            {
              campo: "Editor de texto enriquecido",
              desc: "En los campos largos (políticas, cuerpos de correo) hay una barra con **negrita**, listas, títulos y enlaces. Funciona como un procesador de texto.",
            },
            {
              campo: "Subrayado rojo",
              desc: "Resalta una palabra del título con el trazo rojo institucional. **Escribe la palabra exactamente igual a como aparece en el título**, con las mismas tildes y mayúsculas. Si no coincide, no se resalta nada.",
            },
            {
              campo: "Ghost text",
              desc: "El texto grande y semitransparente que se ve de fondo en algunas portadas. Es decorativo: usa una o dos palabras, no una frase.",
            },
            {
              campo: "Flechas Subir / Bajar",
              desc: "Cambian el orden en el que aparecen las tarjetas, los pasos o los documentos en el sitio público.",
            },
            {
              campo: "Campos marcados «(opcional)»",
              desc: "Si los dejas vacíos, ese elemento simplemente **no aparece** en el sitio. Es la forma de ocultar un botón o una imagen sin borrar nada.",
            },
            {
              campo: "Título interno",
              desc: "El nombre con el que identificas la página **dentro del panel**. No se ve en el sitio público.",
            },
          ],
        },
      ],
    },
    {
      id: "seo-pagina",
      titulo: "El bloque SEO de cada página",
      resumen: "Meta title y meta description: lo que Google y WhatsApp muestran de tu página.",
      bloques: [
        {
          t: "p",
          texto:
            "Al final de casi todos los editores hay una tarjeta llamada **SEO**. Controla cómo se ve la página cuando alguien la busca en Google o comparte el enlace por WhatsApp.",
        },
        {
          t: "campos",
          items: [
            {
              campo: "Meta title",
              desc: "El título azul del resultado de Google y el texto de la pestaña del navegador. Ideal: **entre 50 y 60 caracteres**.",
            },
            {
              campo: "Meta description",
              desc: "El resumen de una o dos líneas bajo el título en Google. Ideal: **entre 140 y 160 caracteres**.",
            },
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Si los dejas vacíos, la página usa los valores generales del sitio (los de **Configuración › SEO defaults**). Rellenarlos página por página posiciona mejor: escribe pensando en lo que buscaría un padre de familia.",
        },
      ],
    },
  ],
};

export const PAGINAS: Seccion = {
  slug: "paginas",
  titulo: "Páginas del sitio",
  descripcion:
    "Editar cualquier página del sitio público, crear páginas nuevas y el catálogo completo de plantillas disponibles.",
  icono: "FileText",
  paraQuien:
    "Editor de Comunicaciones · Editor Académico · Superadministrador · Talento Humano (solo «Trabaja con nosotros»)",
  articulos: [
    {
      id: "listado",
      titulo: "Encontrar la página que quieres editar",
      resumen: "El listado agrupa las páginas por sección y tiene buscador.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Páginas"] },
        {
          t: "pasos",
          items: [
            "Entra a **Contenido** en el menú lateral y luego a **Páginas**.",
            "Las páginas están **agrupadas por sección** del sitio (El Atenas, Académico, Admisiones, Matrículas…). Haz clic en el nombre del grupo para desplegarlo.",
            "Si no la encuentras, escribe en el buscador de arriba: filtra **por título o por ruta** y expande los grupos automáticamente.",
            "Haz clic en la página para abrir su editor.",
          ],
        },
        {
          t: "p",
          texto:
            "Cada fila muestra si la página está **publicada** o en **borrador**, y tiene un atajo para **ver la página pública** en una pestaña nueva.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Las páginas de **Reconocimientos** aparecen marcadas como gestionadas desde su propio módulo: se editan en **Contenido › Reconocimientos**, no desde aquí.",
        },
      ],
    },
    {
      id: "editar",
      titulo: "Editar una página",
      resumen: "El flujo completo: abrir, cambiar, guardar, revisar.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Abre la página desde **Contenido › Páginas**.",
            "Verás la página dividida en **tarjetas**, una por cada sección visible del sitio (portada, texto, tarjetas, galería…).",
            "Cambia el texto, la foto o el enlace que necesites. Los campos vacíos y opcionales simplemente no se muestran en el sitio.",
            "Revisa el bloque **SEO** al final si el título de la página cambió mucho.",
            "Pulsa **Guardar cambios** y espera el **Guardado ✓**.",
            "Abre la página en el sitio público y confírmalo con tus propios ojos.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "El campo **Slug (URL)** no se puede editar. Es la dirección de la página y cambiarla rompería los enlaces que ya circulan y lo que Google tiene indexado. Si de verdad hace falta otra dirección, se crea una página nueva.",
        },
      ],
    },
    {
      id: "crear",
      titulo: "Crear una página nueva",
      resumen: "Elegir plantilla, definir el slug y publicar.",
      bloques: [
        {
          t: "pasos",
          items: [
            "En **Contenido › Páginas**, pulsa **Crear página**.",
            "Elige la **plantilla**: es el molde que define qué secciones tendrá. Consulta el catálogo más abajo antes de decidir.",
            "Escribe el **título interno** (para ubicarla en el panel) y el **slug**, que es su dirección: por ejemplo `el-atenas/pastoral` produce `…/el-atenas/pastoral`.",
            "Guarda. La página nace **en borrador**: existe pero nadie la ve.",
            "Rellena todas las secciones con el contenido real.",
            "Cuando esté lista, activa el interruptor **Página publicada** y guarda otra vez.",
            "Si quieres que se llegue a ella desde el menú, añádela en **Configuración › Mega-menú** (esto lo hace el Superadministrador).",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Reglas del slug: **solo minúsculas, números y guiones**. Sin espacios, sin tildes, sin `ñ`. `admisiones-2027` sí; `Admisiones 2027` no.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "No todas las plantillas están disponibles para páginas nuevas. Las que están hechas a medida de una ruta concreta —la landing de Admisiones, las cuatro páginas de admisión por nivel, la de Contactos y el Inicio— están **bloqueadas**: solo sirven para su página original.",
        },
      ],
    },
    {
      id: "eliminar",
      titulo: "Despublicar o eliminar una página",
      resumen: "Por qué despublicar es casi siempre la respuesta correcta.",
      bloques: [
        { t: "sub", texto: "Despublicar (reversible)" },
        {
          t: "pasos",
          items: [
            "Abre la página.",
            "Desactiva el interruptor de arriba: pasará a **Página en borrador (no visible al público)**.",
            "Guarda. La página desaparece del sitio pero conserva todo su contenido.",
          ],
        },
        { t: "sub", texto: "Eliminar (definitivo)" },
        {
          t: "p",
          texto:
            "Solo el **Superadministrador** ve el bloque **Zona peligrosa** al final del editor. Eliminar borra el registro y la dirección pública **deja de funcionar inmediatamente**. Quien llegue por un enlace antiguo verá un error.",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "No hay papelera ni deshacer. Si dudas aunque sea un poco, **despublica** y consulta antes de borrar.",
        },
      ],
    },
    {
      id: "catalogo",
      titulo: "Catálogo de plantillas",
      resumen: "Las 19 plantillas del sistema y para qué sirve cada una.",
      bloques: [
        {
          t: "p",
          texto:
            "Estas son todas las plantillas disponibles. La columna **Se usa en** te dice qué páginas del sitio actual la utilizan: la mejor manera de decidir es abrir una de esas páginas y ver cómo queda.",
        },
        { t: "sub", texto: "Texto institucional" },
        {
          t: "tabla",
          encabezados: ["Plantilla", "Qué trae", "Se usa en"],
          filas: [
            [
              "A · Hero + texto institucional",
              "Portada con título y subtítulo, y debajo una sección de párrafos con nota destacada opcional.",
              "Misión, Visión",
            ],
            [
              "B · Hero + lista de tarjetas",
              "Portada y una cuadrícula de tarjetas con icono, título y descripción. Cada tarjeta puede llevar enlace, color y marca de destacada.",
              "Valores, Servicios, Espacios",
            ],
            [
              "R · Grid de personas",
              "Portada y una cuadrícula de personas: cargo, nombre, foto y correo opcionales, más período y nota al pie. Multiuso.",
              "Directiva de Padres, Directorio FCEA",
            ],
            [
              "S · Documento de política",
              "Portada, metadatos (versión, audiencia, vigencia), secciones numeradas con texto enriquecido y tarjeta final. Multiuso para cualquier política.",
              "Políticas de clientes, proveedores, calidad y seguridad",
            ],
          ],
        },
        { t: "sub", texto: "Procesos y matrículas" },
        {
          t: "tabla",
          encabezados: ["Plantilla", "Qué trae", "Se usa en"],
          filas: [
            [
              "C · Hero + tarjetas + pasos",
              "Portada, tarjetas opcionales (por ejemplo bancos) y pasos numerados que se enumeran solos, con nota al pie.",
              "Proceso de matrículas, Autorizaciones",
            ],
            [
              "D · Hero + cifras + tabla",
              "Portada, párrafo de entrada, cifras destacadas, tabla configurable y nota final.",
              "Valores de matrícula, Documentos IB",
            ],
            [
              "O · Admisión por nivel",
              "Portada, navegación entre niveles, detalle con documentos y ficha técnica, cinco pasos del proceso y llamado grande a solicitar. **Bloqueada** a las 4 páginas de admisión.",
              "Admisiones: Inicial, EGB Elemental y Media, EGB Superior, IB",
            ],
          ],
        },
        { t: "sub", texto: "Académico" },
        {
          t: "tabla",
          encabezados: ["Plantilla", "Qué trae", "Se usa en"],
          filas: [
            [
              "F · Ficha académica",
              "Portada, franja de cifras, introducción con párrafos, chips y collage de 3 fotos, una sección oscura opcional de tarjetas o plataformas, y —en las páginas de Niveles— el bloque **«Iniciar admisión»** del final.",
              "Subpáginas de IB y de Niveles",
            ],
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "**El bloque «Iniciar admisión»** aparece al final de las tres páginas de Niveles y de la página que las resume. Lleva a la admisión de ese nivel concreto, con el nivel ya elegido en el formulario. Viene con sus textos escritos: se cambian en la tarjeta «Botón «Iniciar admisión»» del editor de la página. Ojo con una cosa: **vaciar los campos no lo esconde** —se vuelve a usar el texto de por defecto—. Para quitarlo hay que marcar la casilla «No mostrar este bloque en la página».",
        },
        { t: "sub", texto: "Landings ricas" },
        {
          t: "tabla",
          encabezados: ["Plantilla", "Qué trae", "Se usa en"],
          filas: [
            [
              "G · Landing IB",
              "Cinco bloques: portada con collage y cifras, Núcleo, Materias (6 grupos), Proceso con línea de tiempo y aliados, y Explorar.",
              "Académico › IB",
            ],
            [
              "H · Landing Niveles",
              "Cuatro bloques: portada con collage y chips, los 5 niveles educativos, metodologías y llamado final con cifras.",
              "Académico › Niveles",
            ],
            [
              "I · Historia",
              "Cinco bloques narrativos: portada, Fundación con 3 fotos, Trayectoria con video de YouTube de fondo y 6 hitos, Cifras con contador animado y cita destacada.",
              "El Atenas › Historia",
            ],
            [
              "J · Landing Matrículas",
              "Portada, tres tarjetas de acceso a las subpáginas y el proceso en cinco pasos con collage.",
              "Matrículas",
            ],
            [
              "P · Landing Admisiones",
              "Portada con cifras y collage, Proceso, Niveles, Explorar, Visita y preguntas frecuentes. **Bloqueada** a su ruta.",
              "Admisiones",
            ],
            [
              "T · Portal de accesos",
              "Portada, introducción y tarjetas con viñetas y botón, cada una con su color. Multiuso para portales.",
              "Portal Familiar",
            ],
          ],
        },
        { t: "sub", texto: "Fichas" },
        {
          t: "tabla",
          encabezados: ["Plantilla", "Qué trae", "Se usa en"],
          filas: [
            [
              "K · Ficha de servicio",
              "Portada, tres cifras con icono, collage de 3 fotos, descripción y tres pasos numerados. Icono y color editables. Lleva también **accesos a sistemas externos** —botones hacia la biblioteca virtual, la revista o el paseo virtual—, y en Biblioteca la tarjeta destacada de la Revista Atenas. En Quejas y sugerencias, además, el formulario.",
              "Bar y cafetería, Biblioteca, Transporte",
            ],
            [
              "L · Ficha de espacio",
              "Portada, detalle con etiquetas y ficha técnica de 4 filas, y sección oscura de actividades con foto de fondo.",
              "Los siete espacios de desarrollo: VASE, CAS, Idioma, Cultura, Ed. Física, Intercambio y Escuelas permanentes",
            ],
            [
              "N · Trabaja con Nosotros",
              "Portada y tarjetas de valores con foto e icono. El listado de vacantes se administra aparte, en Contenido › Vacantes.",
              "Trabaja con nosotros",
            ],
            [
              "Q · Página de Contactos",
              "Portada con tarjeta flotante, tres canales de atención, formulario de mensaje y mapa. **Bloqueada** a su ruta.",
              "Contactos",
            ],
          ],
        },
        { t: "sub", texto: "Inicio" },
        {
          t: "tabla",
          encabezados: ["Plantilla", "Qué trae", "Se usa en"],
          filas: [
            [
              "M · Home",
              "Seis bloques: portada con video de YouTube, tagline, scroll horizontal de 4 diapositivas, Trayectoria con cifras animadas, Niveles educativos y Por qué Atenas.",
              "Inicio",
            ],
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "La animación de carga del Inicio, la barra de navegación y el footer **no** se editan desde la página: son globales y viven en **Configuración**.",
        },
      ],
    },
  ],
};
