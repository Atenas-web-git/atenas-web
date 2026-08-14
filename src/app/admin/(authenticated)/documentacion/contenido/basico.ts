import type { Seccion } from "../tipos";

export const PRIMEROS_PASOS: Seccion = {
  slug: "primeros-pasos",
  titulo: "Primeros pasos",
  descripcion:
    "Qué es esta plataforma, cómo entrar al panel y qué significa cada parte de la pantalla.",
  icono: "Compass",
  paraQuien: "Todo el equipo",
  articulos: [
    {
      id: "que-es",
      titulo: "Qué es esta plataforma",
      resumen: "La web del colegio tiene dos caras: el sitio público y el panel de administración.",
      bloques: [
        {
          t: "p",
          texto:
            "La plataforma web de la Unidad Educativa Atenas tiene **dos caras**, y es importante no confundirlas:",
        },
        {
          t: "lista",
          items: [
            "**El sitio público** — lo que ven los padres de familia, los aspirantes y cualquier visitante. Es la página web del colegio.",
            "**El panel de administración** (`/admin`) — donde el colegio edita el sitio sin tocar código: textos, fotos, documentos, menús, colores, correos y todo el proceso de admisiones. Es esta pantalla en la que estás ahora.",
          ],
        },
        {
          t: "p",
          texto:
            "No es WordPress ni una plantilla comprada: es un sistema **hecho a la medida** del colegio. Eso significa que cada campo que ves en el panel existe porque alimenta algo concreto del sitio público.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "**Regla de oro que se repite en todo este manual:** después de cada cambio → **Guardar** → abrir el sitio público y confirmar que se ve bien. Los cambios se publican al instante, sin esperar a nadie.",
        },
      ],
    },
    {
      id: "entrar",
      titulo: "Entrar y salir del panel",
      resumen: "Iniciar sesión, cerrar sesión y qué hacer si olvidaste la contraseña.",
      bloques: [
        { t: "sub", texto: "Iniciar sesión" },
        {
          t: "pasos",
          items: [
            "Abre el navegador y escribe la dirección del sitio seguida de `/admin`.",
            "Escribe tu **correo** y tu **contraseña**. Te las entrega el Superadministrador del colegio.",
            "Haz clic en **Iniciar sesión**.",
            "Si los datos son correctos entrarás al **Dashboard**, la pantalla de inicio del panel.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Si al entrar te devuelve al login con un aviso de acceso, significa que tu cuenta está **desactivada** o **no tiene rol asignado**. Pídeselo al Superadministrador.",
        },
        { t: "sub", texto: "Cerrar sesión" },
        {
          t: "pasos",
          items: [
            "Mira la esquina **inferior izquierda** del panel: ahí está tu nombre y tu rol.",
            "Haz clic en el icono de salida (la flecha que sale de la puerta), a la derecha de tu nombre.",
          ],
        },
        {
          t: "p",
          texto:
            "Cierra sesión siempre que uses una **computadora compartida** o dejes tu equipo sin supervisión.",
        },
        { t: "sub", texto: "Olvidé mi contraseña" },
        {
          t: "p",
          texto:
            "Pídele al **Superadministrador** que te la restablezca desde **Usuarios**. No hay recuperación automática por correo: es una decisión de seguridad, para que solo una persona controle los accesos.",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "**Una cuenta por persona. Nunca compartas tu usuario y contraseña.** El panel registra quién hizo cada cambio; si dos personas usan la misma cuenta, ese registro deja de servir.",
        },
      ],
    },
    {
      id: "pantalla",
      titulo: "Cómo está organizada la pantalla",
      resumen: "Menú lateral, encabezado y área de trabajo.",
      bloques: [
        {
          t: "campos",
          items: [
            {
              campo: "Menú lateral (azul, izquierda)",
              desc: "La navegación principal. **Las opciones que ves dependen de tu rol** — si un compañero ve más opciones que tú, no es un error.",
            },
            {
              campo: "Encabezado (arriba)",
              desc: "El nombre de la sección en la que estás y una línea que explica para qué sirve.",
            },
            {
              campo: "Área de trabajo (centro)",
              desc: "Donde se edita. Casi todas las pantallas de edición tienen su botón **Guardar cambios** arriba, fijo mientras haces scroll.",
            },
            {
              campo: "Tu usuario (abajo a la izquierda)",
              desc: "Tu nombre, tu rol y el botón de cerrar sesión.",
            },
          ],
        },
      ],
    },
    {
      id: "dashboard",
      titulo: "El Dashboard",
      resumen: "La pantalla de inicio: números del embudo de admisiones y últimas solicitudes.",
      bloques: [
        {
          t: "p",
          texto:
            "Es lo primero que ves al entrar. Resume el estado del proceso de admisiones en números:",
        },
        {
          t: "lista",
          items: [
            "**Interesados** — cuántas personas llenaron el formulario y todavía no avanzan.",
            "**En evaluación** — cuántas están en entrevista o evaluación del estudiante.",
            "**Admitidos** — cuántas ya fueron aceptadas por el Comité.",
            "**Matriculados** — cuántas completaron la matrícula.",
            "**Usuarios activos** — cuántas cuentas del panel están habilitadas.",
          ],
        },
        {
          t: "p",
          texto:
            "Debajo aparecen las **5 solicitudes más recientes**. Haz clic en cualquiera para abrir su ficha directamente.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "**Estas cifras suman todos los años lectivos juntos.** Si quieres verlas de un año concreto —y además el embudo, quién lleva demasiado tiempo detenido y de qué colegios vienen los aspirantes—, ve a **Admisiones › Métricas**. Es normal que los números no coincidan: cuentan cosas distintas.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Si tu rol no incluye Admisiones, el Dashboard te mostrará menos información. Es normal.",
        },
      ],
    },
    {
      id: "recorrido-publico",
      titulo: "Qué páginas tiene el sitio público",
      resumen: "Mapa de todas las páginas y de los elementos que aparecen en todas.",
      bloques: [
        {
          t: "p",
          texto:
            "Antes de editar conviene conocer el sitio. Estas son sus páginas principales:",
        },
        {
          t: "lista",
          items: [
            "**Inicio** — portada con video, trayectoria de 50 años, niveles y «Por qué Atenas».",
            "**El Atenas** — Historia, Misión, Visión, Valores, Directiva de Padres, Directorio FCEA.",
            "**Académico** — niveles educativos y Bachillerato Internacional (IB).",
            "**Admisiones** — landing del proceso, 4 páginas por nivel, formulario de solicitud y consulta de seguimiento.",
            "**Matrículas** — proceso, valores y autorizaciones.",
            "**Servicios** y **Espacios** — una ficha por cada uno.",
            "**Reconocimientos** — categorías, logros y galerías de fotos.",
            "**Cronograma anual** — eventos del año en tres vistas: tarjetas, calendario y línea de tiempo.",
            "**Documentos institucionales** — descargas en PDF.",
            "**Contactos** — datos, mapa y formulario de mensaje.",
            "**Trabaja con nosotros** — las vacantes abiertas, cada una con su página y su formulario.",
            "**Portal familiar** y las **Políticas** institucionales.",
          ],
        },
        { t: "sub", texto: "Elementos que aparecen en todas las páginas" },
        {
          t: "lista",
          items: [
            "**Barra de navegación** con el mega-menú, el badge de 50 años y los botones de Portal Familiar y Tour Virtual.",
            "**Buscador** — se abre con `Ctrl + K` (o `Cmd + K` en Mac) y busca en todo el sitio.",
            "**Notificaciones** — la campana, los popups de bienvenida y el banner superior.",
            "**Chatbot «Ateneo»** — el asistente con inteligencia artificial, en la burbuja flotante.",
            "**Footer** — el bloque final con enlaces, aliados y datos de contacto.",
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "El sitio se adapta solo al celular. No hay que editar una «versión móvil» aparte: lo que guardas se ve bien en ambos.",
        },
      ],
    },
  ],
};

export const ROLES_SECCION: Seccion = {
  slug: "roles",
  titulo: "Roles y permisos",
  descripcion:
    "Los cinco roles del panel, qué puede hacer cada uno y por qué no todos ven lo mismo.",
  icono: "ShieldCheck",
  paraQuien: "Todo el equipo · imprescindible para el Superadministrador",
  articulos: [
    {
      id: "los-roles",
      titulo: "Los cinco roles",
      resumen:
        "Superadministrador, Editor de Comunicaciones, Editor Académico, Editor de Admisiones y Editor de Talento Humano.",
      bloques: [
        {
          t: "p",
          texto:
            "Cada persona del colegio entra con un rol. El rol decide **qué secciones aparecen en su menú lateral**, y lo que no aparece tampoco se puede abrir escribiendo la dirección a mano. La única excepción es **Fechas de matrículas**: no sale en el menú del Editor de Comunicaciones, pero sí puede abrirla desde el enlace que hay dentro del editor de las páginas de matrículas, porque ese banner se ve en páginas que él mantiene.",
        },
        {
          t: "tabla",
          encabezados: ["Rol", "Puede entrar a", "No tiene acceso a"],
          filas: [
            [
              "Superadministrador",
              "Todo el panel, sin excepción",
              "—",
            ],
            [
              "Editor de Comunicaciones",
              "Contenido completo: páginas, notificaciones, cronograma, galería, documentos, reconocimientos, formularios (contactos, quejas y consultas de admisión) y sus plantillas de correo",
              "Admisiones, Usuarios, Configuración —salvo Fechas de matrículas— y **las postulaciones de empleo**",
            ],
            [
              "Editor Académico",
              "Las mismas páginas y módulos que Comunicaciones",
              "Formularios y sus respuestas, Vacantes, Admisiones, Usuarios y Configuración",
            ],
            [
              "Editor de Admisiones",
              "Módulo de Admisiones completo + dos secciones de Configuración: Documentos de admisión y Fechas de matrículas",
              "Contenido del sitio, Usuarios y el resto de Configuración",
            ],
            [
              "Editor de Talento Humano",
              "Solo «Trabaja con nosotros»: esa página, las Vacantes, el formulario de postulación con sus respuestas y su correo de confirmación",
              "El resto del sitio, los mensajes de contacto, las quejas, las solicitudes de admisión, Usuarios y Configuración",
            ],
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "Una misma persona puede tener **más de un rol**. Por ejemplo, alguien de secretaría puede ser Editor de Comunicaciones y Editor de Admisiones a la vez; verá la suma de ambos permisos.",
        },
      ],
    },
    {
      id: "quien-hace-que",
      titulo: "Quién debería tener cada rol",
      resumen: "Recomendación práctica para repartir los roles en el colegio.",
      bloques: [
        {
          t: "campos",
          items: [
            {
              campo: "Superadministrador",
              desc: "**Una o dos personas como máximo.** Es el único rol que crea usuarios, cambia colores, correos, menús y puede eliminar páginas y solicitudes. Normalmente: la persona responsable de la web y un respaldo.",
            },
            {
              campo: "Editor de Comunicaciones",
              desc: "Marketing / comunicación. Publica noticias, avisos, fotos, reconocimientos y actualiza textos de las páginas.",
            },
            {
              campo: "Editor Académico",
              desc: "Coordinación académica. Mismos permisos que Comunicaciones; existe como rol aparte para saber quién hizo cada cambio.",
            },
            {
              campo: "Editor de Admisiones",
              desc: "El equipo de admisiones y secretaría. Gestiona solicitudes de principio a fin, sin poder alterar el resto del sitio.",
            },
            {
              campo: "Editor de Talento Humano",
              desc: "Quien contrata en el colegio. Publica las vacantes y lee las postulaciones que llegan. **Es el rol que hay que darle, y no Editor de Comunicaciones**: con Comunicaciones vería también los mensajes de las familias y las solicitudes de admisión.",
            },
          ],
        },
        {
          t: "nota",
          tono: "tip",
          texto:
            "Da siempre **el rol más pequeño que permita hacer el trabajo**. No es desconfianza: reduce la posibilidad de un cambio accidental en una parte del sitio que esa persona no maneja.",
        },
      ],
    },
    {
      id: "zonas-peligrosas",
      titulo: "Las acciones reservadas al Superadministrador",
      resumen: "Eliminar páginas, eliminar solicitudes, crear usuarios y toda la configuración global.",
      bloques: [
        {
          t: "p",
          texto:
            "Algunas acciones no se pueden deshacer. Por eso están detrás del rol de Superadministrador y, dentro del panel, dentro de un bloque marcado como **Zona peligrosa**:",
        },
        {
          t: "lista",
          items: [
            "**Eliminar una página** — la ruta pública deja de funcionar de inmediato.",
            "**Eliminar una solicitud de admisión** — borra sus datos, su historial y sus archivos, para siempre.",
            "**Crear, editar o desactivar usuarios** del panel.",
            "**Configuración global**: marca, colores, contacto, correos, integraciones, menús, footer, SEO y chatbot.",
          ],
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "Ante la duda, **nunca elimines: despublica**. Una página despublicada desaparece del sitio pero conserva todo su contenido y se puede volver a publicar en un clic.",
        },
      ],
    },
  ],
};
