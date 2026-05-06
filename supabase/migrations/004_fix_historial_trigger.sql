-- ============================================================
-- Migración 004 — Fix: trigger de historial debe ser SECURITY DEFINER
-- Backoffice Atenas — Fase 2 (corrección post-sesión 23)
--
-- Bug encontrado: cuando un visitante anónimo envía el formulario
-- público de admisiones, el INSERT en solicitudes_admision dispara
-- el trigger log_solicitud_estado_change. Como la función NO era
-- SECURITY DEFINER, se ejecutaba con permisos del usuario anon, y al
-- intentar INSERT en solicitudes_historial (que tiene RLS sin policy
-- de INSERT para anon) la inserción fallaba y rollbackeaba todo.
--
-- Fix: la función ahora es SECURITY DEFINER, igual que handle_new_user()
-- y user_has_role() de la migración 001.
-- ============================================================

CREATE OR REPLACE FUNCTION log_solicitud_estado_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo registrar si el estado cambió
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO solicitudes_historial (solicitud_id, estado_anterior, estado_nuevo, cambiado_por)
    VALUES (NEW.id, NULL, NEW.estado, auth.uid());
  ELSIF (TG_OP = 'UPDATE' AND OLD.estado IS DISTINCT FROM NEW.estado) THEN
    INSERT INTO solicitudes_historial (solicitud_id, estado_anterior, estado_nuevo, cambiado_por)
    VALUES (NEW.id, OLD.estado, NEW.estado, auth.uid());
  END IF;

  -- Actualizar updated_at
  IF (TG_OP = 'UPDATE') THEN
    NEW.updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

-- El trigger en sí no necesita re-crearse: solo cambió la función que ejecuta.
