import type { Seccion } from "../tipos";

/**
 * Documentación de la pantalla del paseo virtual (Contenido › Paseo virtual).
 * Si cambia la pantalla, cambia esto: es lo único que el colegio va a leer.
 */
export const PASEO: Seccion = {
  slug: "paseo-virtual",
  titulo: "Paseo virtual 360°",
  descripcion:
    "Los 63 espacios del recorrido por el campus: cómo se llaman, en qué zona están, en qué orden salen y cuáles se ven.",
  icono: "Compass",
  paraQuien: "Editor de Comunicaciones · Superadministrador",
  articulos: [
    {
      id: "que-es-el-paseo",
      titulo: "Qué es el paseo virtual",
      resumen: "Un recorrido en 360° por el campus, dentro del propio sitio.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Paseo virtual"] },
        {
          t: "p",
          texto:
            "Una familia que entra a **Paseo virtual 360°** ve una fotografía del campus que puede girar con el dedo, y unos círculos con una flecha que la llevan de un espacio a otro: del ingreso al lobby, del lobby a la biblioteca.",
        },
        {
          t: "p",
          texto:
            "Son **63 espacios** repartidos en siete zonas —Administrativo, Auditorio, Bloques E, C, P y A, y Zonas Recreativas—, con **229 accesos** entre ellos. Las fotos son las del recorrido anterior del colegio, tomadas en 2016.",
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "El paseo ya no vive en otra dirección de internet: es una página más del sitio, con la misma imagen y el mismo menú.",
        },
      ],
    },
    {
      id: "editar-un-espacio",
      titulo: "Cambiar el nombre o la descripción de un espacio",
      resumen: "Lo que se lee bajo el recorrido y en los accesos que llevan a ese espacio.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Paseo virtual", "el espacio"] },
        {
          t: "campos",
          items: [
            {
              campo: "Nombre del espacio",
              desc: "Cómo se llama. Sale debajo de la foto cuando alguien ya entró a ese espacio, y en la lista de este panel.",
            },
            {
              campo: "Descripción",
              desc: "Opcional. Una o dos frases que se leen debajo del recorrido cuando alguien entra a ese espacio.",
            },
            {
              campo: "Zona",
              desc: "El bloque del campus al que pertenece. Agrupa los espacios en la lista.",
            },
            {
              campo: "Orden",
              desc: "En qué posición aparece dentro de su zona. Del 1 al 99, de menor a mayor.",
            },
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "El texto que se lee **al pasar el dedo por un acceso** es otro y **no se cambia desde aquí**: va con el acceso, no con el espacio. Por eso un mismo sitio puede aparecer como «Área de juegos Inicial» arriba y como «Área de juegos de inicial» en un acceso. Si quieres unificar los dos, escríbenos: el de los accesos lo cambiamos nosotros.",
        },
      ],
    },
    {
      id: "esconder-un-espacio",
      titulo: "Esconder un espacio del recorrido",
      resumen: "Cómo sacar un espacio de la vista sin borrar nada, y qué arrastra.",
      bloques: [
        {
          t: "p",
          texto:
            "Dentro de cada espacio hay un botón **Esconder del paseo**. El espacio deja de verse, su fotografía deja de servirse y **los accesos que llevaban a él desaparecen** de los demás espacios.",
        },
        {
          t: "pasos",
          items: [
            "Entra al espacio desde la lista.",
            "Lee el aviso: dice cuántos accesos llevan a ese espacio.",
            "Pulsa **Esconder del paseo**.",
            "Comprueba el resultado con **Ver el paseo**.",
          ],
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Esconder **no borra nada**: el espacio y sus accesos siguen guardados y vuelven en cuanto lo muestres otra vez.",
        },
        {
          t: "nota",
          tono: "peligro",
          texto:
            "Si escondes un espacio porque su fotografía **no debe verse**, avísanos igual. Esconderlo lo saca del recorrido de inmediato, pero una copia puede quedar guardada hasta un año en el navegador de quien ya la vio y en la memoria del sitio. Para borrarla de verdad hay que hacerlo nosotros.",
        },
      ],
    },
    {
      id: "reemplazar-la-foto",
      titulo: "Cambiar la fotografía de un espacio",
      resumen: "Subir una foto 360° nueva sin perder los accesos ni los textos.",
      bloques: [
        { t: "ruta", pasos: ["Contenido", "Paseo virtual", "el espacio", "Reemplazar la fotografía"] },
        {
          t: "p",
          texto:
            "Sirve para cuando un espacio se remodela o la foto se ve vieja. **Los accesos, el nombre y la descripción se quedan como están**: solo cambia la imagen.",
        },
        {
          t: "pasos",
          items: [
            "Entra al espacio desde la lista.",
            "En **Reemplazar la fotografía**, pulsa **Elegir la foto**.",
            "Busca en tu computadora la foto **360° equirectangular** que entrega la cámara: una sola imagen, del doble de ancha que de alta.",
            "Espera sin cerrar la pestaña: primero dice «Preparando la foto» y después «Subiendo».",
            "Cuando diga **«Listo»**, ábrelo con **Ver el paseo** para comprobarlo.",
          ],
        },
        {
          t: "nota",
          tono: "info",
          texto:
            "La preparación tarda **medio minuto** y ocurre en tu propia computadora, no en el servidor. Mientras no termine, el paseo sigue mostrando la foto anterior: si algo se corta a medias, no queda un espacio con media foto nueva.",
        },
        {
          t: "nota",
          tono: "aviso",
          texto:
            "Si la foto no es 360° —una foto normal de celular, por ejemplo— el panel lo dice y no la sube. La cámara 360° entrega el archivo correcto sin hacer nada especial.",
        },
      ],
    },
    {
      id: "lo-que-no-se-toca",
      titulo: "Lo que no se cambia desde el panel",
      resumen: "Los accesos entre espacios, y crear o borrar espacios.",
      bloques: [
        {
          t: "lista",
          items: [
            "**Mover un acceso** o crear uno nuevo. Sus posiciones vienen del recorrido original; para cambiarlas, escríbenos.",
            "**Crear o borrar espacios.** Un espacio nuevo necesita una fotografía 360°, que se toma con una cámara especial.",
          ],
        },
        {
          t: "p",
          texto:
            "En la ficha de cada espacio, abajo, está la lista de **a qué otros espacios se puede ir desde ahí**. Sirve para entender el recorrido antes de pedir un cambio.",
        },
      ],
    },
  ],
};
