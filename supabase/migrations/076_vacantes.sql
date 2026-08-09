-- ============================================================
-- Migración 076 — Vacantes de «Trabaja con nosotros».
--
-- QUÉ RESUELVE
--
-- La página `/trabaja-con-nosotros` del sitio es un hero, tres tarjetas de
-- valores y un formulario. No tiene vacantes. Pero el colegio SÍ publica
-- vacantes: lo hace en un Google Sites aparte
-- (sites.google.com/atenas.edu.ec/atenas-talent-pool), con un cargo en
-- concurso, dos vacantes abiertas y un banco de aspirantes.
--
-- O sea: el sitio que les construimos no sirve para lo que de verdad hacen, y
-- por eso siguen manteniendo una página por fuera. Esta tabla trae ese tablón
-- al panel, para que talento humano abra y cierre vacantes sin llamar a nadie.
--
-- LA ESTRUCTURA IMITA LA SUYA A PROPÓSITO
--
-- Los campos son los mismos que ya usan al redactar una vacante: descripción,
-- «Perfil requerido» con Formación y Experiencia, y una lista de
-- «Habilidades/Conocimientos». Rellenarlo debería parecerse a lo que ya
-- escriben, no a un formulario nuevo que hay que aprender.
--
-- CADA VACANTE LLEVA SU FORMULARIO
--
-- No comparten uno solo porque no piden lo mismo: a los docentes de inglés se
-- les pide un audio de presentación que a los demás no. Con un formulario por
-- vacante, cada una pide lo suyo y las respuestas llegan separadas a su propia
-- bandeja.
--
-- ACCESO: RLS activo. Lectura pública SOLO de las vacantes activas —son
-- ofertas de empleo, están para que las lea cualquiera—. Escritura, únicamente
-- desde el servidor con service_role.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS vacantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS slug        text;
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS titulo      text;

-- Frase corta para la tarjeta del listado.
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS resumen     text;

-- 'concurso'  → «Cargos actuales en concurso», el bloque destacado
-- 'abierta'   → «Otras vacantes abiertas»
-- 'banco'     → «Banco de aspirantes», para quien no encaja en ninguna
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS categoria   text NOT NULL DEFAULT 'abierta';

-- Cuerpo de la oferta. Párrafos separados por línea en blanco.
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS descripcion text;

-- Perfil requerido, con los mismos rótulos que usa el colegio.
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS formacion   text;
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS experiencia text;
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS habilidades text[] NOT NULL DEFAULT '{}';

ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS imagen_url  text;

-- El formulario del motor con el que se postula a ESTA vacante.
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS formulario_id uuid
  REFERENCES formularios(id) ON DELETE SET NULL;

ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS activa      boolean NOT NULL DEFAULT true;
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS orden       int NOT NULL DEFAULT 0;

-- Fecha en la que deja de recibir postulaciones. Opcional: si está vacía, la
-- vacante sigue abierta hasta que alguien la desactive a mano.
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS cierra_en   date;

ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS created_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS updated_by  uuid REFERENCES profiles(id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_vacantes_slug_unique
  ON vacantes (lower(slug));

CREATE INDEX IF NOT EXISTS idx_vacantes_listado
  ON vacantes (activa, categoria, orden);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'vacantes_categoria_check'
  ) THEN
    ALTER TABLE vacantes
      ADD CONSTRAINT vacantes_categoria_check
      CHECK (categoria IN ('concurso', 'abierta', 'banco'));
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_vacantes_updated ON vacantes;
CREATE TRIGGER trg_vacantes_updated
  BEFORE UPDATE ON vacantes
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ─── Acceso ───────────────────────────────────────────────────
--
-- A diferencia de `formularios`, aquí SÍ hay lectura pública: una oferta de
-- empleo no tiene nada que esconder y la página la lee cualquiera. Solo se
-- exponen las activas; los borradores y las cerradas no salen.

ALTER TABLE vacantes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vacantes_select_publicas" ON vacantes;
CREATE POLICY "vacantes_select_publicas"
  ON vacantes FOR SELECT
  TO anon, authenticated
  USING (activa = true);

-- La escritura no lleva política: se hace desde el servidor con service_role,
-- que salta la RLS. La autorización real son los hasRole de cada acción.
REVOKE INSERT, UPDATE, DELETE ON TABLE vacantes FROM PUBLIC, anon, authenticated;

COMMIT;
