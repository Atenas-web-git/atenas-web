import type { Seccion } from "../tipos";

export const NOTIFICACIONES: Seccion = {
  slug: "notificaciones",
  titulo: "Notificaciones y avisos",
  descripcion:
    "Popups de bienvenida, la campana del menú y el banner superior. Todos programables con fecha de inicio y fin.",
  icono: "Bell",
  paraQuien: "Editor de Comunicaciones · Editor Académico · Superadministrador",
  articulos: [
    {
      id: "tipos",
      titulo: "Los tres formatos de aviso",
      resumen: "Popup, campana y banner superior: cuándo usar cada uno.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Notificaciones"] },
        {
          t: "campos",
          items: [
            {
              campo: "Popup de bienvenida",
              desc: "Aparece como ventana central la primera vez que alguien entra al sitio. **Se muestra una sola vez por dispositivo.** Es el más llamativo — úsalo para lo verdaderamente importante.",
            },
            {
              campo: "Lista (campana)",
              desc: "Se acumula en el icono de campana de la barra superior. Pueden convivir varias a la vez. Ideal para avisos que no urgen pero conviene tener a mano.",
            },
            {
              campo: "Banner superior",
              desc: "Barra fija en la parte de arriba del sitio. Para anuncios urgentes y breves: suspensión de clases, cambio de horario.",
            },
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "No tengas tres avisos activos al mismo tiempo. Si todo es urgente, nada lo es — y el sitio se ve saturado.",
        },
      ],
    },
    {
      id: "crear-notificacion",
      titulo: "Crear un aviso",
      resumen: "Del formulario a la publicación, con fechas automáticas.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Entra a **Contenido › Notificaciones** y pulsa **Crear notificación**.",
            "Elige el **formato**: popup, campana o banner superior.",
            "Escribe el **título** y el **mensaje**.",
            "Si quieres que lleve a algún lado, rellena **Texto del botón (CTA)** y **URL del botón**. Si los dejas vacíos, el aviso no tendrá botón.",
            "Añade una **imagen ilustrativa** si el formato es popup.",
            "Define la **fecha y hora de inicio** (obligatoria) y la **fecha y hora de fin** (opcional).",
            "Ajusta la **prioridad**: `0` es normal; `1` o más la marca como alta y aparece destacada.",
            "Activa el interruptor **Notificación activa** y **Guarda**.",
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Las fechas hacen el trabajo por ti: el aviso **aparece y desaparece solo**. Programa el de la reunión de padres con dos semanas de anticipación y olvídate de tener que ir a apagarlo.",
        },
        {
          t: "p",
          texto:
            "Si dejas la fecha de fin vacía, el aviso se muestra **indefinidamente** mientras siga activo. Úsalo con cuidado.",
        },
      ],
    },
    {
      id: "diseno-popup",
      titulo: "Los tres diseños del popup",
      resumen: "Imagen libre, Imagen + texto y Diagonal.",
      bloques: [
        {
          t: "p",
          texto:
            "Cuando el formato es **popup**, eliges además cómo se ve:",
        },
        {
          t: "campos",
          items: [
            {
              campo: "Imagen libre",
              desc: "Se muestra una imagen cuadrada tal cual, sin texto del sistema encima. Es para arte ya diseñado. Si configuras un botón con URL, **toda la imagen** se vuelve clickeable.",
            },
            {
              campo: "Plantilla — Imagen + texto",
              desc: "Imagen cuadrada arriba y un bloque blanco abajo con título, texto y botón rojo. Limpio y legible cuando tienes una foto y un mensaje corto.",
            },
            {
              campo: "Plantilla — Diagonal",
              desc: "Fondo azul marino con franja diagonal roja, escudo del colegio, título grande y botón rojo. El más llamativo: resérvalo para anuncios destacados.",
            },
          ],
        },
      ],
    },
  ],
};

export const CRONOGRAMA: Seccion = {
  slug: "cronograma",
  titulo: "Cronograma escolar",
  descripcion:
    "Los eventos del año lectivo, sus períodos (quimestres) y los tipos de evento con su color.",
  icono: "Calendar",
  paraQuien: "Editor Académico · Editor de Comunicaciones · Superadministrador",
  articulos: [
    {
      id: "estructura",
      titulo: "Cómo se arma el cronograma",
      resumen: "Tres piezas: tipos de evento, períodos y eventos.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Cronograma escolar"] },
        {
          t: "p",
          texto:
            "El cronograma del sitio se ve en tres formatos —tarjetas, calendario y línea de tiempo— pero se alimenta de una sola fuente. Tiene tres piezas, y conviene montarlas en este orden:",
        },
        {
          t: "pasos",
          items: [
            "**Tipos de evento** — las categorías: académico, deportivo, cultural, feriado… Cada tipo tiene **nombre, color e icono**, y es lo que da color al calendario.",
            "**Períodos** — los tramos del año: primer quimestre, segundo quimestre, vacaciones. Llevan **nombre y rango de fechas**.",
            "**Eventos** — cada actividad concreta, asignada a un tipo y a un período.",
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Define primero los tipos y los períodos del año completo. Después cargar los eventos es cuestión de minutos, porque solo eliges de una lista.",
        },
      ],
    },
    {
      id: "evento",
      titulo: "Crear o editar un evento",
      resumen: "Los campos de cada evento del calendario.",
      bloques: [
        {
          t: "pasos",
          items: [
            "En **Contenido › Cronograma escolar**, pulsa **Nuevo evento**.",
            "Rellena los campos y **Guarda**.",
          ],
        },
        {
          t: "campos",
          items: [
            { campo: "Título", desc: "El nombre del evento tal como se verá en el sitio." },
            { campo: "Descripción", desc: "Detalle opcional: lugar, horario, a quién está dirigido." },
            { campo: "Fecha de inicio", desc: "Obligatoria." },
            { campo: "Fecha de fin", desc: "Solo si el evento dura varios días. Si es de un día, déjala igual a la de inicio o vacía." },
            { campo: "Tipo de evento", desc: "De la lista que definiste. Determina el color en el calendario." },
            { campo: "Período", desc: "El quimestre o tramo al que pertenece." },
            { campo: "Año lectivo", desc: "De la lista de **Configuración › Años lectivos**." },
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "La portada de la página pública del cronograma (imagen de fondo, título, subtítulo, badge y ghost text) se edita aparte, en el botón **Hero** dentro del mismo módulo.",
        },
      ],
    },
  ],
};

export const DOCUMENTOS: Seccion = {
  slug: "documentos",
  titulo: "Documentos institucionales",
  descripcion:
    "Los PDF descargables del sitio: políticas, autorizaciones y formularios, organizados por categoría.",
  icono: "FileBox",
  paraQuien: "Editor de Comunicaciones · Editor Académico · Superadministrador",
  articulos: [
    {
      id: "como-funciona",
      titulo: "Cómo funcionan los documentos",
      resumen: "Los archivos viven en Google Drive; el panel guarda el enlace.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Documentos"] },
        {
          t: "p",
          texto:
            "Los PDF **no se suben al sitio**: siguen viviendo en el **Google Drive del colegio**. El panel solo guarda el enlace y lo presenta ordenado y bonito.",
        },
        {
          t: "p",
          texto:
            "La ventaja es grande: cuando actualizas el archivo en Drive **manteniendo el mismo enlace**, el sitio muestra la versión nueva sin que nadie toque el panel.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "El archivo en Drive debe estar compartido como **«Cualquier persona con el enlace»**. Si queda restringido, el visitante verá una pantalla de «solicitar acceso» y el documento será inútil.",
        },
      ],
    },
    {
      id: "publicar-documento",
      titulo: "Publicar un documento",
      resumen: "De Drive al sitio en cinco pasos.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Sube el PDF a la carpeta del colegio en **Google Drive** y compártelo con enlace público.",
            "Copia el enlace desde Drive.",
            "En **Contenido › Documentos**, pulsa **Nuevo documento**.",
            "Pega el enlace en **URL de Google Drive**.",
            "Escribe el **título** y una **descripción** breve de qué contiene.",
            "Elige la **categoría** en la que debe aparecer.",
            "**Guarda** y comprueba en el sitio que el documento descarga bien.",
          ],
        },
        {
          t: "p",
          texto:
            "Las **categorías** se gestionan desde el botón **Categorías** del mismo módulo: se crean, se renombran y se reordenan. Las flechas **Subir / Bajar** cambian el orden en el que se muestran los documentos dentro de cada una.",
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Ponle al documento un título que un padre entienda: **«Autorización de salida pedagógica 2026»**, no `AUTORIZ_SAL_V3_FINAL.pdf`.",
        },
      ],
    },
  ],
};

export const RECONOCIMIENTOS: Seccion = {
  slug: "reconocimientos",
  titulo: "Reconocimientos",
  descripcion:
    "Los logros del colegio y de sus estudiantes, organizados en categorías, subcategorías y galerías de fotos.",
  icono: "Trophy",
  paraQuien: "Editor de Comunicaciones · Editor Académico · Superadministrador",
  articulos: [
    {
      id: "jerarquia",
      titulo: "La estructura de tres niveles",
      resumen: "Categoría → Subcategoría → Logro, y cada logro con su galería.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Reconocimientos"] },
        {
          t: "campos",
          items: [
            {
              campo: "Categoría",
              desc: "El gran bloque: Académicos, Deportivos, Profesionales… **Cada categoría es una página propia del sitio**, con su portada, su dirección y su SEO.",
            },
            {
              campo: "Subcategoría",
              desc: "La división dentro de una categoría: por disciplina, por año, por nivel. Sirve para agrupar los logros.",
            },
            {
              campo: "Logro",
              desc: "El reconocimiento concreto: título, año, descripción, foto de la tarjeta y marca de **destacado**.",
            },
            {
              campo: "Galería del logro",
              desc: "Cada logro puede tener sus propias fotos, con descripción y orden editables.",
            },
          ],
        },
      ],
    },
    {
      id: "crear-reconocimiento",
      titulo: "Cargar un reconocimiento nuevo",
      resumen: "El orden correcto para no dejar huérfano ningún logro.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Si la categoría no existe, créala primero: **Nueva categoría**, con su nombre, slug, portada y SEO.",
            "Dentro de la categoría, entra a **Subcategorías** y crea la que corresponda.",
            "Entra a **Logros** y pulsa **Nuevo logro**.",
            "Rellena **título**, **año**, **descripción**, elige la **subcategoría** y sube la **foto de la tarjeta**.",
            "Marca **Destacado** si quieres que aparezca primero.",
            "**Guarda** y, si el logro tiene más fotos, ábrelo y cárgalas en su **galería**.",
          ],
        },
        {
          t: "p",
          texto:
            "Dentro de la galería, cada foto puede reordenarse con las flechas **Mover izquierda / derecha** y llevar su propia descripción para accesibilidad.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "El campo **Visibilidad** de la categoría controla si esa página aparece o no en el sitio. Es el equivalente a despublicar una página.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Antes de publicar el nombre y la foto de un estudiante, asegúrate de contar con la **autorización de imagen** de su representante. Es responsabilidad del colegio, no del sistema.",
        },
      ],
    },
  ],
};

export const GALERIA: Seccion = {
  slug: "galeria",
  titulo: "Galería de imágenes",
  descripcion:
    "El banco de todas las fotos subidas al sitio: buscarlas, reutilizarlas, corregir su descripción y eliminarlas.",
  icono: "Image",
  paraQuien: "Editor de Comunicaciones · Editor Académico · Superadministrador",
  articulos: [
    {
      id: "que-es-galeria",
      titulo: "Qué es la Galería",
      resumen: "Todas las imágenes del sitio en un solo lugar.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Galería"] },
        {
          t: "p",
          texto:
            "Cada vez que subes una foto desde cualquier editor, esa foto queda guardada aquí. La Galería no es una página del sitio: es el **almacén** desde el que se sirven todas las imágenes.",
        },
        {
          t: "lista",
          items: [
            "**Buscar** por nombre de archivo, descripción o tipo.",
            "**Ver los datos** de cada imagen: ruta, formato, tamaño y fecha de subida.",
            "**Corregir la descripción** (el texto alternativo) sin volver a subir el archivo.",
            "**Eliminar** imágenes que ya no se usan.",
          ],
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "Antes de eliminar una imagen, asegúrate de que **ninguna página la esté usando**. Si la borras y estaba en uso, en esa página quedará un hueco. En la duda, no la borres: una imagen sin usar no hace daño.",
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Acostúmbrate a **elegir del catálogo** antes de subir. Si la foto del patio ya está en la Galería, reutilizarla evita duplicados y mantiene el sitio ligero.",
        },
      ],
    },
  ],
};
