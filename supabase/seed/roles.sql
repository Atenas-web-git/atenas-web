-- ============================================================
-- Seed — Catálogo de los 4 roles del backoffice
-- Ejecutar UNA vez después de la migración 001
-- ============================================================

INSERT INTO roles (slug, name, description) VALUES
  ('superadmin', 'Superadministrador',
   'Control total del backoffice. Único rol que puede crear/eliminar usuarios y asignar roles. Acceso completo a configuración global, contenido y todos los módulos.'),

  ('editor_comm', 'Editor de Comunicaciones',
   'Gestiona contenido público: Home, páginas institucionales (Historia, Misión, Visión, Valores, Políticas), Reconocimientos, Noticias, Cronograma, banners y popups, galería, redes sociales y SEO por página.'),

  ('editor_admisiones', 'Editor de Admisiones',
   'Gestiona el módulo de admisiones: solicitudes (cambios de estado, notas internas, emails), cupos por nivel y año lectivo, contenido de las páginas de admisiones y matrículas (listas de útiles, valores, autorizaciones).'),

  ('editor_academico', 'Editor Académico',
   'Gestiona contenido académico: niveles educativos (Inicial, EGB E/M, Superior), Bachillerato IB y sus 7 sub-páginas, Espacios de Desarrollo (VASE, CAS, Idioma, Cultura, Ed. Física, Intercambio), documentos institucionales descargables.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
