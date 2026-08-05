-- ============================================================
-- Migración 072 — Corregir el slug de la subcategoría «Ciencia y Tech».
--
-- PROBLEMA: la página vive en /reconocimientos/academicos/ORATORIA pero se
-- titula «Ciencia y Tech», lleva icono de microscopio y todo su contenido
-- habla de proyectos científicos («Nuestros logros en Ciencia y Tecnología»,
-- «Proyectos premiados»).
--
-- El origen está en el seed de la migración 035, que insertó la fila con
-- slug 'oratoria' y nombre 'Ciencia y Tech' — un slug copiado de otra fila.
-- En el seed anterior (034) esa misma subcategoría se llamaba 'ciencia'.
--
-- Lo que está mal es la DIRECCIÓN, no el título: el contenido es coherente
-- consigo mismo, solo la URL miente. Una familia que llega por buscador a una
-- dirección que dice «oratoria» y encuentra proyectos de ciencia se
-- desconcierta, y de paso el buscador indexa la página con una palabra clave
-- que no le corresponde.
--
-- La redirección permanente desde la dirección vieja se declara en
-- next.config.ts, para que ningún enlace ya compartido quede roto.
--
-- Detectado en la auditoría de enlaces del 2026-08-04.
--
-- IDEMPOTENTE: solo actúa si el slug viejo sigue existiendo.
-- ============================================================

UPDATE reconocimientos_subcategorias sub
SET slug = 'ciencia-y-tech'
FROM reconocimientos_categorias cat
WHERE sub.categoria_id = cat.id
  AND cat.slug = 'academicos'
  AND sub.slug = 'oratoria'
  AND NOT EXISTS (
    SELECT 1
    FROM reconocimientos_subcategorias otra
    WHERE otra.categoria_id = cat.id
      AND otra.slug = 'ciencia-y-tech'
  );
