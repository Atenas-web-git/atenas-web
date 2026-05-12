-- ============================================================
-- Migración 032 — Mega-menú editable (tabla menu_items con árbol)
-- Backoffice Atenas — Fase 4 (sesión 30)
-- Requiere: 001_profiles_roles.sql ejecutada (user_has_role helper)
--
-- Tabla con auto-referencia jerárquica: cada item puede tener un parent_id
-- que apunta a otro item de la misma tabla (típicamente una categoría).
-- En el mega-menú actual se usan solo 2 niveles (categoría → sub-items),
-- pero el schema admite N niveles si se necesitara en el futuro.
--
-- Cada item tiene:
--   - label    : texto visible
--   - href     : URL destino (interna "/matriculas" o externa "https://...")
--                Puede ser NULL en categorías que no son clickeables.
--   - external : si true, forza target="_blank" (auto-detectado por href.startsWith("http"))
--   - badge    : texto opcional tipo "Nuevo", "Próximamente"
--   - visible  : si false, el item no se renderiza en el sitio público
--   - orden    : entero para ordenar dentro de su grupo (mismo parent_id)
--
-- Backoffice: `/admin/configuracion/mega-menu` (solo superadmin).
--
-- IDEMPOTENTE: tabla con IF NOT EXISTS, columnas con ADD COLUMN IF NOT EXISTS,
-- seed inicial solo si la tabla está vacía.
-- ============================================================

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES menu_items(id) ON DELETE CASCADE;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS label text NOT NULL DEFAULT '';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS href text;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS external boolean NOT NULL DEFAULT false;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS orden int NOT NULL DEFAULT 0;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_menu_items_parent_orden ON menu_items(parent_id, orden);
CREATE INDEX IF NOT EXISTS idx_menu_items_visible ON menu_items(visible);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo items visibles
DROP POLICY IF EXISTS "menu_items_select_public" ON menu_items;
CREATE POLICY "menu_items_select_public"
  ON menu_items FOR SELECT
  TO anon, authenticated
  USING (visible = true);

-- Lectura admin completa (incluye items ocultos)
DROP POLICY IF EXISTS "menu_items_select_admin" ON menu_items;
CREATE POLICY "menu_items_select_admin"
  ON menu_items FOR SELECT
  TO authenticated
  USING (user_has_role('superadmin'));

-- Escritura: solo superadmin
DROP POLICY IF EXISTS "menu_items_write_admin" ON menu_items;
CREATE POLICY "menu_items_write_admin"
  ON menu_items FOR ALL
  TO authenticated
  USING (user_has_role('superadmin'))
  WITH CHECK (user_has_role('superadmin'));

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_menu_items_updated_at ON menu_items;
CREATE TRIGGER trg_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- ─── Seed inicial — estructura actual del mega-menú ─────────────
-- Solo si la tabla está vacía (idempotente).
-- Replicado de src/components/home/Navbar.tsx (sesión previa al CMS).

DO $$
DECLARE
  cat_quienes_somos    uuid;
  cat_espacios         uuid;
  cat_reconocimientos  uuid;
  cat_academico        uuid;
  cat_admisiones       uuid;
  cat_matriculas       uuid;
  cat_documentos       uuid;
  cat_servicios        uuid;
  cat_plataformas      uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM menu_items LIMIT 1) THEN
    RETURN;
  END IF;

  -- Categorías (top-level, sin parent)
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Quiénes Somos',              10) RETURNING id INTO cat_quienes_somos;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Espacios de Desarrollo',     20) RETURNING id INTO cat_espacios;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Reconocimientos',            30) RETURNING id INTO cat_reconocimientos;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Académico',                  40) RETURNING id INTO cat_academico;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Admisiones',                 50) RETURNING id INTO cat_admisiones;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Matrículas',                 60) RETURNING id INTO cat_matriculas;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Documentos Institucionales', 70) RETURNING id INTO cat_documentos;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Servicios',                  80) RETURNING id INTO cat_servicios;
  INSERT INTO menu_items (parent_id, label, orden) VALUES (NULL, 'Nuestras Plataformas',       90) RETURNING id INTO cat_plataformas;

  -- Sub-items: Quiénes Somos
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_quienes_somos, 'Historia & 50 Años',      '/el-atenas/historia',           10),
    (cat_quienes_somos, 'Misión',                  '/el-atenas/mision',             20),
    (cat_quienes_somos, 'Visión',                  '/el-atenas/vision',             30),
    (cat_quienes_somos, 'Valores Institucionales', '/el-atenas/valores',            40),
    (cat_quienes_somos, 'Política de Calidad',     '/el-atenas/politica-calidad',   50),
    (cat_quienes_somos, 'Política de Seguridad',   '/el-atenas/politica-seguridad', 60),
    (cat_quienes_somos, 'Directiva de PPFF',       '/el-atenas/directiva-ppff',     70),
    (cat_quienes_somos, 'Directorio FCEA',         '/el-atenas/directorio-fcea',    80);

  -- Sub-items: Espacios de Desarrollo
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_espacios, 'Proyecto VASE',     '/espacios/vase',             10),
    (cat_espacios, 'Proyecto CAS',      '/espacios/cas',              20),
    (cat_espacios, 'Idioma Extranjero', '/espacios/idioma',           30),
    (cat_espacios, 'Cultura Estética',  '/espacios/cultura',          40),
    (cat_espacios, 'Educación Física',  '/espacios/educacion-fisica', 50),
    (cat_espacios, 'Intercambio',       '/espacios/intercambio',      60);

  -- Sub-items: Reconocimientos
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_reconocimientos, 'Logros Deportivos', '/reconocimientos/deportivos', 10),
    (cat_reconocimientos, 'Logros Académicos', '/reconocimientos/academicos', 20);

  -- Sub-items: Académico
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_academico, 'Educación Inicial',                '/academico/niveles/inicial',             10),
    (cat_academico, 'EGB Elemental y Media',            '/academico/niveles/egb-elemental-media', 20),
    (cat_academico, 'EGB Superior',                     '/academico/niveles/egb-superior',        30),
    (cat_academico, 'Bachillerato Internacional (IB)',  '/academico/ib',                          40);

  -- Sub-items: Admisiones
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_admisiones, 'Educación Inicial',     '/admisiones/inicial',             10),
    (cat_admisiones, 'EGB Elemental y Media', '/admisiones/egb-elemental-media', 20),
    (cat_admisiones, 'EGB Superior',          '/admisiones/egb-superior',        30),
    (cat_admisiones, 'Bachillerato IB',       '/admisiones/ib',                  40),
    (cat_admisiones, 'Agenda una visita',     '/admisiones#visita',              50);

  -- Sub-items: Matrículas
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_matriculas, 'Proceso de Matrícula',     '/matriculas/proceso',         10),
    (cat_matriculas, 'Valores Referenciales',    '/matriculas/valores',         20),
    (cat_matriculas, 'Autorizaciones bancarias', '/matriculas/autorizaciones',  30);

  -- Sub-items: Documentos
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_documentos, 'Ver todos los documentos →', '/documentos-institucionales', 10);

  -- Sub-items: Servicios
  INSERT INTO menu_items (parent_id, label, href, orden) VALUES
    (cat_servicios, 'Bar / Cafetería',       '/servicios/bar-cafeteria',      10),
    (cat_servicios, 'Biblioteca',            '/servicios/biblioteca',         20),
    (cat_servicios, 'Transporte',            '/servicios/transporte',         30),
    (cat_servicios, 'Dispensario Médico',    '/servicios/dispensario-medico', 40),
    (cat_servicios, 'Llave del Aprendizaje', '/servicios/llave-aprendizaje',  50),
    (cat_servicios, 'Becas',                 '/servicios/becas',              60),
    (cat_servicios, 'Seguro Estudiantil',    '/servicios/seguro-estudiantil', 70),
    (cat_servicios, 'Quejas y Sugerencias',  '/servicios/quejas-sugerencias', 80);

  -- Sub-items: Plataformas (todas externas)
  INSERT INTO menu_items (parent_id, label, href, external, orden) VALUES
    (cat_plataformas, 'Aleks',                          'https://latam.aleks.com/?_s=6114732018736631',                                                       true, 10),
    (cat_plataformas, 'eLibro',                         'https://elibro.net/es/lc/atenas/login_usuario/?next=/es/lc/atenas/inicio/',                          true, 20),
    (cat_plataformas, 'Biblioteca Virtual Institucional','http://biblioteca.atenas.edu.ec:8085/librum/buea/',                                                  true, 30);
END $$;
