-- ============================================================
-- Migración 039 — Banco de archivos reutilizables para Admisiones
-- Backoffice Atenas — Sprint mediano (sesión 32)
--
-- Crea el catálogo de archivos (PDFs, imágenes, docx) que el equipo de
-- admisiones puede REUTILIZAR cuando manda correos automáticos a los
-- postulantes. Antes había que subir el mismo PDF a cada solicitud
-- individualmente. Ahora se sube UNA vez al banco, y se puede:
--
--   1. Asociar a UNA plantilla de correo (estado del pipeline) → se
--      adjunta automáticamente cada vez que ese estado se aplique.
--   2. Asociar a UNA solicitud específica → se adjunta al próximo
--      correo de esa solicitud (caso "documento personalizado").
--
-- 3 tablas:
--   - admisiones_archivos_banco       : catálogo (1 fila por archivo)
--   - plantillas_correo_archivos      : pivote plantilla ↔ archivo
--   - solicitud_archivos_banco        : pivote solicitud ↔ archivo
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

-- ─── 1. Catálogo de archivos del banco ─────────────────────────
CREATE TABLE IF NOT EXISTS admisiones_archivos_banco (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        text NOT NULL,
  descripcion   text,
  /** Path interno en el bucket `admisiones-adjuntos`. */
  storage_path  text NOT NULL UNIQUE,
  /** URL pública (firmada o pública según política del bucket). */
  archivo_url   text NOT NULL,
  /** MIME type (ej. application/pdf). */
  tipo_mime     text,
  tamano_bytes  bigint,
  /**
   * Categoría libre para agrupar visualmente en la UI (ej. "general",
   * "matriculas", "egb-elemental"). Solo informativo, no afecta la
   * adjunción. Si null, aparece bajo "Sin categoría".
   */
  categoria     text,
  /** Si false, el archivo no se ofrece para seleccionar pero queda en BD. */
  activo        boolean NOT NULL DEFAULT true,
  orden         int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_admisiones_archivos_activo_orden
  ON admisiones_archivos_banco (activo, orden);
CREATE INDEX IF NOT EXISTS idx_admisiones_archivos_categoria
  ON admisiones_archivos_banco (categoria);

ALTER TABLE admisiones_archivos_banco ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admisiones_archivos_select" ON admisiones_archivos_banco;
CREATE POLICY "admisiones_archivos_select"
  ON admisiones_archivos_banco FOR SELECT TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

DROP POLICY IF EXISTS "admisiones_archivos_write" ON admisiones_archivos_banco;
CREATE POLICY "admisiones_archivos_write"
  ON admisiones_archivos_banco FOR ALL TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

-- ─── 2. Pivote plantilla ↔ archivo (adjuntos automáticos) ──────
-- Estos archivos se adjuntan SIEMPRE que la plantilla se envíe (es
-- decir, cada vez que una solicitud pase al estado de esa plantilla).
-- La PK de `plantillas_correo_admision` es `estado` (text), no un UUID.
CREATE TABLE IF NOT EXISTS plantillas_correo_archivos (
  estado        text NOT NULL REFERENCES plantillas_correo_admision(estado) ON DELETE CASCADE,
  archivo_id    uuid NOT NULL REFERENCES admisiones_archivos_banco(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (estado, archivo_id)
);

CREATE INDEX IF NOT EXISTS idx_plantillas_correo_archivos_estado
  ON plantillas_correo_archivos (estado);
CREATE INDEX IF NOT EXISTS idx_plantillas_correo_archivos_archivo
  ON plantillas_correo_archivos (archivo_id);

ALTER TABLE plantillas_correo_archivos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plantillas_correo_archivos_select" ON plantillas_correo_archivos;
CREATE POLICY "plantillas_correo_archivos_select"
  ON plantillas_correo_archivos FOR SELECT TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

DROP POLICY IF EXISTS "plantillas_correo_archivos_write" ON plantillas_correo_archivos;
CREATE POLICY "plantillas_correo_archivos_write"
  ON plantillas_correo_archivos FOR ALL TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

-- ─── 3. Pivote solicitud ↔ archivo (adjuntos a UNA solicitud) ──
-- Estos archivos se adjuntan SOLO al próximo correo de esa solicitud
-- específica. Complementan los adjuntos del catálogo de la plantilla.
CREATE TABLE IF NOT EXISTS solicitud_archivos_banco (
  solicitud_id  uuid NOT NULL REFERENCES solicitudes_admision(id) ON DELETE CASCADE,
  archivo_id    uuid NOT NULL REFERENCES admisiones_archivos_banco(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (solicitud_id, archivo_id)
);

CREATE INDEX IF NOT EXISTS idx_solicitud_archivos_banco_solicitud
  ON solicitud_archivos_banco (solicitud_id);
CREATE INDEX IF NOT EXISTS idx_solicitud_archivos_banco_archivo
  ON solicitud_archivos_banco (archivo_id);

ALTER TABLE solicitud_archivos_banco ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "solicitud_archivos_banco_select" ON solicitud_archivos_banco;
CREATE POLICY "solicitud_archivos_banco_select"
  ON solicitud_archivos_banco FOR SELECT TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

DROP POLICY IF EXISTS "solicitud_archivos_banco_write" ON solicitud_archivos_banco;
CREATE POLICY "solicitud_archivos_banco_write"
  ON solicitud_archivos_banco FOR ALL TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_admisiones'));
