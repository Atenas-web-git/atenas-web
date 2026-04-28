-- Tabla de solicitudes de admisión
-- Ejecutar en: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS solicitudes_admision (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero          text UNIQUE NOT NULL,

  -- Paso 1: Estudiante
  est_nombres     text NOT NULL,
  est_apellidos   text NOT NULL,
  est_fecha_nac   text,
  est_nivel       text NOT NULL,

  -- Paso 2: Representante
  rep_nombres     text NOT NULL,
  rep_apellidos   text NOT NULL,
  rep_relacion    text,
  rep_correo      text NOT NULL,
  rep_telefono    text NOT NULL,

  -- Paso 3: Información adicional
  como_enterado   text,
  anio_ingreso    text,
  comentarios     text,

  -- Metadata
  estado          text NOT NULL DEFAULT 'pendiente',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Índice para búsquedas rápidas por número de seguimiento
CREATE INDEX IF NOT EXISTS idx_solicitudes_numero ON solicitudes_admision (numero);

-- Índice para filtrar por estado (pendiente / revisado / contactado)
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_admision (estado);

-- RLS: habilitar seguridad a nivel de fila
ALTER TABLE solicitudes_admision ENABLE ROW LEVEL SECURITY;

-- Política: cualquier visitante anónimo puede INSERT (enviar solicitud)
CREATE POLICY "Insertar solicitud pública"
  ON solicitudes_admision
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política: solo el rol autenticado (equipo interno) puede leer y actualizar
CREATE POLICY "Lectura interna"
  ON solicitudes_admision
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Actualización interna"
  ON solicitudes_admision
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
