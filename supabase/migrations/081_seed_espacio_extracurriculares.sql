-- ============================================================
-- Migración 081 — Séptimo espacio: /espacios/extracurriculares
-- Backoffice Atenas — sesión 51 (2026-08-14)
-- Requiere: 026_seed_espacios_plantilla_l.sql ejecutada
--
-- Siembra la ficha del séptimo espacio de desarrollo, las escuelas
-- permanentes de fútbol y básquet que pidió el colegio el 2026-07-27.
--
-- NO amplía ningún CHECK: `tpl_l_ficha_espacio` ya está permitido desde
-- la 026.
--
-- IDEMPOTENTE: si la página ya existe, NO se sobrescribe.
-- ============================================================
--
-- ⚠️ ESTA MIGRACIÓN VA DESPUÉS DEL DESPLIEGUE, no antes.
--
-- Es la única del proyecto donde el orden va al revés del habitual, así
-- que conviene leer por qué. La ruta pública `/espacios/[espacio]`
-- resuelve el slug contra `ESPACIOS`, el catálogo de `src/data/espacios.ts`,
-- y si no lo encuentra devuelve `notFound()`. Si esta fila entra antes de
-- que el código con el séptimo espacio esté en producción, la página queda
-- publicada e indexada por el buscador del sitio —`search_global` lee de
-- `paginas WHERE publicada = true`— apuntando a un 404.
--
-- Código primero, esta migración después.
--
-- ============================================================
--
-- SOBRE EL CONTENIDO: está deliberadamente escueto y NO se inventó nada.
--
-- Lo único que dijo el colegio es que existen escuelas permanentes de
-- fútbol y de básquet. No hay horarios, edades, costos, cupos,
-- entrenadores ni instalaciones porque nadie los ha entregado, y este
-- proyecto ya publicó datos de relleno una vez.
--
-- Por eso `nota` va vacía y `ficha` va como arreglo vacío: las secciones
-- se saltan solas cuando no hay contenido. En cuanto el colegio entregue
-- lo suyo se llena desde el panel, sin volver a tocar SQL.
--
-- Y por eso hace falta esta migración en vez de crear la página desde el
-- panel: `tpl_l_ficha_espacio` está en `PLANTILLAS_BLOQUEADAS_NUEVAS`
-- (`contenido/paginas/actions.ts`), así que el formulario de «página
-- nueva» la rechaza. Las seis hermanas existen porque las sembró la 026,
-- no porque alguien las creara a mano. Una vez sembrada, sí es editable.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'espacios/extracurriculares',
    'tpl_l_ficha_espacio',
    'Escuelas permanentes',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'ESPACIOS DE DESARROLLO',
        -- «Extracurriculares» de una pieza no cabe en el hero a 375px: el
        -- clamp del título tiene 38px de mínimo y la palabra se pasa por
        -- doce píxeles. Se abrevia igual que «Ed. Física».
        'title',     'Escuelas permanentes',
        'subtitle',  'Escuelas permanentes que funcionan durante todo el año lectivo, fuera del horario de clases.',
        'ghostText', 'ESCUELAS'
      ),
      'detalle', jsonb_build_object(
        'badge',   'Extracurriculares',
        'heading', 'Formación que sigue después de la última hora de clase',
        'paragraphs', jsonb_build_array(
          'Las escuelas permanentes son programas que funcionan a lo largo de todo el año lectivo, fuera del horario regular, y están abiertas a los estudiantes que quieran profundizar en una disciplina más allá de la clase.',
          'Hoy el colegio sostiene escuelas de fútbol y de básquet.'
        ),
        'tags', jsonb_build_array('Fútbol', 'Básquet'),
        'nota', '',
        'ficha', jsonb_build_array(),
        'photoSrc', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80',
        'photoAlt', 'Estudiantes en entrenamiento deportivo'
      ),
      'actividades', jsonb_build_object(
        'title',        'Escuelas abiertas',
        'photoSrc',     'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80',
        'photoCaption', 'Escuelas permanentes — Atenas',
        'items', jsonb_build_array(
          jsonb_build_object('icon', '⚽', 'title', 'Escuela de fútbol',  'desc', 'Entrenamiento continuo durante el año lectivo.'),
          jsonb_build_object('icon', '🏀', 'title', 'Escuela de básquet', 'desc', 'Entrenamiento continuo durante el año lectivo.')
        )
      )
    ),
    'Extracurriculares — Escuelas permanentes | Atenas',
    'Las escuelas permanentes de la Unidad Educativa Atenas ofrecen formación deportiva continua, fuera del horario regular de clases.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
