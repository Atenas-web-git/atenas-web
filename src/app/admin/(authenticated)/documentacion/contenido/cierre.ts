import type { Seccion } from "../tipos";

export const PRACTICAS: Seccion = {
  slug: "buenas-practicas",
  titulo: "Buenas prácticas",
  descripcion:
    "Las reglas que evitan el 90 % de los problemas, y lo que el panel no puede hacer.",
  icono: "CheckCircle2",
  paraQuien: "Todo el equipo",
  articulos: [
    {
      id: "reglas",
      titulo: "Las siete reglas",
      resumen: "Lo mínimo que hay que respetar siempre.",
      bloques: [
        {
          t: "pasos",
          items: [
            "**Guardar y verificar.** Después de cada cambio, abre el sitio público y míralo. No des por hecho que quedó bien.",
            "**Despublicar, no eliminar.** Eliminar no tiene vuelta atrás; despublicar sí.",
            "**Fotos livianas.** Reduce las imágenes antes de subirlas. Entre 200 y 500 KB basta.",
            "**Texto alternativo siempre.** Describe cada foto en una línea: ayuda a Google y a quien no puede verla.",
            "**Una cuenta por persona.** Nunca compartas credenciales.",
            "**El subrayado dorado se escribe idéntico** a la palabra del título, con sus tildes y mayúsculas.",
            "**Ante algo raro, anótalo y consúltalo.** No improvises en producción: el sitio está en vivo.",
          ],
        },
      ],
    },
    {
      id: "no-se-puede",
      titulo: "Lo que NO se hace desde el panel",
      resumen: "Para saber cuándo hay que llamar a alguien.",
      bloques: [
        {
          t: "p",
          texto:
            "El panel cubre el contenido y la operación diaria. Estas cosas quedan fuera a propósito:",
        },
        {
          t: "campos",
          items: [
            {
              campo: "Cambiar el diseño de una plantilla",
              desc: "Mover secciones de sitio, cambiar la estructura o crear una plantilla nueva es trabajo de desarrollo.",
            },
            {
              campo: "Cambiar la dirección (slug) de una página existente",
              desc: "Rompería los enlaces que ya circulan y lo indexado en Google. Se crea una página nueva.",
            },
            {
              campo: "La lógica de los formularios",
              desc: "Qué campos pide el formulario de admisión o el de empleo, y en qué orden. Los **textos** sí se editan; los campos, no.",
            },
            {
              campo: "El dominio y el DNS",
              desc: "Apuntar `atenas.edu.ec` al sitio y configurar SPF, DKIM y DMARC para que los correos no caigan en spam. Es trabajo del departamento de TI.",
            },
            {
              campo: "El tour virtual",
              desc: "Vive en su propio servicio; el sitio solo enlaza a él.",
            },
            {
              campo: "Pagos en línea",
              desc: "No forman parte de esta plataforma.",
            },
          ],
        },
      ],
    },
    {
      id: "problemas",
      titulo: "Problemas frecuentes",
      resumen: "Síntoma, causa probable y qué hacer.",
      bloques: [
        {
          t: "tabla",
          encabezados: ["Lo que pasa", "Casi siempre es", "Qué hacer"],
          filas: [
            [
              "Guardé y no veo el cambio",
              "La copia temporal del navegador",
              "Recarga forzando: `Ctrl + Shift + R` (o `Cmd + Shift + R`) y espera unos segundos.",
            ],
            [
              "La página no aparece en el sitio",
              "Está en borrador",
              "Ábrela y activa el interruptor **Página publicada**.",
            ],
            [
              "La página existe pero no está en el menú",
              "No se enlazó",
              "Añádela en **Configuración › Mega-menú**. Publicar y enlazar son dos pasos distintos.",
            ],
            [
              "La palabra no se subraya en dorado",
              "No coincide exactamente",
              "Cópiala y pégala desde el título, con sus tildes y mayúsculas.",
            ],
            [
              "La foto se ve borrosa o cortada",
              "Resolución o proporción equivocada",
              "Sube una imagen más grande y con la proporción que pide el campo.",
            ],
            [
              "El sitio va lento",
              "Imágenes muy pesadas",
              "Revisa la **Galería**, localiza las fotos grandes y súbelas otra vez optimizadas.",
            ],
            [
              "El correo no llegó",
              "Spam o configuración de envío",
              "Sigue los pasos del artículo **Si los correos no llegan** en la sección de Correos.",
            ],
            [
              "No veo una sección del menú lateral",
              "Tu rol no la incluye",
              "No es un fallo. Si necesitas ese acceso, pídeselo al Superadministrador.",
            ],
            [
              "Un documento pide permiso al abrirlo",
              "El PDF no está compartido en Drive",
              "En Google Drive, compártelo como **Cualquier persona con el enlace**.",
            ],
          ],
        },
      ],
    },
    {
      id: "rutinas",
      titulo: "Rutinas recomendadas",
      resumen: "Qué revisar cada semana, cada trimestre y cada año.",
      bloques: [
        { t: "sub", texto: "Cada semana" },
        {
          t: "lista",
          items: [
            "Revisar las solicitudes nuevas de admisión y moverlas al estado que corresponda.",
            "Apagar los avisos que ya no aplican.",
          ],
        },
        { t: "sub", texto: "Cada trimestre" },
        {
          t: "lista",
          items: [
            "Actualizar el cronograma con los eventos del período siguiente.",
            "Publicar los reconocimientos obtenidos.",
            "Revisar que los documentos descargables sigan siendo la versión vigente.",
          ],
        },
        { t: "sub", texto: "Cada año lectivo" },
        {
          t: "lista",
          items: [
            "Crear el **año lectivo** nuevo en Configuración.",
            "Configurar los **cupos** por nivel.",
            "Actualizar el **banner de fechas de matrículas**.",
            "Revisar y ajustar el **contador de números de admisión**.",
            "Revisar la lista de **usuarios** y desactivar a quien ya no está.",
            "Actualizar valores de matrícula, cuentas bancarias y textos de proceso.",
          ],
        },
      ],
    },
  ],
};

export const GLOSARIO: Seccion = {
  slug: "glosario",
  titulo: "Glosario",
  descripcion: "Las palabras del panel, explicadas sin tecnicismos.",
  icono: "BookOpen",
  paraQuien: "Todo el equipo",
  articulos: [
    {
      id: "terminos",
      titulo: "Términos que verás en el panel",
      resumen: "Slug, hero, CTA, meta, plantilla, borrador y demás.",
      bloques: [
        {
          t: "campos",
          items: [
            { campo: "Backoffice / Panel", desc: "Esta zona privada donde se administra el sitio. Vive en `/admin`." },
            { campo: "Sitio público", desc: "La página web que ve cualquier visitante." },
            { campo: "Plantilla", desc: "El molde de diseño de una página. Define qué secciones tiene y qué campos se rellenan." },
            { campo: "Slug", desc: "La dirección corta de una página. En `atenas.edu.ec/el-atenas/historia`, el slug es `el-atenas/historia`." },
            { campo: "Hero", desc: "La portada de una página: la franja grande de arriba con imagen de fondo y título." },
            { campo: "CTA", desc: "*Call to action*, llamado a la acción. El botón que invita a hacer algo: «Solicitar información»." },
            { campo: "Eyebrow", desc: "El texto pequeño que va **encima** de un título grande, a modo de antetítulo." },
            { campo: "Ghost text", desc: "Texto grande y semitransparente de fondo. Es decoración." },
            { campo: "Badge", desc: "Una etiqueta pequeña y redondeada, como el «50 AÑOS» de la barra superior." },
            { campo: "Chip", desc: "Una etiqueta compacta dentro de un texto o una lista." },
            { campo: "Collage", desc: "El grupo de fotos superpuestas que usan varias plantillas." },
            { campo: "Borrador", desc: "Estado de una página que existe en el panel pero no se ve en el sitio." },
            { campo: "Publicar / Despublicar", desc: "Hacer visible u ocultar una página, sin borrar su contenido." },
            { campo: "Meta title / Meta description", desc: "El título y el resumen que Google muestra de una página." },
            { campo: "SEO", desc: "El conjunto de ajustes que ayudan a que el sitio aparezca mejor posicionado en los buscadores." },
            { campo: "Texto alternativo (alt)", desc: "La descripción escrita de una imagen." },
            { campo: "Pipeline", desc: "La secuencia de estados por la que pasa una solicitud de admisión." },
            { campo: "Preset", desc: "Una configuración guardada de antemano. En Correos, define el remitente de cada tipo de mensaje." },
            { campo: "SMTP", desc: "El protocolo con el que un sistema envía correos usando una cuenta real." },
            { campo: "DNS", desc: "El sistema que conecta el nombre `atenas.edu.ec` con el servidor del sitio." },
            { campo: "Variable", desc: "Un código como `{{numero}}` que se reemplaza por el dato real al enviar el correo." },
          ],
        },
      ],
    },
  ],
};
