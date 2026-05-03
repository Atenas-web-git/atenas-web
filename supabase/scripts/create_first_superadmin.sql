-- ============================================================
-- Script — Crear primer Superadmin manualmente
-- ============================================================
--
-- ⚠️  Este script se ejecuta UNA SOLA VEZ, para bootstrap del sistema.
--     Después de esto, los superadmins existentes pueden crear más
--     usuarios desde el backoffice (módulo /admin/usuarios).
--
-- ─── PASO A — Crear el usuario en Supabase Auth ─────────────────
-- Esto se hace desde la UI de Supabase, NO con SQL:
--
--   Supabase Dashboard → Authentication → Users → "Add user"
--   - Email: <email del responsable de sistemas>
--   - Password: <password fuerte temporal>
--   - Auto Confirm User: ✓ (sí)
--
-- Anota el "User UID" generado (uuid). Lo necesitas en el paso B.
--
-- El trigger `on_auth_user_created` creará automáticamente
-- la fila correspondiente en `public.profiles`.
--
-- ─── PASO B — Asignar rol superadmin ────────────────────────────
-- Reemplaza <USER_UUID> con el UID del paso A:

INSERT INTO user_roles (user_id, role_id)
SELECT
  '<USER_UUID>'::uuid,
  id
FROM roles
WHERE slug = 'superadmin'
ON CONFLICT DO NOTHING;

-- ─── PASO C — Verificar ─────────────────────────────────────────
-- Esta consulta debe retornar 1 fila con el rol superadmin:

SELECT
  p.id,
  p.full_name,
  u.email,
  r.slug AS rol,
  r.name AS rol_nombre
FROM profiles p
JOIN auth.users u ON u.id = p.id
JOIN user_roles ur ON ur.user_id = p.id
JOIN roles r ON r.id = ur.role_id
WHERE p.id = '<USER_UUID>'::uuid;

-- ─── PASO D (opcional) — Actualizar nombre completo ────────────
-- Si quieres ajustar el full_name (por defecto se setea al email):
--
-- UPDATE profiles
-- SET full_name = 'Nombre Completo del Superadmin'
-- WHERE id = '<USER_UUID>'::uuid;
