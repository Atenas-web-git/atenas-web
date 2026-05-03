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
-- El trigger `on_auth_user_created` crea automáticamente la fila
-- en `public.profiles` SOLO para usuarios creados DESPUÉS de la migración.
-- Si tu usuario ya existía antes (caso bootstrap), insertamos el profile
-- manualmente con el siguiente bloque (idempotente).
--
-- ─── PASO B.1 — Asegurar profile activo ────────────────────────
-- Reemplaza <USER_UUID> con el UID del paso A:

INSERT INTO profiles (id, full_name, is_active)
SELECT
  '276d92e1-ce77-46c6-b1d4-cb2982e7fdc0'::uuid,
  email,
  true
FROM auth.users
WHERE id = '276d92e1-ce77-46c6-b1d4-cb2982e7fdc0'::uuid
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- ─── PASO B.2 — Asignar rol superadmin ──────────────────────────

INSERT INTO user_roles (user_id, role_id)
SELECT
  '276d92e1-ce77-46c6-b1d4-cb2982e7fdc0'::uuid,
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
WHERE p.id = '276d92e1-ce77-46c6-b1d4-cb2982e7fdc0'::uuid;

-- ─── PASO D (opcional) — Actualizar nombre completo ────────────
-- Si quieres ajustar el full_name (por defecto se setea al email):
--
-- UPDATE profiles
-- SET full_name = 'Nombre Completo del Superadmin'
-- WHERE id = '276d92e1-ce77-46c6-b1d4-cb2982e7fdc0'::uuid;
