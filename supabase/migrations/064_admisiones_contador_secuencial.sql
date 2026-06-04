-- ============================================================
-- Migración 064 — Contador secuencial del número de seguimiento
-- Sesión 41.
--
-- El número de solicitud cambia de aleatorio (ATN-2026-543210) a
-- secuencial por año (ADM<año3dig>-<seq3dig>):
--   ADM026-001, ADM026-002, ..., ADM026-278, ...
--
-- El colegio ya lleva en su sistema interno hasta el 277 para el año
-- 2026, así que sembramos el contador en 277 → la próxima solicitud
-- registrada saldrá como ADM026-278.
--
-- El admin puede editar el contador desde
-- /admin/configuracion/admisiones-textos (sección Contador).
--
-- IDEMPOTENTE.
-- ============================================================

-- 1. Tabla del contador (una fila por año lectivo abreviado a 3 dígitos).
CREATE TABLE IF NOT EXISTS admisiones_contador (
  -- Año a 3 dígitos: 2026 → '026', 2027 → '027'.
  ano        text PRIMARY KEY,
  -- `proximo` representa el ÚLTIMO número entregado. La función
  -- siguiente_numero_admision() lo incrementa atómicamente y devuelve.
  -- Sembrado en 277 para 2026 → la primera llamada devolverá 278.
  proximo    integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE admisiones_contador ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admisiones_contador_select" ON admisiones_contador;
CREATE POLICY "admisiones_contador_select"
  ON admisiones_contador FOR SELECT TO authenticated
  USING (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  );

DROP POLICY IF EXISTS "admisiones_contador_write" ON admisiones_contador;
CREATE POLICY "admisiones_contador_write"
  ON admisiones_contador FOR ALL TO authenticated
  USING (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  )
  WITH CHECK (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  );

-- 2. Función atómica para obtener el siguiente número de admisión.
-- SECURITY DEFINER porque la llama el endpoint público del formulario
-- (sin sesión) y no podemos abrir RLS pública a la tabla.
CREATE OR REPLACE FUNCTION siguiente_numero_admision(p_ano text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_proximo integer;
BEGIN
  INSERT INTO admisiones_contador (ano, proximo)
  VALUES (p_ano, 1)
  ON CONFLICT (ano) DO UPDATE
    SET proximo = admisiones_contador.proximo + 1,
        updated_at = now()
  RETURNING proximo INTO v_proximo;
  RETURN v_proximo;
END;
$$;

-- Permitir ejecutar la función desde el formulario público (anon) y el
-- admin autenticado.
GRANT EXECUTE ON FUNCTION siguiente_numero_admision(text) TO anon, authenticated;

-- 3. Seed inicial: 2026 ya va en 277 → siguiente llamada devolverá 278.
INSERT INTO admisiones_contador (ano, proximo) VALUES ('026', 277)
ON CONFLICT (ano) DO NOTHING;
