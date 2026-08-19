import type { Seccion } from "../tipos";

export const ADMISIONES: Seccion = {
  slug: "admisiones",
  titulo: "Admisiones",
  descripcion:
    "El proceso completo, hasta la matrícula. Solicitudes del formulario público o registradas a mano, pipeline de 8 estados, ficha de cada una, métricas, cupos, banco de archivos y exportación.",
  icono: "UserPlus",
  paraQuien: "Editor de Admisiones · Superadministrador",
  articulos: [
    {
      id: "vision-general",
      titulo: "Cómo funciona el proceso, de punta a punta",
      resumen:
        "De la primera solicitud —del formulario web o registrada a mano— al estado Matriculado, con correos automáticos en cada paso.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Un representante entra a `/admisiones/formulario` y completa **4 pasos**: datos del estudiante (nivel, **año escolar** e institución de origen), datos del representante, información adicional y confirmación.",
            "Al enviar, el sistema crea la solicitud en estado **Interesado**, le asigna un **número de seguimiento** con formato `ADM<año>-<número>` (por ejemplo `ADM026-278`) y le envía un **correo de confirmación**.",
            "La solicitud aparece de inmediato en **Admisiones › Solicitudes** y en el Dashboard.",
            "El equipo abre la ficha y va **cambiando el estado** conforme avanza el proceso real.",
            "Cada cambio de estado **dispara automáticamente** el correo correspondiente al representante.",
            "El representante puede consultar en qué punto está en la página pública de **seguimiento**, con su número `ADM…` **y el correo con el que registró la solicitud**.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**2do y 3ro de bachillerato.** Al elegir uno de esos dos años, el formulario avisa de que el colegio se reserva el derecho de admisión y de que el trámite se hace **presencialmente**, con la dirección y el teléfono. **La solicitud se envía igual**: se decidió avisar y no bloquear, para no perder el contacto. Tenlo presente al revisar la bandeja — esas familias ya leyeron que tienen que acercarse al colegio.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "El número de seguimiento es **la referencia oficial** de la solicitud. Úsalo al llamar, al escribir y al buscar en el panel.",
        },
      ],
    },
    {
      id: "estados",
      titulo: "Los 8 estados del proceso",
      resumen: "El pipeline oficial del colegio, qué significa cada estado y qué correo dispara.",
      bloques: [
        {
          t: "tabla",
          encabezados: ["#", "Estado", "Qué significa", "Envía correo"],
          filas: [
            [
              "1",
              "Interesado",
              "Acaba de entrar y pide información. Es el estado inicial, tanto si envió el formulario como si la registraste tú a mano.",
              "Solo si envió el formulario: el de confirmación, que manda el propio formulario. Las registradas a mano no reciben nada",
            ],
            [
              "2",
              "Postulante",
              "Recibió los requisitos y está reuniendo la documentación.",
              "Sí",
            ],
            [
              "3",
              "Postulación completa",
              "Entregó toda la documentación; queda habilitado para continuar.",
              "Sí",
            ],
            [
              "4",
              "En evaluación",
              "Pendiente o realizando la entrevista familiar y la evaluación del estudiante.",
              "Sí",
            ],
            [
              "5",
              "En revisión por Comité",
              "El expediente está en el Comité de Admisiones para su resolución.",
              "Sí",
            ],
            [
              "6",
              "Admitido",
              "Aceptado por el Comité. Recibe la notificación oficial.",
              "Sí",
            ],
            [
              "7",
              "No admitido",
              "No cumple los criterios del Comité.",
              "**Apagado por defecto** — por protocolo del colegio esto se comunica por **llamada telefónica**",
            ],
            [
              "8",
              "Matriculado",
              "Completó la matrícula y formalizó su ingreso.",
              "Sí",
            ],
          ],
        },
        { t: "sub", texto: "Reglas del pipeline" },
        {
          t: "lista",
          items: [
            "Los estados avanzan **en orden**. El panel solo te ofrece los estados a los que es válido pasar desde donde estás.",
            "**Desde cualquier estado se puede pasar a No admitido**: es la salida temprana del proceso.",
            "**Matriculado** y **No admitido** son estados finales: desde ahí ya no se avanza.",
            "**Ya no existe la lista de espera.** Al llenarse los cupos, las solicitudes no se derivan automáticamente a ningún lado.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Cambiar el estado **envía el correo al instante**, sin pedir confirmación. Cambia el estado solo cuando el paso real ya ocurrió.",
        },
      ],
    },
    {
      id: "registrar-a-mano",
      titulo: "Registrar una solicitud a mano",
      resumen:
        "Para quien llegó por teléfono, por WhatsApp o en persona, en vez de por el formulario web.",
      bloques: [
        { t: "ruta", pasos: ["Admisiones", "Solicitudes", "Registrar a mano"] },
        {
          t: "p",
          texto:
            "Entra al mismo proceso que las del formulario web y recibe su **número de seguimiento** de la misma numeración, así que no hay dos series conviviendo. Al guardar se abre su ficha, lista para seguir trabajando.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**El año escolar y el año lectivo son obligatorios aquí**, aunque el formulario público no los exija. Sin ellos la solicitud no cuenta en Cupos ni en Métricas: aparece en el aviso de «no aparece en esta pantalla» y no la ve nadie. Tienes a la familia delante o al teléfono — pregúntaselo.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "**No se envía ningún correo** al registrarla, a propósito: estás hablando con la familia en ese momento. Si quieres que reciba algo, muévela de etapa desde su ficha y saldrá el correo de esa etapa.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**Dile el número de seguimiento a la familia antes de colgar.** Como no sale ningún correo, ese número no le llega por ningún otro lado, y sin él no puede consultar el estado de su solicitud en la web. En cuanto la muevas a «Postulante» sí recibirá un correo que lo incluye.",
        },
        {
          t: "p",
          texto:
            "Las registradas así llevan la etiqueta **«A mano»** en el listado y **«Registrada a mano»** en su ficha. Las del formulario web no llevan ninguna, porque son la mayoría.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Es la vía natural para **2do y 3ro de Bachillerato**: ahí el colegio se reserva el derecho de admisión y el trámite es presencial, así que esas solicitudes siempre entran por aquí.",
        },
      ],
    },
    {
      id: "listado-solicitudes",
      titulo: "Buscar y filtrar solicitudes",
      resumen: "Pestañas por estado, filtro por nivel, buscador y exportación.",
      bloques: [
        { t: "ruta", pasos: ["Admisiones", "Solicitudes"] },
        {
          t: "p",
          texto:
            "El listado muestra **20 solicitudes por página**, de la más reciente a la más antigua. Para acotarlo tienes:",
        },
        {
          t: "campos",
          items: [
            {
              campo: "Pestañas de estado",
              desc: "Una por cada estado, con el número de solicitudes en cada uno. **Todas** las muestra sin filtrar.",
            },
            {
              campo: "Filtro por nivel",
              desc: "Educación Inicial, EGB Elemental y Media, EGB Superior o Bachillerato IB.",
            },
            {
              campo: "Buscador",
              desc: "Busca por **número de seguimiento**, nombres o apellidos del estudiante.",
            },
            {
              campo: "Exportar CSV",
              desc: "Descarga las solicitudes en una hoja de cálculo. **Respeta los filtros activos**: si estás viendo solo «Admitido» de IB, eso es lo que exporta.",
            },
          ],
        },
        {
          t: "p",
          texto:
            "El archivo exportado incluye número, datos del estudiante y del representante, nivel, **año escolar**, estado, cómo se enteró del colegio, año lectivo, comentarios, fecha y **cómo llegó** — la última columna, que dice «Formulario web» o «Registrada a mano».",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "Ese archivo contiene **datos personales de menores y de sus familias**. Descárgalo solo en un equipo del colegio, no lo reenvíes por WhatsApp y bórralo cuando termines de usarlo.",
        },
      ],
    },
    {
      id: "ficha",
      titulo: "La ficha de una solicitud",
      resumen: "Todo lo que puedes hacer dentro de una solicitud concreta.",
      bloques: [
        {
          t: "p",
          texto:
            "Haz clic en cualquier fila del listado para abrir la ficha. Está dividida en dos columnas.",
        },
        { t: "sub", texto: "Columna principal" },
        {
          t: "campos",
          items: [
            {
              campo: "Pipeline de estados",
              desc: "Arriba del todo. Muestra en qué punto está la solicitud y te ofrece los estados a los que puede pasar. Al elegir uno, **se guarda y se envía el correo**.",
            },
            {
              campo: "Datos de la solicitud",
              desc: "**Todos los campos son editables**: nombres, nivel, **año escolar**, fecha de nacimiento, institución de origen, datos del representante, año lectivo, cómo se enteró y comentarios. Sirve para corregir lo que el representante escribió mal.",
            },
            {
              campo: "Notas internas",
              desc: "Un espacio libre para el equipo. **No lo ve el representante.** Anota aquí lo hablado en la llamada, lo que quedó pendiente y con quién.",
            },
          ],
        },
        { t: "sub", texto: "Columna lateral" },
        {
          t: "campos",
          items: [
            {
              campo: "Acciones rápidas",
              desc: "**Llamar al representante** (abre el marcador), **Enviar email** (abre tu correo con el asunto ya puesto) y **Ver seguimiento público** (ves exactamente lo que ve la familia).",
            },
            {
              campo: "Documentos físicos recibidos",
              desc: "El checklist de papeles entregados. Se marca a mano conforme llegan. El catálogo de documentos se edita en **Configuración › Documentos de admisión**.",
            },
            {
              campo: "Archivos para enviar al postulante",
              desc: "Archivos que subes **solo para esta solicitud**. Útil para algo específico de esa familia.",
            },
            {
              campo: "Archivos del banco",
              desc: "Documentos reutilizables que vinculas a esta solicitud con un clic. Ver el artículo del **Banco de archivos**.",
            },
            {
              campo: "Historial de cambios",
              desc: "Registro automático de cada cambio de estado: **de qué estado a cuál, quién lo hizo y cuándo**. No se puede editar ni borrar.",
            },
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Antes de llamar a una familia, abre su ficha y lee las **notas internas** y el **historial**. Llegas a la llamada sabiendo exactamente en qué quedaron.",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "Al final de la ficha, solo el Superadministrador ve la **Zona peligrosa**. Eliminar una solicitud borra sus datos, su historial y sus archivos **de forma permanente**. Casi nunca es la respuesta correcta: si la solicitud ya no va, muévela a **No admitido**.",
        },
      ],
    },
    {
      id: "metricas",
      titulo: "Métricas: cómo va el proceso",
      resumen:
        "Una pantalla para responder «cómo vamos» sin abrir la lista completa ni contar a mano.",
      bloques: [
        { t: "ruta", pasos: ["Admisiones", "Métricas"] },
        {
          t: "p",
          texto:
            "Elige arriba el **año lectivo** y la pantalla se recalcula entera. Todo lo que ves corresponde solo a ese año.",
        },
        { t: "sub", texto: "Qué te dice cada bloque" },
        {
          t: "pasos",
          items: [
            "**Ahora mismo** — cuántos aspirantes siguen sin resolverse, cuántos se matricularon y cuántos no fueron admitidos.",
            "**Últimos 30 días** — cuántas solicitudes nuevas entraron y cuántas admitió el Comité en ese plazo. La segunda cifra cuenta **cuándo se admitió**, así que una persona que ya se matriculó sigue contando en el mes en que la admitieron.",
            "**Embudo del proceso** — cuántos aspirantes han llegado *al menos* hasta cada etapa. Quien está matriculado también pasó antes por «postulante», así que las etapas de arriba nunca bajan conforme avanza el proceso. Los no admitidos cuentan hasta donde llegaron antes de salir. Al lado se indica cuántos están parados justo ahí.",
            "**Mes a mes** — cuántos aspirantes entraron cada mes y cuántos admitió el Comité. Las admisiones cuentan en el mes en que se decidieron, aunque después se hayan matriculado. Si el período es largo, se muestran los últimos catorce meses y se avisa de cuántos quedaron fuera.",
            "**Detenidos** — los aspirantes que llevan demasiado tiempo sin cambiar de etapa, del más antiguo al más reciente. Haz clic en cualquiera para abrir su ficha. **Cuántos días son «demasiado» lo decides tú** en Configuración › Admisiones; de fábrica son 14.",
            "**Por nivel** y **por institución de origen** — de dónde vienen los aspirantes de ese año. Si hay muchas instituciones distintas, se listan las diez primeras y el resto se agrupa en «Otras».",
            "La institución la escribe cada familia a mano, así que **dos maneras de escribir el mismo colegio se cuentan por separado**: «Colegio San Francisco» y «colegio san francisco» salen como dos filas. Si un colegio te parece menos frecuente de lo que esperabas, mira si aparece escrito de otra forma más abajo.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**Cuenta todo lo que esté registrado**, venga del formulario web o lo hayas registrado tú a mano. Lo que no aparece es lo que nunca se anotó: si alguien pregunta por teléfono y no queda en la plataforma, no existe para ninguna de estas cifras. Por eso conviene registrar en el momento — **Solicitudes › Registrar a mano**.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**Las solicitudes que no indicaron año lectivo no entran en ningún número**, elijas el año que elijas, porque ese campo es opcional en el formulario público. Si las hay, sale un aviso amarillo arriba con cuántas son. Se completan abriendo su ficha.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "«Detenidos» mide desde el **último cambio de etapa**, no desde la última vez que se editó la ficha. Corregir un apellido o añadir una nota no reinicia la cuenta: si el aspirante lleva un mes parado, lo seguirás viendo.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "**Los 14 días de «Detenidos» son un valor de partida que pusimos nosotros, no una norma del colegio.** Se ajusta en **Configuración › Admisiones — textos chicos**, en el bloque «Métricas de admisiones», a lo que de verdad les parezca demasiado tiempo sin contactar a una familia. Tiene que ser un número entre 1 y 365, el cambio se ve al instante y no hace falta avisarnos. **A esa pantalla solo entra el Superadministrador**: si eres Editor de Admisiones, pídeselo a quien lleve el panel.",
        },
      ],
    },
    {
      id: "cupos",
      titulo: "Cupos por nivel y por año",
      resumen: "Cuántos estudiantes admite cada nivel —y, si quieres, cada año escolar— en cada año lectivo.",
      bloques: [
        { t: "ruta", pasos: ["Admisiones", "Cupos"] },
        {
          t: "pasos",
          items: [
            "Elige el **año lectivo** en la parte superior.",
            "Escribe cuántos **cupos totales** tiene cada uno de los cuatro niveles.",
            "Si además llevas la cuenta año por año, rellena la tabla **Detalle por año escolar** de más abajo. Es opcional: déjala en cero si solo trabajas por nivel.",
            "**Guarda.** Un mismo botón guarda las dos tablas.",
          ],
        },
        {
          t: "p",
          texto:
            "La pantalla te muestra los cupos configurados junto a las solicitudes **de ese año lectivo**, para que veas de un vistazo cómo va el llenado. Cada casilla guarda su propio número: escribir en el detalle por año escolar **no cambia** la casilla del nivel, ni al revés.\n\n**El «Total cupos» de arriba sí las mira las dos**, con una regla sencilla: manda el número del nivel, y solo cuando ese está en cero cuenta los años escolares de su detalle. Así nunca suma dos veces lo mismo, y nunca dice cero cuando hay algo configurado. Es el mismo número que ves en **Configuración › Años lectivos**.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**La ocupación por año solo cuenta las solicitudes que dicen a qué año aspiran.** El formulario lo pregunta desde el 11 de agosto de 2026; las de antes salen como «sin año escolar indicado» y se avisa arriba de la tabla. Puedes completarlas abriendo su ficha.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Los cupos son **informativos para el equipo** y no se publican en el sitio. El sistema no bloquea el formulario ni deriva a lista de espera cuando se llenan: la decisión sigue siendo del colegio.",
        },
      ],
    },
    {
      id: "banco-archivos",
      titulo: "Banco de archivos",
      resumen: "Documentos reutilizables que se adjuntan a cualquier solicitud.",
      bloques: [
        { t: "ruta", pasos: ["Admisiones", "Banco de archivos"] },
        {
          t: "p",
          texto:
            "Es la biblioteca de documentos que el equipo envía una y otra vez: el instructivo de requisitos, el formulario de matrícula, el cronograma de evaluaciones.",
        },
        {
          t: "pasos",
          items: [
            "Sube el archivo al banco una sola vez, con su **nombre** y una **descripción** de para qué sirve.",
            "En la ficha de cualquier solicitud, en **Archivos del banco**, márcalo para vincularlo.",
            "Si el documento cambia, lo actualizas en el banco y queda actualizado para todos.",
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "La diferencia con **Archivos para enviar al postulante** es simple: el banco es lo que le mandas a **todos**; los adjuntos son lo que le mandas a **esa familia en concreto**.",
        },
      ],
    },
    {
      id: "numeracion",
      titulo: "El contador de números de seguimiento",
      resumen: "Cómo ajustar el próximo número ADM si el colegio ya venía numerando aparte.",
      bloques: [
        { t: "ruta", pasos: ["Configuración", "Admisiones — textos chicos"] },
        {
          t: "p",
          texto:
            "Cada solicitud recibe un código secuencial con formato `ADM<año>-<n>`, por ejemplo `ADM026-278`. Si el colegio ya venía entregando números a mano, aquí se ajusta desde dónde continúa el sistema.",
        },
        {
          t: "pasos",
          items: [
            "Entra a **Configuración › Admisiones — textos chicos**.",
            "Busca el bloque del **contador**. Verás el último número entregado y un ejemplo del próximo código.",
            "Escribe el número desde el que debe continuar y pulsa **Actualizar contador**.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Solo el **Superadministrador** entra aquí. Bajar el contador puede producir **números repetidos**: hazlo una sola vez, al inicio del año, y con el dato confirmado.",
        },
        {
          t: "p",
          texto:
            "Esta misma pantalla tiene, más abajo, el bloque **«Métricas de admisiones»**: ahí se fijan los días sin avanzar a partir de los cuales un aspirante aparece como detenido.",
        },
      ],
    },
    {
      id: "seguimiento-publico",
      titulo: "La página de seguimiento",
      resumen: "Lo que ve la familia cuando consulta su número.",
      bloques: [
        {
          t: "p",
          texto:
            "En `/admisiones/seguimiento` el representante escribe **dos datos**: su número `ADM…` y el **correo del representante** con el que registró la solicitud. Con eso ve en qué punto del proceso está. No necesita usuario ni contraseña.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**Hacen falta los dos datos, y es a propósito.** Los números son correlativos, así que con solo el número cualquiera podía ir probando `ADM026-001`, `-002`, `-003`… y sacar la lista de todos los aspirantes con su nombre y su nivel. El correo es lo que impide eso. Si una familia dice que no le funciona, casi siempre es que está usando un correo distinto al que puso en el formulario.",
        },
        {
          t: "p",
          texto:
            "Desde la ficha, el botón **Ver seguimiento público** te muestra esa misma pantalla. Úsalo cuando alguien llame preguntando: verás exactamente lo mismo que tiene delante. Ten a mano el correo del representante, que lo tienes en la ficha.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Si haces muchas consultas seguidas, la página deja de responder un rato. Es la protección contra quien intenta adivinar datos a la fuerza, y cuenta todas las consultas, no solo las equivocadas. Espera unos minutos y vuelve a intentarlo.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Los encabezados de esa página se editan en **Configuración › Admisiones — textos chicos**. La lógica del formulario y del wizard vive en el código y no se toca desde el panel — y de momento tampoco el aviso de trámite presencial de 2do y 3ro de bachillerato.",
        },
      ],
    },
  ],
};

export const CORREOS: Seccion = {
  slug: "correos",
  titulo: "Sistema de correos",
  descripcion:
    "Los correos automáticos que salen del sitio: los del pipeline de admisiones, las confirmaciones de formularios, su diseño y la configuración de envío.",
  icono: "Mail",
  paraQuien: "Superadministrador · Editor de Admisiones (solo los del pipeline)",
  articulos: [
    {
      id: "que-correos-salen",
      titulo: "Qué correos envía el sitio",
      resumen: "Dos familias: los del pipeline de admisiones y las confirmaciones de formularios.",
      bloques: [
        { t: "sub", texto: "Correos del pipeline de admisiones" },
        {
          t: "p",
          texto:
            "Siete correos, uno por cada estado a partir de **Postulante**. Salen automáticamente cuando el equipo cambia el estado de una solicitud. Se editan en **Admisiones › Correos**.",
        },
        { t: "sub", texto: "Confirmaciones de formularios" },
        {
          t: "p",
          texto:
            "Cinco correos que se envían a quien llena un formulario público, para confirmarle que su mensaje llegó. Se editan en **Contenido › Plantillas de correo para formularios**:",
        },
        {
          t: "tabla",
          encabezados: ["Plantilla", "Se dispara cuando"],
          filas: [
            ["Contactos", "Alguien envía el formulario de `/contactos`."],
            ["Quejas y sugerencias", "Alguien envía una queja o sugerencia desde `/servicios/quejas`."],
            ["Trabaja con nosotros", "Un postulante envía su hoja de vida."],
            ["Admisiones — confirmación de solicitud", "Un representante envía la solicitud formal de admisión."],
            ["Admisiones — consulta por nivel", "Alguien pide información desde una página de admisión por nivel."],
          ],
        },
      ],
    },
    {
      id: "editar-correo-pipeline",
      titulo: "Editar un correo del pipeline",
      resumen: "Asunto, cuerpo, color, botón y vista previa antes de enviar.",
      bloques: [
        { t: "ruta", pasos: ["Admisiones", "Correos"] },
        {
          t: "pasos",
          items: [
            "Entra a **Admisiones › Correos**. Verás la lista de los estados con su correo.",
            "Haz clic en el estado que quieras editar.",
            "Ajusta el **Asunto** — es lo que la familia ve en su bandeja de entrada.",
            "Ajusta el **Título del correo** (la cabecera azul) y el **cuerpo**, con el editor de texto enriquecido.",
            "Elige el **color de acento**: Navy (neutral), Rojo (acción) o Rojo institucional (celebración).",
            "Opcionalmente añade **eyebrow**, **imagen de banner**, **botón** con su texto y URL, y un **texto de ayuda** bajo el botón.",
            "Cambia a la pestaña **Vista previa**, sobre el editor: verás el correo tal como llega al buzón, relleno con datos de ejemplo.",
            "Comprueba que el interruptor **activo** esté como lo quieres y **Guarda**.",
          ],
        },
        { t: "sub", texto: "Variables disponibles" },
        {
          t: "p",
          texto:
            "Escribe estos códigos y el sistema los reemplaza con los datos reales de cada solicitud al enviar. Hay botones para insertarlos, tanto en el asunto como en el cuerpo:",
        },
        {
          t: "campos",
          items: [
            { campo: "`{{numero}}`", desc: "El número de seguimiento, por ejemplo `ADM026-278`." },
            { campo: "`{{est_nombres}}`", desc: "Nombres del estudiante." },
            { campo: "`{{est_apellidos}}`", desc: "Apellidos del estudiante." },
            { campo: "`{{est_nivel}}`", desc: "Nivel solicitado." },
            { campo: "`{{rep_nombres}}`", desc: "Nombres del representante." },
            { campo: "`{{url_seguimiento}}`", desc: "Enlace que abre la página de seguimiento con el número ya escrito. La familia todavía tiene que poner su correo y pulsar el botón para ver el estado." },
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Escribe las variables **exactamente así**, con las dos llaves a cada lado y sin espacios. Si te equivocas, la familia recibirá el correo con el código escrito tal cual. Usa los botones de insertar y evitarás el problema.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "El correo de **No admitido** viene **apagado** a propósito: el protocolo del colegio es comunicarlo por llamada. No lo enciendas sin acordarlo con la dirección.",
        },
      ],
    },
    {
      id: "plantillas-formularios",
      titulo: "Editar las confirmaciones de formularios",
      resumen: "Los cinco correos de acuse de recibo, con sus propias variables.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Plantillas de correo para formularios"] },
        {
          t: "p",
          texto:
            "Funcionan igual que los del pipeline: asunto, cuerpo, vista previa y variables propias de cada formulario. Cada plantilla te muestra en pantalla **qué variables admite** — por ejemplo `{{nombre}}` y `{{asunto}}` en Contactos, o `{{cargo}}` en Trabaja con nosotros.",
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Estos correos son la **primera impresión** que se lleva alguien que escribe al colegio. Que digan claramente en cuánto tiempo se le responderá.",
        },
      ],
    },
    {
      id: "configurar-envio",
      titulo: "Configurar el envío",
      resumen: "Proveedor, credenciales, presets de remitente y correo de prueba.",
      bloques: [
        { t: "ruta", pasos: ["Configuración", "Correos"] },
        {
          t: "p",
          texto:
            "Aquí se define **desde qué cuenta salen los correos y a quién llegan los avisos internos**. Es exclusivo del Superadministrador y normalmente se toca una sola vez.",
        },
        {
          t: "campos",
          items: [
            {
              campo: "Proveedor activo",
              desc: "**Resend** o **SMTP**. Solo uno funciona a la vez; las credenciales del otro quedan guardadas pero inactivas.",
            },
            {
              campo: "Credenciales",
              desc: "La API key en el caso de Resend; host, puerto, usuario y contraseña en el caso de SMTP.",
            },
            {
              campo: "Presets por propósito",
              desc: "Cinco bloques —pipeline de admisiones, solicitudes y consultas, quejas, contactos y trabaja con nosotros— donde defines el **remitente** de cada tipo de correo y, cuando aplica, el **destinatario interno** que recibe el aviso en el colegio.",
            },
            {
              campo: "Probar envío",
              desc: "Manda un correo de prueba **real** con la configuración guardada. Guarda primero, luego prueba.",
            },
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Con Google Workspace, el remitente que ve quien recibe el correo es **siempre la cuenta autenticada en SMTP**, sin importar lo que se escriba en el preset. Para que aparezca «admisiones@atenas.edu.ec» hay que autenticar con esa cuenta: es una tarea del **departamento de TI** del colegio.",
        },
      ],
    },
    {
      id: "diseno-correos",
      titulo: "El diseño de los correos",
      resumen: "Logo y texto legal comunes a todos los correos.",
      bloques: [
        { t: "ruta", pasos: ["Configuración", "Diseño de correos"] },
        {
          t: "p",
          texto:
            "Define la identidad compartida por todos los correos transaccionales: qué **variante del logo** se usa (blanco sobre azul, o color sobre blanco) y el **texto legal del pie**.",
        },
        {
          t: "p",
          texto:
            "Todo lo demás —colores, nombre del colegio, teléfonos, redes sociales— se hereda automáticamente de **Configuración › Marca** y **Configuración › Contacto**. No hay que repetirlo aquí.",
        },
      ],
    },
    {
      id: "no-llegan",
      titulo: "Si los correos no llegan",
      resumen: "Qué revisar, en orden, antes de pedir ayuda.",
      bloques: [
        {
          t: "pasos",
          items: [
            "Revisa la carpeta de **spam o correo no deseado** de quien debía recibirlo.",
            "Comprueba en **Configuración › Correos** que el proveedor activo es el correcto y que las credenciales están completas.",
            "Usa **Probar envío** a tu propia dirección. Si la prueba llega y el correo real no, el problema está en la plantilla o en el estado, no en el envío.",
            "Confirma que la plantilla de ese estado está **activa**.",
            "Confirma que la solicitud tiene un **correo del representante** bien escrito.",
            "Si nada de esto lo resuelve, anota qué probaste y consúltalo. No cambies credenciales al azar.",
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Que los correos caigan en spam depende de la configuración **DNS del dominio** (SPF, DKIM y DMARC). Eso lo configura el departamento de TI, no se arregla desde el panel.",
        },
      ],
    },
  ],
};
