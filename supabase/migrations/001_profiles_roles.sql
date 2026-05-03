-- ============================================================
-- Migración 001 — Perfiles, roles y permisos
-- Backoffice Atenas — Fase 2
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── Tabla profiles (extiende auth.users con datos públicos) ────
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  avatar_url  text,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles (is_active);

-- ─── Tabla roles (catálogo fijo de 4 roles) ─────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id    smallserial PRIMARY KEY,
  slug  text UNIQUE NOT NULL,
  name  text NOT NULL,
  description text
);

-- ─── Tabla user_roles (asignación N:N) ──────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  user_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id  smallint NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now(),
  granted_by uuid REFERENCES profiles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles (role_id);

-- ─── Trigger: crear profile automáticamente al registrar usuario ──
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Función helper: verifica si el usuario actual tiene un rol ──
CREATE OR REPLACE FUNCTION user_has_role(role_slug text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    JOIN profiles p ON p.id = ur.user_id
    WHERE ur.user_id = auth.uid()
      AND r.slug = role_slug
      AND p.is_active = true
  );
$$;

-- ─── RLS — Habilitar seguridad ──────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ─── Policies: profiles ─────────────────────────────────────────
-- Cualquier usuario autenticado puede ver su propio perfil
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Superadmin puede ver todos los perfiles
CREATE POLICY "profiles_select_superadmin"
  ON profiles FOR SELECT
  TO authenticated
  USING (user_has_role('superadmin'));

-- Solo superadmin puede crear, actualizar o desactivar perfiles
CREATE POLICY "profiles_insert_superadmin"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_has_role('superadmin'));

CREATE POLICY "profiles_update_superadmin"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_has_role('superadmin'))
  WITH CHECK (user_has_role('superadmin'));

-- Cada usuario puede actualizar su propio nombre/avatar (no is_active)
CREATE POLICY "profiles_update_self_basic"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND is_active = true);

-- ─── Policies: roles ────────────────────────────────────────────
-- Cualquier usuario autenticado puede leer el catálogo de roles
CREATE POLICY "roles_select_authenticated"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- ─── Policies: user_roles ───────────────────────────────────────
-- Superadmin puede ver y manejar todas las asignaciones
CREATE POLICY "user_roles_all_superadmin"
  ON user_roles FOR ALL
  TO authenticated
  USING (user_has_role('superadmin'))
  WITH CHECK (user_has_role('superadmin'));

-- Cada usuario puede ver sus propios roles asignados
CREATE POLICY "user_roles_select_own"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
