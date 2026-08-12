-- ============================================================
-- Migración 080 — El año escolar en admisiones
-- Sesión 50 (2026-08-11).
--
-- La solicitud de admisión solo guardaba el NIVEL —cuatro opciones— y nunca el
-- año. Con eso no se puede hacer ninguna de las dos cosas que pidió el colegio
-- el 2026-07-27:
--
--   · llevar cupos por año, de Pre-Kinder a 3ro de bachillerato;
--   · avisar de que 2do y 3ro de bachillerato se tramitan presencialmente,
--     porque el formulario nunca supo a qué año aspira quien lo llena.
--
-- Se amplía lo que hay en vez de sustituirlo: `cupos_admision` sigue teniendo
-- sus filas por nivel y funcionando igual, y ahora admite además filas por año.
--
-- IDEMPOTENTE.
-- ============================================================

-- ─── 1. El año en la solicitud ──────────────────────────────
-- Nullable a propósito: las solicitudes que ya existen no lo tienen y no se
-- puede adivinar. El panel las muestra como «año no indicado».
ALTER TABLE solicitudes_admision
  ADD COLUMN IF NOT EXISTS est_grado text;

COMMENT ON COLUMN solicitudes_admision.est_grado IS
  'Año escolar al que aspira, dentro de est_nivel (ej. «3ro EGB», «2do de Bachillerato»). '
  'Nulo en las solicitudes anteriores al 2026-08-11. Catálogo en src/lib/admisiones/grados.ts.';

CREATE INDEX IF NOT EXISTS solicitudes_admision_grado_idx
  ON solicitudes_admision (est_grado);

-- ─── 2. Cupos por año ───────────────────────────────────────
-- La clave primaria era (nivel, ano_lectivo). Pasa a incluir el año escolar,
-- con cadena vacía para las filas que valen para TODO el nivel —que son las
-- que ya existen—. Así la pantalla actual de cupos sigue leyendo lo mismo.
ALTER TABLE cupos_admision
  ADD COLUMN IF NOT EXISTS grado text NOT NULL DEFAULT '';

COMMENT ON COLUMN cupos_admision.grado IS
  'Año escolar de esta fila. Cadena vacía = el cupo es del nivel entero, sin desglosar.';

DO $$
BEGIN
  -- Solo si la clave sigue siendo la vieja. Repetir la migración no la rehace.
  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'cupos_admision'
      AND c.contype = 'p'
      AND array_length(c.conkey, 1) = 2
  ) THEN
    ALTER TABLE cupos_admision DROP CONSTRAINT cupos_admision_pkey;
    ALTER TABLE cupos_admision
      ADD CONSTRAINT cupos_admision_pkey PRIMARY KEY (nivel, grado, ano_lectivo);
    RAISE NOTICE 'Clave primaria de cupos_admision ampliada con el año escolar.';
  END IF;
END $$;

-- ─── 3. Comprobación ────────────────────────────────────────
DO $$
DECLARE
  cols  integer;
  filas integer;
BEGIN
  SELECT count(*) INTO cols
  FROM information_schema.columns
  WHERE table_name = 'solicitudes_admision' AND column_name = 'est_grado';
  IF cols <> 1 THEN
    RAISE EXCEPTION 'solicitudes_admision.est_grado no quedó creada.';
  END IF;

  SELECT count(*) INTO filas FROM cupos_admision WHERE grado = '';
  RAISE NOTICE 'Migración 080 aplicada. Filas de cupo por nivel completo: %', filas;
END $$;
