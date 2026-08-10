-- ============================================================
-- Migración 079 — Rol de Talento Humano y área por formulario
-- Sesión 48 (2026-08-10).
--
-- Hasta hoy la bandeja de formularios era TODO O NADA: quien entraba en
-- Contenido › Formularios veía los cinco y podía abrir cualquier bandeja.
-- Para que talento humano administrase las vacantes había que darle
-- «Editor de Comunicaciones», y con eso veía también los mensajes de
-- contacto, las quejas y las consultas de admisión —con nombres de familias
-- y datos de menores—. Y al revés: quien edita textos del sitio pasaba a ver
-- hojas de vida, cédulas y datos de discapacidad de los postulantes.
--
-- La solución es dar DUEÑO a cada formulario. Se elige una columna `area`
-- —y no un booleano «es de empleo»— porque el siguiente rol que pida el
-- colegio se resuelve añadiendo un valor, no rehaciendo el filtro.
--
-- Ojo al aplicarla: las respuestas YA guardadas quedan detrás de este filtro.
-- Por eso el área de los formularios existentes se asigna en esta misma
-- migración; si no, la bandeja de admisiones desaparecería para su editor.
--
-- IDEMPOTENTE.
-- ============================================================

-- ─── 1. El rol ──────────────────────────────────────────────
-- Espejo de supabase/seed/roles.sql y de src/lib/auth/types.ts. Va en la
-- migración —y no solo en el seed— porque el seed se ejecuta a mano una vez
-- y este rol tiene que existir sí o sí para que la pantalla de Usuarios
-- pueda asignarlo.
INSERT INTO roles (slug, name, description) VALUES
  ('editor_talento', 'Editor de Talento Humano',
   'Gestiona «Trabaja con nosotros»: la página, las vacantes de empleo, el formulario de postulación con su bandeja de respuestas y la plantilla de correo de esa sección. No ve el resto del sitio, ni los mensajes de contacto, ni las quejas, ni las solicitudes de admisión.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ─── 2. El área de cada formulario ──────────────────────────
ALTER TABLE formularios
  ADD COLUMN IF NOT EXISTS area text NOT NULL DEFAULT 'comunicaciones';

-- Un formulario nuevo nace en 'comunicaciones': es el área más restrictiva
-- posible en la práctica, porque es la que ya veía todo el mundo.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'formularios_area_valida'
  ) THEN
    ALTER TABLE formularios
      ADD CONSTRAINT formularios_area_valida
      CHECK (area IN ('comunicaciones', 'admisiones', 'talento'));
  END IF;
END $$;

COMMENT ON COLUMN formularios.area IS
  'Quién es dueño del formulario y de su bandeja: comunicaciones | admisiones | talento. '
  'Determina qué rol lo ve en el panel. Espejo de src/lib/auth/areas.ts.';

-- Reparto de los formularios que ya existen. Se hace por slug y no por
-- nombre: el colegio puede renombrar un formulario desde el panel.
UPDATE formularios SET area = 'talento'       WHERE slug = 'postulacion-empleo';
UPDATE formularios SET area = 'admisiones'    WHERE slug = 'consulta-admisiones';
UPDATE formularios SET area = 'comunicaciones' WHERE slug IN ('contactos', 'quejas-sugerencias');

CREATE INDEX IF NOT EXISTS formularios_area_idx ON formularios (area);

-- ─── 3. Los adjuntos ────────────────────────────────────────
-- El bucket es privado y el panel firma las descargas con service_role, así
-- que estas políticas son la segunda línea de defensa, no la primera. Aun
-- así se ajustan: si mañana algo lee el bucket con la sesión del usuario, el
-- corte por área tiene que valer también ahí.
--
-- La ruta de un adjunto es «<slug-del-formulario>/<uuid>_<nombre>», así que
-- la primera carpeta identifica de qué formulario es el archivo.
--
-- La política NO puede consultar `formularios` directamente: esa tabla tiene
-- RLS activada sin ninguna política y con los permisos revocados a
-- `authenticated`, así que el SELECT no devolvería nada y la política
-- denegaría siempre —callada, que es la peor forma de fallar—. Hace falta una
-- función SECURITY DEFINER que lea el área por su cuenta.
CREATE OR REPLACE FUNCTION area_de_formulario(slug_formulario text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT area FROM formularios WHERE slug = slug_formulario;
$$;

-- Los privilegios por defecto dan EXECUTE a PUBLIC, y PUBLIC incluye a `anon`,
-- que es la clave que viaja en el navegador. Revocar de PUBLIC no basta si
-- alguna vez se concedió aparte: se revoca de los tres y se concede solo al
-- usuario con sesión.
REVOKE ALL ON FUNCTION area_de_formulario(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION area_de_formulario(text) FROM anon;
REVOKE ALL ON FUNCTION area_de_formulario(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION area_de_formulario(text) TO authenticated;

DROP POLICY IF EXISTS "formularios_archivos_select" ON storage.objects;
CREATE POLICY "formularios_archivos_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'formularios-archivos'
    AND (
      user_has_role('superadmin')
      OR (
        user_has_role('editor_comm')
        AND area_de_formulario((storage.foldername(name))[1])
            IN ('comunicaciones', 'admisiones')
      )
      OR (
        user_has_role('editor_talento')
        AND area_de_formulario((storage.foldername(name))[1]) = 'talento'
      )
    )
  );

DROP POLICY IF EXISTS "formularios_archivos_delete" ON storage.objects;
CREATE POLICY "formularios_archivos_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'formularios-archivos'
    AND (
      user_has_role('superadmin')
      OR (
        user_has_role('editor_comm')
        AND area_de_formulario((storage.foldername(name))[1])
            IN ('comunicaciones', 'admisiones')
      )
      OR (
        user_has_role('editor_talento')
        AND area_de_formulario((storage.foldername(name))[1]) = 'talento'
      )
    )
  );

-- ─── 4. Comprobación ────────────────────────────────────────
DO $$
DECLARE
  sin_rol   integer;
  reparto   text;
BEGIN
  SELECT count(*) INTO sin_rol FROM roles WHERE slug = 'editor_talento';
  IF sin_rol <> 1 THEN
    RAISE EXCEPTION 'El rol editor_talento no quedó creado.';
  END IF;

  SELECT string_agg(area || '=' || n, ', ' ORDER BY area)
    INTO reparto
    FROM (SELECT area, count(*) AS n FROM formularios GROUP BY area) t;

  RAISE NOTICE 'Migración 079 aplicada. Reparto de formularios por área: %', reparto;
END $$;
