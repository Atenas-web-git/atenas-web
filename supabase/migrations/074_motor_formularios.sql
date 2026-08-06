-- ============================================================
-- Migración 074 — Motor de formularios.
--
-- QUÉ RESUELVE
--
-- Hoy el sitio tiene cinco formularios y los cinco están escritos a mano:
-- admisiones, consulta por nivel, contactos, quejas y trabaja-con-nosotros.
-- Cada uno con su endpoint, su validación repetida y su correo incrustado.
-- Añadir un campo es una migración más código, y el colegio no puede tocar
-- nada sin llamarnos.
--
-- Peor: SOLO admisiones guarda algo. Contactos, quejas y trabaja-con-nosotros
-- se envían por correo y nada más. Como el envío es «best effort» —se traga
-- los errores y responde 200 igual— cada fallo de correo es un contacto
-- perdido sin ningún rastro. Eso solo lo arregla guardar en base.
--
-- Estas dos tablas permiten definir un formulario desde el panel, insertarlo
-- en cualquier página y recibir las respuestas en una bandeja.
--
-- POR QUÉ LAS RESPUESTAS SON DATOS SENSIBLES
--
-- El primer uso real es «Trabaja con nosotros», que hoy el colegio maneja en
-- un Google Sites. Ese proceso ya recoge cédula, fecha de nacimiento, género
-- y condición de discapacidad —dato sensible según la LOPDP— y además pide
-- subir un audio de presentación a los docentes de inglés.
--
-- Por eso:
--   · el bucket de archivos es PRIVADO (el bucket `contenido` es público y
--     serviría los CV de los postulantes a cualquiera con la URL);
--   · las dos tablas quedan cerradas a `anon` y `authenticated`, y solo se
--     leen desde el servidor con service_role;
--   · borrar un formulario con respuestas está PROHIBIDO por la clave
--     foránea (RESTRICT, no CASCADE): un clic no puede llevarse por delante
--     el historial de postulaciones. Para retirar un formulario se desactiva.
--
-- ACCESO: RLS activo y CERO políticas, igual que `intentos_publicos`. Con esa
-- combinación anon y authenticated no pueden leer ni escribir nada. Los GRANT
-- se revocan explícitamente porque los default privileges de Supabase
-- conceden permisos a esos roles al crear la tabla, y revocar solo a PUBLIC
-- no los quita (lección de la migración 068).
-- ============================================================

BEGIN;

-- ─── Definición de formularios ────────────────────────────────

CREATE TABLE IF NOT EXISTS formularios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE formularios ADD COLUMN IF NOT EXISTS slug          text;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS nombre        text;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS descripcion_interna text;

-- Lo que ve el visitante
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS titulo        text;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS subtitulo     text;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS texto_boton   text NOT NULL DEFAULT 'Enviar';
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS titulo_exito  text NOT NULL DEFAULT 'Recibido';
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS texto_exito   text NOT NULL DEFAULT 'Gracias. Hemos recibido tu información y te contactaremos.';
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS aviso_legal   text;

-- Los campos. Array JSON: cada elemento es {key, tipo, etiqueta, ayuda,
-- obligatorio, opciones[], maxLength, min, max, acepta[], maxMb}.
-- El catálogo de tipos vive en src/lib/formularios/tipos.ts.
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS campos        jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Notificación interna
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS notificar_a   text[] NOT NULL DEFAULT '{}';
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS asunto        text;

-- De qué buzón sale el correo. Son los presets que ya existen en
-- Configuración › Correos, así que el remitente y la firma no se definen dos
-- veces: una postulación de empleo debe salir del buzón de talento humano y
-- una consulta general del de información.
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS preset_correo text NOT NULL DEFAULT 'contactos';

-- Confirmación al remitente. `campo_correo` dice cuál de los campos del
-- formulario contiene su dirección; sin eso no hay a dónde responder.
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS campo_correo  text;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS confirmacion_activa boolean NOT NULL DEFAULT true;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS confirmacion_asunto text;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS confirmacion_cuerpo text;

ALTER TABLE formularios ADD COLUMN IF NOT EXISTS activo        boolean NOT NULL DEFAULT true;
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS updated_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE formularios ADD COLUMN IF NOT EXISTS updated_by    uuid REFERENCES profiles(id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_formularios_slug_unique
  ON formularios (lower(slug));

-- ─── Respuestas ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS formulario_respuestas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

-- RESTRICT, no CASCADE: ver cabecera.
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS formulario_id uuid
  REFERENCES formularios(id) ON DELETE RESTRICT;

-- Correlativo por formulario, para poder referirse a una respuesta por
-- teléfono sin leer un uuid en voz alta.
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS numero    int;

-- Las respuestas, con la key del campo como clave.
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS datos     jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Archivos subidos: [{key, filename, storage_path, size_bytes, mime_type}].
-- La ruta, no la URL: el bucket es privado y las URLs se firman al abrirlas.
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS archivos  jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Pipeline mínimo. Suficiente para que «Trabaja con nosotros» se gestione
-- por etapas sin construir un segundo pipeline entero.
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS estado    text NOT NULL DEFAULT 'nueva';
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS nota_interna text;

ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS updated_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS updated_by    uuid REFERENCES profiles(id);

-- Se registra si el correo salió. Hoy los envíos son best-effort y un fallo
-- es invisible; con esto la bandeja puede marcar «guardada pero sin avisar».
ALTER TABLE formulario_respuestas ADD COLUMN IF NOT EXISTS correo_enviado boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_respuestas_formulario
  ON formulario_respuestas (formulario_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_respuestas_estado
  ON formulario_respuestas (formulario_id, estado);

CREATE UNIQUE INDEX IF NOT EXISTS idx_respuestas_numero_unico
  ON formulario_respuestas (formulario_id, numero);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'formulario_respuestas_estado_check'
  ) THEN
    ALTER TABLE formulario_respuestas
      ADD CONSTRAINT formulario_respuestas_estado_check
      CHECK (estado IN ('nueva', 'en_proceso', 'atendida', 'descartada'));
  END IF;
END $$;

-- ─── Alta de respuesta con correlativo ────────────────────────
--
-- El número y el INSERT van en la MISMA función a propósito. Calcular el
-- correlativo aparte —una llamada que devuelve max+1 y otra que inserta— no
-- sirve: cada llamada a PostgREST abre y cierra su propia transacción, así
-- que el advisory lock se suelta antes de insertar y dos envíos simultáneos
-- reciben el mismo número. Es la misma trampa que ya apareció en el contador
-- de intentos de la migración 069.
--
-- Aquí el lock se toma dentro de la transacción que también inserta, y se
-- suelta al confirmar. El índice único (formulario_id, numero) es la red por
-- si esto se rompiera algún día.

CREATE OR REPLACE FUNCTION insertar_respuesta_formulario(
  p_formulario_id uuid,
  p_datos jsonb,
  p_archivos jsonb
)
RETURNS TABLE (id uuid, numero int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_numero int;
  v_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('formulario_respuesta:' || p_formulario_id::text));

  SELECT COALESCE(MAX(r.numero), 0) + 1
    INTO v_numero
    FROM formulario_respuestas r
   WHERE r.formulario_id = p_formulario_id;

  INSERT INTO formulario_respuestas (formulario_id, numero, datos, archivos)
  VALUES (p_formulario_id, v_numero, COALESCE(p_datos, '{}'::jsonb), COALESCE(p_archivos, '[]'::jsonb))
  RETURNING formulario_respuestas.id INTO v_id;

  RETURN QUERY SELECT v_id, v_numero;
END;
$$;

-- Cerrar la función. REVOKE a PUBLIC no basta: los default privileges de
-- Supabase conceden EXECUTE a anon y authenticated de forma explícita y esos
-- grants sobreviven al revoke de PUBLIC. Y esta función escribe, así que
-- dejarla abierta permitiría llenar la tabla desde el navegador.
REVOKE ALL ON FUNCTION insertar_respuesta_formulario(uuid, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION insertar_respuesta_formulario(uuid, jsonb, jsonb) TO service_role;

-- ─── touch updated_at ─────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_formularios_updated ON formularios;
CREATE TRIGGER trg_formularios_updated
  BEFORE UPDATE ON formularios
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_formulario_respuestas_updated ON formulario_respuestas;
CREATE TRIGGER trg_formulario_respuestas_updated
  BEFORE UPDATE ON formulario_respuestas
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ─── Cierre de acceso ─────────────────────────────────────────

ALTER TABLE formularios ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulario_respuestas ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE formularios FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE formulario_respuestas FROM PUBLIC, anon, authenticated;

-- ─── Enganche con las páginas del CMS ─────────────────────────
--
-- El formulario se apunta desde la página, no se incrusta en su `contenido`.
-- Así se inserta en cualquiera de las 20 plantillas con un solo control en la
-- cabecera común del editor, en vez de añadir un campo a los 20 editores.
--
-- SET NULL: si se retira un formulario, la página se queda sin él en vez de
-- impedir el borrado.

ALTER TABLE paginas ADD COLUMN IF NOT EXISTS formulario_id uuid
  REFERENCES formularios(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_paginas_formulario
  ON paginas (formulario_id) WHERE formulario_id IS NOT NULL;

-- ─── Bucket privado para los archivos de los postulantes ──────
--
-- PRIVADO a propósito. El bucket `contenido` es público —sirve las imágenes
-- del sitio por URL directa— y poner ahí un CV lo dejaría accesible a
-- cualquiera que tenga o adivine la ruta.

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'formularios-archivos',
  'formularios-archivos',
  false,
  10485760  -- 10 MB: el audio de presentación de los docentes de inglés no
            -- cabe en los 5 MB que usa admisiones para documentos escaneados.
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  public = EXCLUDED.public;

-- Quien gestiona formularios puede ver y borrar los archivos. La SUBIDA no
-- lleva política: la hace el servidor con service_role al recibir el envío,
-- porque quien rellena el formulario es anónimo y no debe poder escribir
-- directamente en el bucket.
DROP POLICY IF EXISTS "formularios_archivos_select" ON storage.objects;
CREATE POLICY "formularios_archivos_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'formularios-archivos'
    AND (user_has_role('superadmin') OR user_has_role('editor_comm'))
  );

DROP POLICY IF EXISTS "formularios_archivos_delete" ON storage.objects;
CREATE POLICY "formularios_archivos_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'formularios-archivos'
    AND (user_has_role('superadmin') OR user_has_role('editor_comm'))
  );

COMMIT;
