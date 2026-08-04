import type { Seccion } from "../tipos";

export const CONFIGURACION: Seccion = {
  slug: "configuracion",
  titulo: "Configuración global",
  descripcion:
    "Lo que se configura una vez y afecta a todo el sitio: marca, contacto, menús, footer, SEO, integraciones y chatbot.",
  icono: "Settings",
  paraQuien: "Superadministrador (dos secciones también para Editor de Admisiones)",
  articulos: [
    {
      id: "mapa",
      titulo: "Qué hay en Configuración",
      resumen: "Las catorce secciones y quién puede entrar a cada una.",
      bloques: [
        {
          t: "p",
          texto:
            "Un cambio aquí se ve **en todo el sitio a la vez**. Por eso casi todo está reservado al Superadministrador.",
        },
        {
          t: "tabla",
          encabezados: ["Sección", "Qué controla", "Quién entra"],
          filas: [
            ["Marca / Identidad visual", "Logos, paleta de colores, tipografía y datos institucionales.", "Superadmin"],
            ["Contacto", "Teléfonos, correos, redes sociales y WhatsApp.", "Superadmin"],
            ["Integraciones", "Códigos de seguimiento y verificación.", "Superadmin"],
            ["Correos", "Proveedor de envío, credenciales y presets.", "Superadmin"],
            ["Diseño de correos", "Logo y texto legal de los correos.", "Superadmin"],
            ["Chatbot «Ateneo»", "El asistente de inteligencia artificial.", "Superadmin"],
            ["Footer global", "El bloque final de todas las páginas.", "Superadmin"],
            ["Admisiones — textos chicos", "Encabezados del formulario y del seguimiento, y el contador ADM.", "Superadmin"],
            ["Barra de navegación", "Lo visible en la barra superior fija.", "Superadmin"],
            ["Mega-menú", "La estructura del menú principal.", "Superadmin"],
            ["SEO defaults", "Metadatos por defecto del sitio.", "Superadmin"],
            ["Años lectivos", "El catálogo de años disponibles.", "Superadmin"],
            ["Documentos de admisión", "El checklist de papeles de cada solicitud.", "Superadmin y Editor de Admisiones"],
            ["Fechas de matrículas", "El banner de fechas de las páginas de matrículas.", "Superadmin y Editor de Admisiones"],
          ],
        },
      ],
    },
    {
      id: "marca",
      titulo: "Marca e identidad visual",
      resumen: "Logos, colores, tipografía y datos institucionales.",
      bloques: [
        { t: "ruta", pasos: ["Configuración", "Marca / Identidad visual"] },
        { t: "sub", texto: "Logos" },
        {
          t: "campos",
          items: [
            { campo: "Logo principal", desc: "A color, para fondos claros." },
            { campo: "Logo blanco", desc: "Para fondos oscuros, como el footer." },
            { campo: "Escudo", desc: "Solo el símbolo, sin las letras." },
            { campo: "Favicon", desc: "El iconito de la pestaña del navegador." },
            { campo: "Imagen por defecto para compartir", desc: "De 1200 × 630 píxeles. Es lo que se ve cuando alguien comparte un enlace del sitio por WhatsApp o Facebook." },
          ],
        },
        { t: "sub", texto: "Colores" },
        {
          t: "p",
          texto:
            "Navy primario, rojo institucional, off-white de fondos y el oscuro de los textos. **Se aplican a todo el sitio público de inmediato.** El dorado se retiró en agosto de 2026 por decisión del colegio: la única pieza que lo conserva es el logo del 50 aniversario, que es una imagen y no se pinta desde aquí.",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "No cambies los colores sin acordarlo con la dirección y con quien lleva la identidad visual del colegio. Un color mal elegido puede dejar textos ilegibles en todo el sitio de golpe.",
        },
        { t: "sub", texto: "Datos institucionales" },
        {
          t: "p",
          texto:
            "Nombre oficial, RUC, año de fundación, dirección, ciudad y país, y sitio web. Alimentan el footer, los correos y la ficha que Google usa para mostrar al colegio en sus resultados.",
        },
      ],
    },
    {
      id: "contacto",
      titulo: "Datos de contacto",
      resumen: "Teléfonos con extensión, correos, redes sociales y WhatsApp.",
      bloques: [
        { t: "ruta", pasos: ["Configuración", "Contacto"] },
        {
          t: "p",
          texto:
            "Se escriben una vez y aparecen en el **footer**, en la **página de Contactos**, en los **correos** y en los datos que lee Google.",
        },
        {
          t: "campos",
          items: [
            { campo: "Teléfonos", desc: "Cada uno con su **etiqueta**, su **número** y su **extensión**. Se pueden añadir y eliminar los que hagan falta." },
            { campo: "Correos", desc: "Cada uno con su etiqueta: admisiones, secretaría, rectorado…" },
            { campo: "Redes sociales", desc: "Facebook, Instagram, YouTube, TikTok, X y LinkedIn. La red que dejes vacía **no aparece**." },
            { campo: "WhatsApp", desc: "El número (sin signos ni espacios) y el **mensaje pre-llenado** con el que se abre el chat. Es el botón flotante del sitio." },
            { campo: "Horario", desc: "El horario de atención que se muestra al público." },
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Si el **chatbot Ateneo** está activo, sustituye al botón flotante de WhatsApp. Los dos no conviven.",
        },
      ],
    },
    {
      id: "navegacion",
      titulo: "Barra de navegación y mega-menú",
      resumen: "Lo que aparece arriba en todas las páginas y cómo se estructura el menú.",
      bloques: [
        { t: "sub", texto: "Barra de navegación" },
        { t: "ruta", pasos: ["Configuración", "Barra de navegación"] },
        {
          t: "p",
          texto:
            "Controla los elementos de la barra superior fija. Cada uno se puede **encender o apagar** por separado:",
        },
        {
          t: "lista",
          items: [
            "El **badge «50 AÑOS»**, con su texto y su logo conmemorativo.",
            "El botón **Portal Familiar**, con su texto y su enlace.",
            "El botón **Tour Virtual**, con su texto y su enlace.",
            "El **icono de búsqueda** y la **campanita** de notificaciones.",
            "El texto del botón que abre el menú.",
          ],
        },
        { t: "sub", texto: "Mega-menú" },
        { t: "ruta", pasos: ["Configuración", "Mega-menú"] },
        {
          t: "pasos",
          items: [
            "Cada **categoría** del menú (Quiénes Somos, Académico, Servicios…) se puede crear, renombrar, reordenar con las flechas y eliminar.",
            "Dentro de cada categoría, los **sub-items** llevan su etiqueta, su enlace y un badge opcional.",
            "Los enlaces pueden apuntar a una página del sitio (`/el-atenas/historia`) o a una dirección externa completa (`https://…`).",
            "**Guarda** y comprueba el menú en el sitio público.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Crear una página **no la añade al menú**. Son dos cosas distintas: primero se crea y publica la página, después se enlaza desde aquí.",
        },
      ],
    },
    {
      id: "footer",
      titulo: "Footer global",
      resumen: "El bloque final que aparece al pie de todas las páginas.",
      bloques: [
        { t: "ruta", pasos: ["Configuración", "Footer global"] },
        {
          t: "campos",
          items: [
            { campo: "Imagen de fondo", desc: "La foto sobre la que se monta el bloque." },
            { campo: "Titular y subtítulo", desc: "El mensaje de cierre del sitio." },
            { campo: "Dos botones", desc: "Cada uno con su texto y su enlace." },
            { campo: "Aliados estratégicos", desc: "Los chips de instituciones aliadas: nombre completo y abreviatura." },
            { campo: "Enlaces del pie", desc: "La lista de accesos rápidos, con texto y URL." },
            { campo: "Copyright", desc: "La línea legal del final." },
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Los teléfonos, correos y redes sociales del footer **no se editan aquí**: vienen de **Configuración › Contacto**.",
        },
      ],
    },
    {
      id: "seo-global",
      titulo: "SEO por defecto e integraciones",
      resumen: "Cómo se presenta el sitio en Google y qué herramientas de medición están conectadas.",
      bloques: [
        { t: "sub", texto: "SEO defaults" },
        { t: "ruta", pasos: ["Configuración", "SEO defaults"] },
        {
          t: "p",
          texto:
            "Título y descripción por defecto, plantilla de título, palabras clave, nombre del sitio, idioma y tipo de tarjeta al compartir. **Es la red de seguridad**: se usa en toda página que no tenga su propio bloque SEO relleno.",
        },
        { t: "sub", texto: "Integraciones" },
        { t: "ruta", pasos: ["Configuración", "Integraciones"] },
        {
          t: "campos",
          items: [
            { campo: "Google Tag Manager", desc: "El identificador del contenedor." },
            { campo: "Google Analytics 4", desc: "El identificador de medición." },
            { campo: "Facebook Pixel · TikTok Pixel", desc: "Para medir campañas de publicidad." },
            { campo: "Calendly", desc: "La dirección del calendario para agendar visitas." },
            { campo: "Verificaciones", desc: "Los códigos de Google Search Console y de Meta Business." },
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Cada script se inyecta en el sitio **solo si su campo está relleno**. Un campo vacío no carga nada — el sitio no se hace más lento por dejarlos en blanco.",
        },
      ],
    },
    {
      id: "chatbot",
      titulo: "Chatbot «Ateneo»",
      resumen: "El asistente de inteligencia artificial del sitio.",
      bloques: [
        { t: "ruta", pasos: ["Configuración", "Chatbot «Ateneo»"] },
        {
          t: "campos",
          items: [
            { campo: "Proveedor y modelo", desc: "Qué inteligencia artificial responde." },
            { campo: "API key", desc: "La credencial del proveedor. Es información sensible: no la compartas." },
            { campo: "System prompt", desc: "La personalidad y las instrucciones del asistente: qué sabe, cómo habla y qué **no** debe responder." },
            { campo: "Mensajes", desc: "El texto de la burbuja flotante, el saludo de bienvenida y el mensaje de respaldo cuando no sabe responder, con su botón." },
            { campo: "Memoria de la conversación", desc: "Cuántos mensajes anteriores se le envían en cada turno." },
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "El chatbot habla en nombre del colegio. Revisa sus respuestas periódicamente y déjale claro en el system prompt que **no debe inventar** valores de pensión, fechas ni requisitos: para eso debe derivar a admisiones.",
        },
      ],
    },
    {
      id: "catalogos",
      titulo: "Catálogos y fechas",
      resumen: "Años lectivos, documentos de admisión y el banner de fechas de matrículas.",
      bloques: [
        {
          t: "campos",
          items: [
            {
              campo: "Años lectivos",
              desc: "La lista de años disponibles en cupos, formularios y cronograma. Al empezar un año nuevo, **este es el primer sitio que hay que actualizar**.",
            },
            {
              campo: "Documentos de admisión",
              desc: "El catálogo de papeles que el equipo marca como recibidos en cada solicitud. Editarlo cambia el checklist de todas las fichas.",
            },
            {
              campo: "Fechas de matrículas",
              desc: "El banner que aparece en las páginas de matrículas: año lectivo, etapas con su rango de fechas (inscripciones, matrículas nuevas, reingreso) y el botón de acción.",
            },
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Las **Fechas de matrículas** y los **Documentos de admisión** son las dos únicas secciones de Configuración a las que también entra el Editor de Admisiones. Están pensadas para que el equipo las mantenga sin depender del Superadministrador.",
        },
      ],
    },
  ],
};

export const USUARIOS: Seccion = {
  slug: "usuarios",
  titulo: "Usuarios del panel",
  descripcion: "Crear cuentas, asignar roles y dar de baja a quien deja el colegio.",
  icono: "Users",
  paraQuien: "Solo Superadministrador",
  articulos: [
    {
      id: "crear-usuario",
      titulo: "Crear una cuenta",
      resumen: "Nombre, correo institucional, contraseña y roles.",
      bloques: [
        { t: "ruta", pasos: ["Usuarios", "Crear usuario"] },
        {
          t: "pasos",
          items: [
            "Entra a **Usuarios** en el menú lateral y pulsa **Crear usuario**.",
            "Escribe el **nombre completo** de la persona — es el que aparecerá en el historial de cambios.",
            "Escribe su **correo**, preferiblemente el institucional (`nombre@atenas.edu.ec`).",
            "Define una **contraseña** de al menos 8 caracteres.",
            "Marca los **roles** que necesita. Puede tener más de uno.",
            "**Guarda** y entrégale las credenciales en persona o por un canal seguro.",
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Pídele que **cambie la contraseña** que le diste en cuanto entre por primera vez.",
        },
      ],
    },
    {
      id: "gestionar-usuarios",
      titulo: "Editar y desactivar cuentas",
      resumen: "Cambiar roles, restablecer contraseñas y dar de baja.",
      bloques: [
        {
          t: "p",
          texto:
            "Desde el listado, haz clic en cualquier persona para editar su nombre, sus roles o su contraseña.",
        },
        {
          t: "p",
          texto:
            "Cuando alguien deja el colegio o cambia de función, **desactiva su cuenta**. No la borres: si la eliminas, el historial de cambios pierde la referencia de quién hizo qué. Una cuenta desactivada no puede entrar, pero su rastro se conserva.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "**No puedes desactivarte a ti mismo.** Es una protección deliberada: evita que el colegio se quede sin ningún Superadministrador.",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "Ten siempre **al menos dos Superadministradores**. Si la única cuenta con ese rol se pierde, recuperar el control requiere intervención técnica externa.",
        },
      ],
    },
    {
      id: "rutina",
      titulo: "Rutina de seguridad",
      resumen: "Qué revisar cada cierto tiempo.",
      bloques: [
        {
          t: "lista",
          items: [
            "**Cada inicio de año lectivo:** revisa la lista de usuarios y desactiva a quien ya no trabaja en el colegio.",
            "**Cuando alguien cambia de puesto:** ajusta sus roles el mismo día.",
            "**Nunca** compartas una cuenta entre varias personas.",
            "**Nunca** dejes credenciales escritas en un papel pegado al monitor ni en un chat de grupo.",
          ],
        },
      ],
    },
  ],
};
