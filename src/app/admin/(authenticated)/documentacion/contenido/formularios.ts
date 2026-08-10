import type { Seccion } from "../tipos";

/**
 * Documentación del motor de formularios y de las vacantes.
 *
 * La lee el personal del colegio, que no es técnico: se habla de lo que ven en
 * pantalla, no de tablas ni de campos de base de datos.
 */

export const FORMULARIOS: Seccion = {
  slug: "formularios",
  titulo: "Formularios",
  descripcion:
    "Crear tus propios formularios, elegir qué preguntan, colocarlos en una página y leer las respuestas.",
  icono: "ClipboardList",
  paraQuien:
    "Editor de Comunicaciones · Editor de Talento Humano · Superadministrador",
  articulos: [
    {
      id: "que-es",
      titulo: "Qué puedes hacer aquí",
      resumen: "Crear un formulario, ponerlo en una página y recibir las respuestas.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Formularios"] },
        {
          t: "p",
          texto:
            "Aquí armas un formulario tú mismo: eliges las preguntas, a quién le llega el aviso y en qué página se ve. No hace falta pedírselo a nadie.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "**Todo lo que la gente responde queda guardado aquí**, aunque falle el correo de aviso. Antes no era así: si el correo no salía, el mensaje se perdía y no había forma de saberlo.",
        },
        {
          t: "lista",
          items: [
            "**Contactos**, **Quejas y sugerencias** y **Consulta de admisiones** ya funcionan con este sistema. Sus páginas se ven igual que siempre.",
            "**Postulación de empleo** es el de «Trabaja con nosotros»: lo usan todas las vacantes.",
            "**La solicitud de admisión no está aquí**: se gestiona en su propia sección, Admisiones, porque tiene el seguimiento por etapas.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**No todo el mundo ve los mismos formularios.** Cada formulario pertenece a un área, y solo la ve quien tiene ese rol. Talento Humano ve únicamente el de postulación de empleo; el resto los ve Comunicaciones. Si echas en falta uno, no está borrado: es de otra área.",
        },
      ],
    },
    {
      id: "crear",
      titulo: "Crear un formulario",
      resumen: "Del nombre a las preguntas, paso a paso.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Entra en Contenido › Formularios y pulsa **Crear formulario**.",
            "Escribe el nombre. Es solo para ti: te sirve para reconocerlo en esta lista.",
            "La dirección se rellena sola a partir del nombre. Puedes cambiarla, pero solo admite minúsculas, números y guiones.",
            "Pulsa **Crear y elegir preguntas**.",
            "Añade las preguntas con los botones de abajo: hay diez tipos.",
            "Rellena **A quién le llega** con el correo que debe recibir el aviso.",
            "Marca **Formulario activo** y guarda.",
          ],
        },
        {
          t: "sub",
          texto: "Los tipos de pregunta",
        },
        {
          t: "campos",
          items: [
            { campo: "Texto corto", desc: "Una línea. Para nombres, cédula o cargo." },
            { campo: "Texto largo", desc: "Varias líneas. Para mensajes o comentarios." },
            { campo: "Correo electrónico", desc: "Comprueba que tenga forma de correo antes de enviar." },
            { campo: "Teléfono", desc: "Admite números de casa y celular." },
            { campo: "Número", desc: "Solo cifras." },
            { campo: "Fecha", desc: "Con calendario." },
            { campo: "Lista desplegable", desc: "Se elige una sola opción de las que definas." },
            { campo: "Casillas de selección", desc: "Se pueden marcar varias a la vez." },
            { campo: "Casilla de aceptación", desc: "Hay que marcarla para poder enviar. Para el consentimiento de datos." },
            { campo: "Subir archivo", desc: "La persona adjunta un documento o un audio. Se guarda en privado." },
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Si dejas **A quién le llega** vacío, las respuestas se guardan igual pero **nadie recibe aviso**: alguien tendría que entrar a mirar la bandeja por su cuenta.",
        },
      ],
    },
    {
      id: "colocar",
      titulo: "Poner el formulario en una página",
      resumen: "Dónde se elige y en qué páginas se puede.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Ve a Contenido › Páginas y abre la página donde lo quieres.",
            "Arriba del todo verás **Formulario al final de la página**.",
            "Elige el formulario en la lista y pulsa **Guardar**.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Ese ajuste **se guarda por separado** del resto del editor: tiene su propio botón. Guardar la página no lo guarda a él, ni al revés.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "**No todas las páginas lo admiten.** Las que tienen un diseño hecho a medida —Contactos, Admisiones, los niveles, las fichas de servicios y espacios— llevan su propia maquetación, y ahí el formulario hay que añadirlo al diseño. Cuando sea el caso, la propia página te lo dirá en lugar de ofrecerte la lista. Sí funciona en cualquier página que crees tú desde Contenido › Páginas.",
        },
      ],
    },
    {
      id: "respuestas",
      titulo: "Leer las respuestas",
      resumen: "La bandeja, los estados, los adjuntos y la descarga a Excel.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Formularios", "Respuestas"] },
        {
          t: "p",
          texto:
            "Cada formulario tiene su bandeja. Las respuestas se listan de la más reciente a la más antigua y se abren para ver todo lo que la persona escribió.",
        },
        {
          t: "sub",
          texto: "Los cuatro estados",
        },
        {
          t: "tabla",
          encabezados: ["Estado", "Cuándo usarlo"],
          filas: [
            ["Nueva", "Acaba de llegar y nadie la ha mirado."],
            ["En proceso", "Alguien la está atendiendo."],
            ["Atendida", "Ya se respondió o se resolvió."],
            ["Descartada", "No procede. No se borra nada: queda archivada."],
          ],
        },
        {
          t: "lista",
          items: [
            "**Nota interna**: para dejar constancia de lo que se hizo. Solo la ve el equipo del colegio.",
            "**Descargar en Excel**: baja todas las respuestas de ese formulario en una hoja de cálculo.",
            "**Archivos adjuntos**: se descargan pulsando su nombre. El enlace **caduca en una hora** por seguridad; si se te pasa, vuelve a entrar y genera otro.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Si ves la marca **«sin aviso»** en rojo, esa respuesta llegó bien pero el correo de notificación no salió. Los datos están completos aquí. Si se repite, avisa a Esteban: es señal de que algo va mal con el correo.",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "**Borrar definitivamente** elimina la respuesta y sus archivos para siempre. Está pensado solo para cuando alguien pide que se eliminen sus datos personales, que es un derecho que tiene por ley. Para cerrar un caso normal, usa el estado «Descartada».",
        },
      ],
    },
    {
      id: "correos",
      titulo: "A quién le llegan y desde dónde salen",
      resumen: "Qué se configura en el formulario y qué en Configuración › Correos.",
      bloques: [
        {
          t: "p",
          texto:
            "Son dos cosas distintas y se configuran en dos sitios. Es la confusión más fácil de tener:",
        },
        {
          t: "tabla",
          encabezados: ["Qué", "Dónde se cambia"],
          filas: [
            ["**A quién le llega** el aviso", "En el formulario, en «A quién le llega»"],
            ["**Desde qué buzón sale** y con qué nombre", "Configuración › Correos"],
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Puedes poner **varios correos separados por comas** si el aviso debe llegarle a más de una persona.",
        },
        {
          t: "p",
          texto:
            "El formulario también puede enviar una **confirmación automática** a quien lo rellenó. Para eso necesita una pregunta de tipo «Correo electrónico», que es de donde saca la dirección.",
        },
      ],
    },
  ],
};

export const VACANTES: Seccion = {
  slug: "vacantes",
  titulo: "Vacantes de empleo",
  descripcion:
    "Publicar ofertas de trabajo, redactar su perfil y recibir las postulaciones.",
  icono: "BriefcaseBusiness",
  paraQuien:
    "Editor de Talento Humano · Editor de Comunicaciones · Superadministrador",
  articulos: [
    {
      id: "quien-lo-maneja",
      titulo: "Quién debe manejar esta sección",
      resumen: "Existe un rol propio para talento humano. Es el que hay que darle.",
      bloques: [
        {
          t: "p",
          texto:
            "Quien contrata en el colegio necesita el rol **Editor de Talento Humano**. Con él ve las Vacantes, la página «Trabaja con nosotros», las postulaciones que llegan y el correo de confirmación que reciben los candidatos. Nada más.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**No le des «Editor de Comunicaciones» para que pueda publicar vacantes.** Ese rol abre además los mensajes de contacto de las familias, las quejas y las solicitudes de admisión, con datos de menores. Y al revés: quien edita textos del sitio no debería ver hojas de vida ni cédulas de los postulantes.",
        },
        {
          t: "p",
          texto:
            "El Superadministrador asigna el rol desde **Usuarios**. Una misma persona puede tener varios roles si de verdad hace los dos trabajos.",
        },
      ],
    },
    {
      id: "que-es",
      titulo: "Cómo funciona",
      resumen: "Cada vacante tiene su página y su formulario de postulación.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Vacantes"] },
        {
          t: "p",
          texto:
            "Las vacantes que publiques aquí aparecen en la página **Trabaja con nosotros**, agrupadas igual que antes: cargos en concurso, otras vacantes abiertas y banco de aspirantes.",
        },
        {
          t: "lista",
          items: [
            "Cada vacante tiene **su propia página**, con dirección propia. Puedes compartirla por WhatsApp o en redes sin mandar a la gente a buscarla en una lista.",
            "Cada una lleva **su formulario de postulación**, así las postulaciones de cada cargo llegan por separado.",
            "El cargo llega **ya escrito** en el formulario: quien postula no tiene que teclearlo.",
          ],
        },
      ],
    },
    {
      id: "publicar",
      titulo: "Publicar una vacante",
      resumen: "Del título a la publicación, con el perfil requerido.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Entra en Contenido › Vacantes y pulsa **Publicar vacante**.",
            "Escribe el título del cargo y elige en qué bloque aparece.",
            "Se crea como **borrador**: no se ve en el sitio todavía, así puedes redactarla con calma.",
            "Rellena el resumen, la descripción y el perfil requerido.",
            "En **Cómo se postula**, elige el formulario. Normalmente será «Postulación de empleo».",
            "Marca **Vacante publicada** y guarda.",
          ],
        },
        {
          t: "sub",
          texto: "Qué poner en cada campo",
        },
        {
          t: "campos",
          items: [
            { campo: "Resumen", desc: "Una o dos frases. Es lo único que se lee en la tarjeta del listado, así que conviene que diga a quién buscan." },
            { campo: "Descripción del cargo", desc: "El cuerpo de la oferta. Deja una línea en blanco para separar párrafos." },
            { campo: "Formación", desc: "El título que se pide. Ej.: «Título de cuarto nivel en gestión educativa o afines»." },
            { campo: "Experiencia", desc: "Los años y el tipo de experiencia." },
            { campo: "Habilidades y conocimientos", desc: "Una por línea. Aparecen como lista con viñetas." },
            { campo: "Fecha de cierre", desc: "Opcional. Pasada esa fecha la vacante se retira sola del sitio." },
            { campo: "Orden", desc: "Número más bajo, aparece antes en el listado." },
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Usa la **fecha de cierre** siempre que sepas hasta cuándo recibes postulaciones. Es lo que evita que una convocatoria vieja siga abierta porque nadie se acordó de bajarla.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "No se puede publicar una vacante **sin formulario**: quien entrara vería el perfil pero no tendría dónde dejar sus datos.",
        },
      ],
    },
    {
      id: "cerrar",
      titulo: "Cerrar o retirar una vacante",
      resumen: "Desactivar conserva el texto; borrar no toca las postulaciones.",
      bloques: [
        {
          t: "p",
          texto:
            "Cuando el cargo se llena, **desmarca «Vacante publicada»**. Deja de verse en el sitio pero conservas todo el texto para la próxima convocatoria: publicarla de nuevo es marcar una casilla.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Si borras una vacante, **las postulaciones que ya llegaron no se borran**: siguen en la bandeja de su formulario, en Contenido › Formularios.",
        },
      ],
    },
    {
      id: "postulaciones",
      titulo: "Ver las postulaciones",
      resumen: "Dónde llegan y cómo se descargan las hojas de vida.",
      bloques: [
        {
          t: "p",
          texto:
            "Desde el listado de vacantes, el botón **Postulaciones** te lleva directo a la bandeja del formulario de esa vacante.",
        },
        {
          t: "lista",
          items: [
            "Las **hojas de vida** y los **audios** se descargan pulsando su nombre.",
            "El enlace de descarga **caduca en una hora**. Si se te pasa, vuelve a entrar y se genera otro.",
            "Puedes bajar todas las postulaciones **en Excel** para revisarlas en conjunto.",
          ],
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "Las hojas de vida son **datos personales de gente real**. No están publicadas en internet: solo se pueden ver desde este panel. Evita reenviarlas por correo o subirlas a carpetas compartidas.",
        },
      ],
    },
  ],
};
