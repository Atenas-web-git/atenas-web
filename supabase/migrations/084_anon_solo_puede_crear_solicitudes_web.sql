-- ============================================================
-- Migración 084 — Que «registrada a mano» signifique algo
-- Backoffice Atenas — sesión 51 (2026-08-14)
-- Requiere: 083_solicitudes_origen.sql ejecutada
--
-- Acota lo que un visitante anónimo puede escribir en
-- `solicitudes_admision`. Hasta ahora la política era
-- `WITH CHECK (true)`: cualquier fila, con cualquier valor.
--
-- POR QUÉ AHORA. La 083 añadió `origen`, y el panel lo enseña como
-- etiqueta «A mano» en el listado, «Registrada a mano» en la ficha y
-- «Cómo llegó» en el CSV. Es una afirmación sobre la procedencia del
-- dato, y hasta esta migración era falsificable:
--
--   La clave `anon` viaja al navegador por diseño —la usa el formulario
--   público—, así que cualquiera puede hacer un POST directo a la API
--   REST saltándose la aplicación entera. Con `WITH CHECK (true)` podía
--   escribir `origen = 'manual'` y quedar en el panel indistinguible de
--   lo que tecleó secretaría.
--
-- Y de paso cierra un agujero que ya existía antes de todo esto: también
-- podía nacer directamente en `estado = 'matriculado'`, que cuenta como
-- cupo ocupado en Cupos y como matriculado en Métricas. Dos números que
-- el colegio mira para tomar decisiones.
--
-- QUÉ NO ROMPE. El endpoint público `/api/admisiones/solicitud` inserta
-- con el estado inicial «interesado» y sin nombrar `origen`, así que
-- toma el default 'web'. Pasa el CHECK nuevo sin tocar una línea.
--
-- El alta manual del panel NO usa esta política: va con service_role,
-- que se salta RLS. Por eso puede seguir escribiendo `origen = 'manual'`
-- — y ahora es el único camino que puede.
--
-- IDEMPOTENTE.
-- ============================================================

BEGIN;

DROP POLICY IF EXISTS "solicitudes_insert_anon" ON solicitudes_admision;

CREATE POLICY "solicitudes_insert_anon"
  ON solicitudes_admision FOR INSERT
  TO anon
  WITH CHECK (
    -- Lo que entra por la puerta pública es, por definición, del formulario.
    origen = 'web'
    -- Y entra por el principio del proceso. Nadie se auto-matricula.
    AND estado = 'interesado'
  );

COMMIT;
