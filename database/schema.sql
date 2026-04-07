-- ============================================================
-- SCHEMA INICIAL — Plataforma Web Unidad Educativa Atenas
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- 1. PERFILES DE USUARIO (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('superadmin', 'editor')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: cada usuario solo ve su perfil; superadmin ve todos
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Superadmin ve todos los perfiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'superadmin'
    )
  );

CREATE POLICY "Superadmin gestiona perfiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'superadmin'
    )
  );

-- Trigger: crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. NOTICIAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.news (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         TEXT NOT NULL,
  cover_image_url TEXT,
  category        TEXT NOT NULL DEFAULT 'general',
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  author_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: noticias publicadas son públicas; editores gestionan las suyas; superadmin gestiona todas
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Noticias publicadas son públicas"
  ON public.news FOR SELECT
  USING (published = TRUE);

CREATE POLICY "Editores ven todas las noticias"
  ON public.news FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('editor', 'superadmin')));

CREATE POLICY "Editores crean noticias"
  ON public.news FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('editor', 'superadmin')));

CREATE POLICY "Editores actualizan sus noticias"
  ON public.news FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Superadmin gestiona todas las noticias"
  ON public.news FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'superadmin'));

-- ============================================================
-- 3. CONFIGURACIÓN DEL SITIO (textos, colores, datos editables)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_config (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value       TEXT NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- RLS: config pública es legible por todos; solo admins/editors la modifican
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Config del sitio es pública"
  ON public.site_config FOR SELECT
  TO PUBLIC
  USING (TRUE);

CREATE POLICY "Solo editores modifican config"
  ON public.site_config FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('editor', 'superadmin')));

CREATE POLICY "Solo superadmin inserta config"
  ON public.site_config FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'superadmin'));

-- Datos iniciales de configuración
INSERT INTO public.site_config (key, value, label, description) VALUES
  ('site_name',        'Unidad Educativa Atenas',        'Nombre del sitio',           'Nombre que aparece en el título del navegador'),
  ('site_tagline',     '50 años formando líderes',       'Lema del colegio',           'Texto bajo el logo en el header'),
  ('contact_email',    '',                               'Correo de contacto',         'Email que aparece en el formulario de contacto'),
  ('contact_phone',    '',                               'Teléfono de contacto',       'Número que aparece en el footer'),
  ('contact_whatsapp', '',                               'WhatsApp Business',          'Número para el botón de WhatsApp'),
  ('social_facebook',  '',                               'Facebook URL',               'Link a la página de Facebook'),
  ('social_instagram', '',                               'Instagram URL',              'Link al Instagram del colegio'),
  ('social_youtube',   '',                               'YouTube URL',                'Link al canal de YouTube'),
  ('address',          'Ambato, Ecuador',                'Dirección',                  'Dirección del colegio'),
  ('hero_title',       'Bienvenidos a la Unidad Educativa Atenas', 'Título del Hero', 'Título principal en la página de inicio'),
  ('hero_subtitle',    '50 años formando el Ecuador del mañana',   'Subtítulo del Hero', 'Subtítulo en la página de inicio')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 4. FUNCIÓN: actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_news
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_site_config
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
