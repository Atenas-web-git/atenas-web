-- ============================================================
-- Migración 034 — Plantilla E + seed /reconocimientos/* (10 páginas)
-- Backoffice Atenas — Fase 4 (sesión 30)
-- Requiere: 006_cms_paginas.sql + 026 (que ya incluye tpl_e en el CHECK).
--
-- Siembra 10 entradas en `paginas` con plantilla E:
--   - 2 landings: /reconocimientos/academicos + /reconocimientos/deportivos
--   - 4 detalles académicos: olimpiadas, ib, cambridge, ciencia
--   - 4 detalles deportivos: basquetbol, atletismo, futbol, natacion
--
-- El CHECK constraint de `paginas.plantilla` ya admite `tpl_e_hero_galeria`
-- desde la migración 026, así que no hay cambios de schema aquí.
--
-- IDEMPOTENTE: si una página ya existe (por slug), NO se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES

  -- ─── Landing académicos ──────────────────────────────────
  (
    'reconocimientos/academicos',
    'tpl_e_hero_galeria',
    'Reconocimientos Académicos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS',
        'title', 'Reconocimientos Académicos',
        'subtitle', 'Estudiantes que destacan en olimpiadas, el Diploma IB, certificaciones Cambridge y ferias científicas a nivel nacional e internacional.',
        'ghostText', 'ACADÉMICO'
      ),
      'showcase', jsonb_build_object(
        'verTodosHref', '/reconocimientos/academicos',
        'items', jsonb_build_array(
          jsonb_build_object('slug','olimpiadas','icon','🧠','nombre','Olimpiadas','count',20,'countLabel','Medallas obtenidas','photoSrc','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80','basePath','/reconocimientos/academicos'),
          jsonb_build_object('slug','ib','icon','★','nombre','Diploma IB','count','95%','countLabel','Tasa de aprobación','photoSrc','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=600&q=80','basePath','/reconocimientos/academicos'),
          jsonb_build_object('slug','cambridge','icon','🌐','nombre','Cambridge','count',40,'countLabel','Certificados anuales','photoSrc','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80','basePath','/reconocimientos/academicos'),
          jsonb_build_object('slug','ciencia','icon','🔬','nombre','Ciencia y Tech','count',8,'countLabel','Proyectos premiados','photoSrc','https://images.unsplash.com/photo-1532094349884-543559059574?w=600&q=80','basePath','/reconocimientos/academicos')
        )
      ),
      'logros', jsonb_build_object(
        'heading', 'Logros académicos que trascienden fronteras',
        'subheading', 'Cada tarjeta documenta un hito — toca los puntos para ver las fotos del momento.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🥇','deporte','Olimpiadas','titulo','Medalla de Oro — Matemáticas','year','2023','categoria','Olimpiada Nacional Estudiantil','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80')),
          jsonb_build_object('icon','★','deporte','Diploma IB','titulo','Puntaje Máximo — 45/45','year','2023','categoria','Bachillerato Internacional · Promoción 2023',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80')),
          jsonb_build_object('icon','🔬','deporte','Ciencia y Tech','titulo','1er Lugar — Feria de Ciencias','year','2022','categoria','Feria Nacional de Ciencia y Tecnología',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería Académica',
        'subtitulo', 'Graduaciones, premios y momentos que celebramos juntos',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80','alt','Ceremonia de grados'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80','alt','Olimpiadas'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=600&q=80','alt','Diploma IB'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80','alt','Cambridge'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1532094349884-543559059574?w=500&q=80','alt','Feria de Ciencias')
        )
      )
    ),
    'Reconocimientos Académicos | Atenas',
    'Los estudiantes de la Unidad Educativa Atenas destacan en olimpiadas, certificaciones internacionales y concursos académicos a nivel nacional e internacional.',
    true
  ),

  -- ─── Detalle académico: Olimpiadas ───────────────────────
  (
    'reconocimientos/academicos/olimpiadas',
    'tpl_e_hero_galeria',
    'Olimpiadas Académicas',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS ACADÉMICOS',
        'title', 'Olimpiadas',
        'subtitle', 'Estudiantes que compiten en olimpiadas nacionales e internacionales de matemáticas, física, química y más — representando a Atenas con brillantez.',
        'ghostText', 'OLIMPIADAS'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Olimpiadas',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🥇','deporte','Olimpiadas','titulo','Medalla de Oro — Matemáticas','year','2023','categoria','Olimpiada Nacional Estudiantil','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80')),
          jsonb_build_object('icon','🥈','deporte','Olimpiadas','titulo','Medalla de Plata — Física','year','2023','categoria','Olimpiada Nacional de Ciencias',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80')),
          jsonb_build_object('icon','🏅','deporte','Olimpiadas','titulo','Tercer Lugar — Química','year','2022','categoria','Olimpiada Internacional Iberoamericana',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Olimpiadas',
        'subtitulo', 'Momentos que celebramos juntos',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80','alt','Premiación olimpiadas'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80','alt','Equipo de matemáticas'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1532094349884-543559059574?w=600&q=80','alt','Competencia química'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80','alt','Medallas'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80','alt','Celebración')
        )
      )
    ),
    'Olimpiadas — Reconocimientos Académicos | Atenas',
    'Estudiantes que compiten en olimpiadas nacionales e internacionales de matemáticas, física, química y más — representando a Atenas con brillantez.',
    true
  ),

  -- ─── Detalle académico: Diploma IB ───────────────────────
  (
    'reconocimientos/academicos/ib',
    'tpl_e_hero_galeria',
    'Diploma IB — Reconocimientos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS ACADÉMICOS',
        'title', 'Diploma IB',
        'subtitle', 'Bachillerato Internacional con una tasa de aprobación del 95% — estudiantes Atenas que alcanzaron el nivel más alto del mundo académico.',
        'ghostText', 'DIPLOMA IB'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Diploma IB',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','★','deporte','Diploma IB','titulo','Puntaje Máximo — 45/45','year','2023','categoria','Bachillerato Internacional · Promoción 2023','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80')),
          jsonb_build_object('icon','★','deporte','Diploma IB','titulo','Top 5% Mundial — Economía HL','year','2022','categoria','IB Diploma Programme · Resultados globales',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Diploma IB',
        'subtitulo', 'Momentos que celebramos juntos',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80','alt','Ceremonia IB'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80','alt','Diploma IB'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80','alt','Graduados'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=500&q=80','alt','Celebración'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80','alt','Aula IB')
        )
      )
    ),
    'Diploma IB — Reconocimientos Académicos | Atenas',
    'Bachillerato Internacional con una tasa de aprobación del 95% — estudiantes Atenas que alcanzaron el nivel más alto del mundo académico.',
    true
  ),

  -- ─── Detalle académico: Cambridge ────────────────────────
  (
    'reconocimientos/academicos/cambridge',
    'tpl_e_hero_galeria',
    'Cambridge — Reconocimientos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS ACADÉMICOS',
        'title', 'Cambridge',
        'subtitle', 'Certificaciones Cambridge International que abren puertas a universidades del mundo — más de 40 certificados anuales con distinción.',
        'ghostText', 'CAMBRIDGE'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Cambridge',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🌐','deporte','Cambridge','titulo','40 Certificados con Distinción','year','2023','categoria','Cambridge International AS & A Levels','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80')),
          jsonb_build_object('icon','🌐','deporte','Cambridge','titulo','Outstanding Cambridge Learner','year','2022','categoria','Top in Ecuador — Mathematics',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Cambridge',
        'subtitulo', 'Momentos que celebramos juntos',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80','alt','Certificados Cambridge'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=500&q=80','alt','Ceremonia'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80','alt','Estudiantes'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80','alt','Diplomas'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80','alt','Premio')
        )
      )
    ),
    'Cambridge — Reconocimientos Académicos | Atenas',
    'Certificaciones Cambridge International que abren puertas a universidades del mundo — más de 40 certificados anuales con distinción.',
    true
  ),

  -- ─── Detalle académico: Ciencia y Tecnología ─────────────
  (
    'reconocimientos/academicos/ciencia',
    'tpl_e_hero_galeria',
    'Ciencia y Tecnología — Reconocimientos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS ACADÉMICOS',
        'title', 'Ciencia y Tecnología',
        'subtitle', 'Proyectos científicos y tecnológicos premiados a nivel nacional — estudiantes Atenas que innovan y resuelven problemas reales del mundo.',
        'ghostText', 'CIENCIA'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Ciencia y Tecnología',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🔬','deporte','Ciencia y Tech','titulo','1er Lugar — Feria de Ciencias','year','2022','categoria','Feria Nacional de Ciencia y Tecnología','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80')),
          jsonb_build_object('icon','💡','deporte','Ciencia y Tech','titulo','Mejor Innovación Tecnológica','year','2023','categoria','Concurso Nacional SENESCYT',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80','https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Ciencia y Tecnología',
        'subtitulo', 'Momentos que celebramos juntos',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80','alt','Feria de ciencias'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80','alt','Proyecto ganador'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80','alt','Exposición'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1532094349884-543559059574?w=500&q=80','alt','Premio'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80','alt','Equipo')
        )
      )
    ),
    'Ciencia y Tecnología — Reconocimientos Académicos | Atenas',
    'Proyectos científicos y tecnológicos premiados a nivel nacional — estudiantes Atenas que innovan y resuelven problemas reales del mundo.',
    true
  ),

  -- ─── Landing deportivos ──────────────────────────────────
  (
    'reconocimientos/deportivos',
    'tpl_e_hero_galeria',
    'Reconocimientos Deportivos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS',
        'title', 'Reconocimientos Deportivos',
        'subtitle', 'Atletas que representan a Atenas con excelencia — campeonatos provinciales, nacionales y logros que enorgullecen a toda la comunidad.',
        'ghostText', 'DEPORTE'
      ),
      'showcase', jsonb_build_object(
        'verTodosHref', '/reconocimientos/deportivos',
        'items', jsonb_build_array(
          jsonb_build_object('slug','basquetbol','icon','🏀','nombre','Básquetbol','count',8,'countLabel','Medallas y títulos','photoSrc','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80','basePath','/reconocimientos/deportivos'),
          jsonb_build_object('slug','atletismo','icon','🏃','nombre','Atletismo','count',5,'countLabel','Medallas nacionales','photoSrc','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80','basePath','/reconocimientos/deportivos'),
          jsonb_build_object('slug','futbol','icon','⚽','nombre','Fútbol','count',12,'countLabel','Títulos provinciales','photoSrc','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80','basePath','/reconocimientos/deportivos'),
          jsonb_build_object('slug','natacion','icon','🏊','nombre','Natación','count',3,'countLabel','Oros regionales','photoSrc','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80','basePath','/reconocimientos/deportivos')
        )
      ),
      'logros', jsonb_build_object(
        'heading', 'Campeones que representan a Atenas en todo el país',
        'subheading', 'Cada tarjeta es un álbum de fotos del campeonato — toca los puntos para ver todos los momentos.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🥇','deporte','Básquetbol','titulo','Campeones Provinciales','year','2023','categoria','Categoría masculina sub-18','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80','https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=700&q=80','https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=700&q=80')),
          jsonb_build_object('icon','🏅','deporte','Atletismo','titulo','Medalla de Oro Nacional','year','2022','categoria','Juegos Nacionales Estudiantiles',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80','https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=700&q=80')),
          jsonb_build_object('icon','🏆','deporte','Fútbol','titulo','Liga Provincial — Primer Lugar','year','2023','categoria','Categoría mixta · Ambato',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80','https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=700&q=80','https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería de Logros',
        'subtitulo', 'Momentos que quedan en la historia del colegio',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80','alt','Básquetbol'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80','alt','Atletismo'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80','alt','Fútbol'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80','alt','Natación'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80','alt','Celebración')
        )
      )
    ),
    'Reconocimientos Deportivos | Atenas',
    'Los atletas de la Unidad Educativa Atenas compiten y ganan en campeonatos provinciales y nacionales. Conoce nuestros logros deportivos por disciplina.',
    true
  ),

  -- ─── Detalle deportivo: Básquetbol ───────────────────────
  (
    'reconocimientos/deportivos/basquetbol',
    'tpl_e_hero_galeria',
    'Básquetbol — Reconocimientos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS DEPORTIVOS',
        'title', 'Básquetbol',
        'subtitle', 'Campeones provinciales con un equipo que demuestra disciplina, trabajo en equipo y orgullo ateniense en cada cancha.',
        'ghostText', 'BASKET'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Básquetbol',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🥇','deporte','Básquetbol','titulo','Campeones Provinciales','year','2023','categoria','Categoría masculina sub-18','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80','https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=700&q=80','https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=700&q=80')),
          jsonb_build_object('icon','🏅','deporte','Básquetbol','titulo','Subcampeones Regionales','year','2022','categoria','Categoría femenina sub-16',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=700&q=80','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80')),
          jsonb_build_object('icon','🏆','deporte','Básquetbol','titulo','Liga Intercolegial — 1er Lugar','year','2021','categoria','Torneo provincial · Tungurahua',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Básquetbol',
        'subtitulo', 'Momentos históricos de nuestros atletas',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80','alt','Equipo masculino'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80','alt','Entrenamiento'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=600&q=80','alt','Partido final'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80','alt','Ceremonia'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80','alt','Trofeo')
        )
      )
    ),
    'Básquetbol — Reconocimientos Deportivos | Atenas',
    'Campeones provinciales con un equipo que demuestra disciplina, trabajo en equipo y orgullo ateniense en cada cancha.',
    true
  ),

  -- ─── Detalle deportivo: Atletismo ────────────────────────
  (
    'reconocimientos/deportivos/atletismo',
    'tpl_e_hero_galeria',
    'Atletismo — Reconocimientos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS DEPORTIVOS',
        'title', 'Atletismo',
        'subtitle', 'Velocistas y fondistas que representan a Atenas en los Juegos Nacionales Estudiantiles con medallas y récords que inspiran.',
        'ghostText', 'ATLETAS'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Atletismo',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🥇','deporte','Atletismo','titulo','Medalla de Oro Nacional','year','2022','categoria','Juegos Nacionales Estudiantiles','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80','https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=700&q=80')),
          jsonb_build_object('icon','🏅','deporte','Atletismo','titulo','Oro Regional — 100m planos','year','2023','categoria','Zona 3 · Categoría sub-16',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=700&q=80','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Atletismo',
        'subtitulo', 'Momentos históricos de nuestros atletas',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80','alt','Pista de atletismo'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80','alt','Carrera'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80','alt','Llegada'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80','alt','Medallas'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80','alt','Celebración')
        )
      )
    ),
    'Atletismo — Reconocimientos Deportivos | Atenas',
    'Velocistas y fondistas que representan a Atenas en los Juegos Nacionales Estudiantiles con medallas y récords que inspiran.',
    true
  ),

  -- ─── Detalle deportivo: Fútbol ───────────────────────────
  (
    'reconocimientos/deportivos/futbol',
    'tpl_e_hero_galeria',
    'Fútbol — Reconocimientos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS DEPORTIVOS',
        'title', 'Fútbol',
        'subtitle', 'Un equipo que juega con corazón ateniense — campeones provinciales y referentes del fútbol intercolegial en Tungurahua.',
        'ghostText', 'FÚTBOL'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Fútbol',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🏆','deporte','Fútbol','titulo','Liga Provincial — Primer Lugar','year','2023','categoria','Categoría mixta · Ambato','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80','https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=700&q=80','https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&q=80')),
          jsonb_build_object('icon','🥇','deporte','Fútbol','titulo','Torneo Intercolegial','year','2022','categoria','Categoría masculina sub-18',
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&q=80','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Fútbol',
        'subtitulo', 'Momentos históricos de nuestros atletas',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80','alt','Equipo de fútbol'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80','alt','Partido'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80','alt','Gol'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80','alt','Copa'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80','alt','Celebración')
        )
      )
    ),
    'Fútbol — Reconocimientos Deportivos | Atenas',
    'Un equipo que juega con corazón ateniense — campeones provinciales y referentes del fútbol intercolegial en Tungurahua.',
    true
  ),

  -- ─── Detalle deportivo: Natación ─────────────────────────
  (
    'reconocimientos/deportivos/natacion',
    'tpl_e_hero_galeria',
    'Natación — Reconocimientos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'RECONOCIMIENTOS DEPORTIVOS',
        'title', 'Natación',
        'subtitle', 'Nadadores de élite que conquistan las piscinas regionales y nacionales con técnica y perseverancia.',
        'ghostText', 'AGUA'
      ),
      'showcase', jsonb_build_object('verTodosHref','','items', jsonb_build_array()),
      'logros', jsonb_build_object(
        'heading', 'Nuestros logros en Natación',
        'subheading', 'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
        'items', jsonb_build_array(
          jsonb_build_object('icon','🥇','deporte','Natación','titulo','Medalla de Oro Regional','year','2021','categoria','Zona 3 — 200m libre','highlight',true,
            'photos', jsonb_build_array('https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80'))
        )
      ),
      'galeria', jsonb_build_object(
        'titulo', 'Galería — Natación',
        'subtitulo', 'Momentos históricos de nuestros atletas',
        'photos', jsonb_build_array(
          jsonb_build_object('src','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80','alt','Natación'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80','alt','Largada'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80','alt','Medalla'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80','alt','Podio'),
          jsonb_build_object('src','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80','alt','Equipo')
        )
      )
    ),
    'Natación — Reconocimientos Deportivos | Atenas',
    'Nadadores de élite que conquistan las piscinas regionales y nacionales con técnica y perseverancia.',
    true
  )

) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
