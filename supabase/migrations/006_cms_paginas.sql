-- ============================================================
-- Migración 006 — CMS de Contenido: tabla paginas + imagenes + Storage
-- Backoffice Atenas — Fase 3 (arranque CMS)
-- Requiere: 001 + 002 + 003 + 004 + 005 ejecutadas
--
-- Diseño: una sola tabla `paginas` con JSONB `contenido` cuyo schema
-- depende de la plantilla seleccionada. Más simple que paginas+bloques
-- y suficiente para Nivel 2 (sin builder visual). Si en Fase 6 hacemos
-- drag&drop, refactorizamos a bloques entonces.
--
-- Plantillas soportadas (catálogo cerrado, fijo en código):
--   tpl_a_hero_texto    — Hero + texto institucional (Misión, Visión, ...)
--   tpl_b_hero_grid     — Hero + grid de tarjetas con icono (próxima sesión)
--   tpl_c_hero_pasos    — Hero + pasos numerados (próxima sesión)
--   tpl_d_hero_detalle  — Hero + tabla / detalle (próxima sesión)
--   tpl_e_hero_galeria  — Hero + galería (próxima sesión)
--
-- IDEMPOTENTE: re-ejecutable. Seed solo si tabla vacía.
-- ============================================================

-- ─── Tabla paginas ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS paginas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE paginas ADD COLUMN IF NOT EXISTS slug              text;
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS plantilla         text NOT NULL DEFAULT 'tpl_a_hero_texto';
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS titulo            text;
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS contenido         jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS meta_title        text;
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS meta_description  text;
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS og_image_url      text;
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS publicada         boolean NOT NULL DEFAULT false;
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS created_at        timestamptz NOT NULL DEFAULT now();
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS updated_at        timestamptz NOT NULL DEFAULT now();
ALTER TABLE paginas ADD COLUMN IF NOT EXISTS updated_by        uuid REFERENCES profiles(id);

-- Slug único (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_paginas_slug_unique
  ON paginas (lower(slug));

CREATE INDEX IF NOT EXISTS idx_paginas_publicada
  ON paginas (publicada);

CREATE INDEX IF NOT EXISTS idx_paginas_plantilla
  ON paginas (plantilla);

-- Constraint de plantillas válidas
ALTER TABLE paginas DROP CONSTRAINT IF EXISTS paginas_plantilla_check;
ALTER TABLE paginas
  ADD CONSTRAINT paginas_plantilla_check
  CHECK (plantilla IN (
    'tpl_a_hero_texto',
    'tpl_b_hero_grid',
    'tpl_c_hero_pasos',
    'tpl_d_hero_detalle',
    'tpl_e_hero_galeria'
  ));

ALTER TABLE paginas ENABLE ROW LEVEL SECURITY;

-- Lectura pública SOLO de páginas publicadas (alimenta el frontend público)
DROP POLICY IF EXISTS "paginas_select_public" ON paginas;
CREATE POLICY "paginas_select_public"
  ON paginas FOR SELECT
  TO anon, authenticated
  USING (publicada = true);

-- Lectura completa para admins (incluye borradores)
DROP POLICY IF EXISTS "paginas_select_admin" ON paginas;
CREATE POLICY "paginas_select_admin"
  ON paginas FOR SELECT
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );

-- Escritura: superadmin, editor_comm o editor_academico (la responsabilidad
-- por área se controla en código según el slug de la página)
DROP POLICY IF EXISTS "paginas_write_admin" ON paginas;
CREATE POLICY "paginas_write_admin"
  ON paginas FOR ALL
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );


-- ─── Tabla imagenes (catálogo reutilizable) ────────────────────
CREATE TABLE IF NOT EXISTS imagenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS url            text;
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS storage_path   text;
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS alt_text       text;
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS ancho          int;
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS alto           int;
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS tamano_bytes   int;
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS mime_type      text;
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS uploaded_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE imagenes ADD COLUMN IF NOT EXISTS uploaded_by    uuid REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_imagenes_uploaded_at
  ON imagenes (uploaded_at DESC);

ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "imagenes_select_public" ON imagenes;
CREATE POLICY "imagenes_select_public"
  ON imagenes FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "imagenes_write_admin" ON imagenes;
CREATE POLICY "imagenes_write_admin"
  ON imagenes FOR ALL
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );


-- ─── Storage bucket: contenido (público para servir imágenes) ─
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'contenido',
  'contenido',
  true,         -- público para servir imágenes vía URL directa
  10485760      -- 10 MB
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  public = EXCLUDED.public;

-- Lectura pública (cualquiera puede ver imágenes del sitio)
DROP POLICY IF EXISTS "contenido_storage_select" ON storage.objects;
CREATE POLICY "contenido_storage_select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'contenido');

DROP POLICY IF EXISTS "contenido_storage_insert" ON storage.objects;
CREATE POLICY "contenido_storage_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'contenido'
    AND (
      user_has_role('superadmin')
      OR user_has_role('editor_comm')
      OR user_has_role('editor_academico')
    )
  );

DROP POLICY IF EXISTS "contenido_storage_delete" ON storage.objects;
CREATE POLICY "contenido_storage_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'contenido'
    AND (
      user_has_role('superadmin')
      OR user_has_role('editor_comm')
      OR user_has_role('editor_academico')
    )
  );


-- ─── Trigger updated_at automático ─────────────────────────────
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_paginas_updated_at ON paginas;
CREATE TRIGGER trg_paginas_updated_at
  BEFORE UPDATE ON paginas
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- ─── Seed inicial — Misión y Visión (plantilla A) ──────────────
-- Solo siembra si las páginas no existen todavía (idempotente).
-- El contenido replica EXACTAMENTE el que está hardcodeado actualmente.

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'el-atenas/mision',
    'tpl_a_hero_texto',
    'Misión',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'QUIÉNES SOMOS',
        'title', 'Misión',
        'subtitle', 'El propósito que guía cada decisión de nuestra comunidad educativa.',
        'ghostText', 'MISIÓN'
      ),
      'seccion', jsonb_build_object(
        'badge', 'MISIÓN',
        'heading', 'Nuestra Misión',
        'paragraphs', jsonb_build_array(
          'Crecemos y aprendemos juntos, fortaleciendo nuestros principios y valores, desarrollando las capacidades y habilidades de nuestra comunidad de forma crítica y creativa para contribuir a un mundo mejor.',
          'Esta misión define el propósito compartido de toda la comunidad Atenas: estudiantes, docentes, familias y directivos trabajan juntos hacia un mismo horizonte.'
        ),
        'note', NULL,
        'imageSrc', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
        'imageAlt', 'Unidad Educativa Atenas'
      )
    ),
    'Misión — Unidad Educativa Atenas',
    'Crecemos y aprendemos juntos, fortaleciendo nuestros principios y valores para contribuir a un mundo mejor.',
    true
  ),
  (
    'el-atenas/vision',
    'tpl_a_hero_texto',
    'Visión',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'QUIÉNES SOMOS',
        'title', 'Visión',
        'subtitle', 'La imagen que inspira y define el horizonte de nuestra institución.',
        'ghostText', 'VISIÓN'
      ),
      'seccion', jsonb_build_object(
        'badge', 'VISIÓN',
        'heading', 'Nuestra Visión',
        'paragraphs', jsonb_build_array(
          'Somos la Organización responsable de la formación de personas felices e íntegras, con conciencia social, capacidades para triunfar y conocedores de su aporte para crear un mundo más pacífico.',
          'Esta visión nos impulsa a superar constantemente nuestros estándares educativos y a fortalecer el vínculo entre la institución, las familias y la comunidad.'
        ),
        'note', 'Visión institucional en actualización — se revisará el horizonte temporal para el nuevo ciclo estratégico.',
        'imageSrc', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
        'imageAlt', 'Unidad Educativa Atenas'
      )
    ),
    'Visión — Unidad Educativa Atenas',
    'Somos la organización responsable de la formación de personas felices e íntegras, con conciencia social y capacidades para triunfar.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
