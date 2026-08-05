-- ============================================================
-- Migración 073 — Arreglar los enlaces e imágenes rotos que viven en la BASE,
-- no en el código.
--
-- De la auditoría de enlaces del 2026-08-04 salieron varios destinos rotos. Se
-- corrigieron en el código, pero el código solo aporta los VALORES POR
-- DEFECTO: la home y el pie de página leen su contenido de la base, y lo
-- guardado gana. Sin esta migración, el arreglo no se ve.
--
-- Es la misma trampa que apareció al retirar el dorado: `layout.tsx` inyectaba
-- la paleta desde la base por encima del CSS. Conviene recordarla.
--
--   1. /academico       — enlazado desde la home. Esa ruta NO EXISTE; la
--                         landing real de Académico es /academico/niveles,
--                         que es además lo que el mega-menú usa como entrada
--                         general de la categoría desde la migración 067.
--   2. /facturacion     — enlazado desde el pie de TODAS las páginas. Es una
--                         de las URLs externas que el colegio nunca entregó.
--                         Se quita el enlace: un 404 en el pie de todo el
--                         sitio es peor que no tener el enlace. Cuando
--                         entreguen la dirección se vuelve a añadir desde
--                         Configuración › Footer, sin tocar código.
--   3. TRES fotos de Unsplash borradas de su servidor (verificado por HTTP:
--      devuelven 404). Estaban repartidas entre `paginas`,
--      `reconocimientos_subcategorias` y `reconocimientos_galeria_fotos`.
--      Se sustituyen por imágenes del mismo banco comprobadas como vivas.
--      Siguen siendo relleno: se reemplazarán por material real del colegio.
--
-- ⚠️ ORDEN: aplicar DESPUÉS de desplegar el código de esta tanda. El punto 1
-- deja de funcionar a medias si el default del código aún apunta a la ruta
-- vieja, y la migración 072 (que la acompaña) exige que sus redirects ya estén
-- en producción.
--
-- IDEMPOTENTE: cada UPDATE comprueba antes que haya algo que cambiar.
-- ============================================================

BEGIN;

-- ─── 1. /academico → /academico/niveles ───────────────────────
-- Se reemplaza sobre el JSON serializado porque el enlace puede estar en
-- cualquier tarjeta del contenido. La comilla de cierre evita tocar
-- "/academico/ib" o "/academico/niveles", que sí existen.
--
-- Nota: no alcanza a un enlace escrito dentro de un cuerpo HTML rico, porque
-- ahí las comillas van escapadas (href=\"/academico\"). No se encontró
-- ninguno; si apareciera, se corrige desde el panel.
UPDATE paginas
SET contenido = REPLACE(contenido::text, '"/academico"', '"/academico/niveles"')::jsonb
WHERE contenido::text LIKE '%"/academico"%';

-- ─── 2. Quitar «Facturación» del pie ──────────────────────────
-- `IS DISTINCT FROM` y no `<>`: con `<>`, un link sin clave `href` daría NULL
-- en la comparación y desaparecería del array sin aviso.
-- `WITH ORDINALITY` conserva el orden original de los enlaces.
UPDATE configuracion_global
SET value = jsonb_set(
      value,
      '{links}',
      COALESCE(
        (SELECT jsonb_agg(t.l ORDER BY t.ord)
         FROM jsonb_array_elements(value->'links') WITH ORDINALITY AS t(l, ord)
         WHERE t.l->>'href' IS DISTINCT FROM '/facturacion'),
        '[]'::jsonb
      )
    )
WHERE key = 'footer'
  AND value->'links' @> '[{"href":"/facturacion"}]'::jsonb;

-- ─── 3. Fotos borradas de Unsplash ────────────────────────────
-- Las tres viven en más de una tabla, así que se recorren todas las que
-- guardan imágenes de contenido.
UPDATE paginas
SET contenido = REPLACE(REPLACE(REPLACE(contenido::text,
      'photo-1523050854058-8df90110c9f1', 'photo-1580582932707-520aed937b7b'),
      'photo-1571260898936-4e3c6d30e9a9', 'photo-1580582932707-520aed937b7b'),
      'photo-1581093804475-577d72e13cba', 'photo-1522202176988-66273c2fd55f')::jsonb
WHERE contenido::text ~ 'photo-(1523050854058-8df90110c9f1|1571260898936-4e3c6d30e9a9|1581093804475-577d72e13cba)';

UPDATE reconocimientos_subcategorias
SET photo_src = REPLACE(REPLACE(REPLACE(photo_src,
      'photo-1523050854058-8df90110c9f1', 'photo-1580582932707-520aed937b7b'),
      'photo-1571260898936-4e3c6d30e9a9', 'photo-1580582932707-520aed937b7b'),
      'photo-1581093804475-577d72e13cba', 'photo-1522202176988-66273c2fd55f')
WHERE photo_src ~ 'photo-(1523050854058-8df90110c9f1|1571260898936-4e3c6d30e9a9|1581093804475-577d72e13cba)';

UPDATE reconocimientos_galeria_fotos
SET src = REPLACE(REPLACE(REPLACE(src,
      'photo-1523050854058-8df90110c9f1', 'photo-1580582932707-520aed937b7b'),
      'photo-1571260898936-4e3c6d30e9a9', 'photo-1580582932707-520aed937b7b'),
      'photo-1581093804475-577d72e13cba', 'photo-1522202176988-66273c2fd55f')
WHERE src ~ 'photo-(1523050854058-8df90110c9f1|1571260898936-4e3c6d30e9a9|1581093804475-577d72e13cba)';

COMMIT;
