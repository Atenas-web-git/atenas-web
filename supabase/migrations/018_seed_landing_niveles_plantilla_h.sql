-- ============================================================
-- Migración 018 — Seed landing /academico/niveles (Plantilla H)
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 017_seed_landing_ib_plantilla_g.sql ejecutada
--           (que ya amplió el CHECK constraint con tpl_h_landing_niveles)
--
-- Siembra la landing `/academico/niveles` con plantilla H (4 bloques:
-- Hero + Niveles educativos (5 cards) + Metodologías (strip + 4 cards)
-- + CTA con stats card).
--
-- IDEMPOTENTE: si la página ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'academico/niveles',
    'tpl_h_landing_niveles',
    'Niveles Educativos',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'bgImageSrc', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1440&q=80',
        'ghostText', 'ACADÉMICO',
        'badge', 'NIVELES EDUCATIVOS',
        'titleLine1', 'Formación',
        'titleLine2', 'integral.',
        'subtitle', 'Desde los primeros pasos en Inicial hasta el Diploma IB, cada nivel construye sobre el anterior con metodologías de excelencia.',
        'subtitleHighlight', 'Diploma IB,',
        'floatingPhotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
          'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
          'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80'
        ),
        'floatingBadgeValue', '5',
        'floatingBadgeLabel', 'NIVELES EDUCATIVOS',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Inicial'),
          jsonb_build_object('texto', 'Básica Elemental'),
          jsonb_build_object('texto', 'Básica Superior'),
          jsonb_build_object('texto', 'BGU'),
          jsonb_build_object('texto', 'IB ★', 'highlight', true)
        )
      ),

      'niveles', jsonb_build_object(
        'badge', 'Formación por nivel',
        'heading', 'Cinco niveles, un mismo compromiso.',
        'headingHighlight', 'un mismo compromiso.',
        'descripcion', 'Cada etapa educativa está diseñada con metodologías de clase mundial, acompañamiento docente personalizado y herramientas digitales de vanguardia.',
        'headerPhotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
          'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80',
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80'
        ),
        'badgeAcreditado', 'IB ACREDITADO ★',
        'items', jsonb_build_array(
          jsonb_build_object(
            'num', '01',
            'title', 'Educación Inicial',
            'grades', 'Pre-Kinder y Kinder',
            'age', '3-5 años',
            'methods', jsonb_build_array('Montessori', 'Reggio Emilia', 'ABN'),
            'desc', 'Metodología basada en Montessori, Reggio Emilia y ABN que desarrolla autonomía, concentración y respeto desde los primeros años. Inglés lúdico con inmersión natural: una hora diaria integrada al entorno.'
          ),
          jsonb_build_object(
            'num', '02',
            'title', 'Básica Elemental y Media',
            'grades', '1ro a 7mo EGB',
            'age', '5-12 años',
            'methods', jsonb_build_array('CLIL', 'PBL', 'Mangahigh', 'ALEKS'),
            'desc', 'Inglés integrado con metodología CLIL desde 1ro EGB. Aprendizaje basado en proyectos (PBL) y plataformas líderes: Mangahigh (2do–5to) y ALEKS (6to–7mo) para matemáticas adaptativas. ABN hasta 4to EGB.'
          ),
          jsonb_build_object(
            'num', '03',
            'title', 'Básica Superior',
            'grades', '8vo a 10mo EGB',
            'age', '12-14 años',
            'methods', jsonb_build_array('Orientación vocacional', 'Inglés avanzado'),
            'desc', 'Etapa de consolidación y transición hacia el bachillerato. Fortalecimiento en todas las áreas, orientación vocacional y preparación para la siguiente etapa educativa.',
            'note', 'Contenido pedagógico completo próximamente — en coordinación con el equipo Atenas.'
          ),
          jsonb_build_object(
            'num', '04',
            'title', 'Bachillerato General',
            'grades', '1ro a 3ro BGU',
            'age', '15-17 años',
            'methods', jsonb_build_array('Tronco Común', 'MINEDUC'),
            'desc', 'Programa del Ministerio de Educación orientado a la formación integral. Asignaturas del Tronco Común que preparan a los estudiantes para la educación superior, el emprendimiento o la inserción laboral.'
          ),
          jsonb_build_object(
            'num', 'IB★',
            'title', 'Bachillerato Internacional',
            'grades', 'Diploma IB (PD)',
            'age', '1ro a 3ro · 16-18 años',
            'methods', jsonb_build_array('CAS', 'Monografía', 'TdC'),
            'desc', 'El Programa del Diploma IB desarrolla habilidades de pensamiento crítico, investigación y comunicación para universidades del mundo. Componentes del núcleo: CAS (Creatividad, Actividad y Servicio), Monografía de 4.000 palabras, y Teoría del Conocimiento.',
            'badge', 'ÚNICO IB EN AMBATO',
            'highlight', true
          )
        )
      ),

      'metodologias', jsonb_build_object(
        'badge', 'Diferenciadores pedagógicos',
        'heading', 'Metodologías que marcan la diferencia.',
        'headingHighlight', 'marcan la diferencia.',
        'strip', jsonb_build_array(
          jsonb_build_object('src', 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&q=80', 'caption', 'Aprendizaje colaborativo'),
          jsonb_build_object('src', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=700&q=80', 'caption', 'Ciencia y tecnología'),
          jsonb_build_object('src', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80', 'caption', 'Investigación IB')
        ),
        'cards', jsonb_build_array(
          jsonb_build_object(
            'icon', '🌿',
            'img', 'https://images.unsplash.com/photo-1587691592099-24045742c181?w=500&q=80',
            'scope', 'Educación Inicial',
            'title', 'Montessori & Reggio',
            'desc', 'Autonomía, concentración y respeto por los demás. Ambientes preparados para el aprendizaje activo desde los 3 años.'
          ),
          jsonb_build_object(
            'icon', '🌐',
            'img', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80',
            'scope', 'Básica Elemental y Media',
            'title', 'CLIL & PBL',
            'desc', 'Inglés integrado al currículo con inmersión lingüística. Proyectos reales que dan contexto y propósito al aprendizaje.'
          ),
          jsonb_build_object(
            'icon', '📐',
            'img', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&q=80',
            'scope', 'Básica — Plataformas digitales',
            'title', 'ABN · Mangahigh · ALEKS',
            'desc', 'Matemáticas con plataformas líderes mundiales. Del razonamiento numérico al dominio adaptativo en todos los niveles.'
          ),
          jsonb_build_object(
            'icon', '🎓',
            'img', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80',
            'scope', 'Bachillerato Internacional',
            'title', 'IB Diploma Program',
            'desc', 'CAS, Monografía y Teoría del Conocimiento. El programa más exigente y reconocido en universidades del mundo.',
            'dark', true
          )
        )
      ),

      'cta', jsonb_build_object(
        'bgImageSrc', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1440&q=80',
        'ghostText', 'IB DIPLOMA',
        'badge', 'El diferenciador Atenas',
        'heading', 'Bachillerato Internacional IB.',
        'headingHighlight', 'Internacional IB.',
        'descripcion', 'El único colegio en Ambato con el Programa del Diploma IB acreditado. Desarrolla pensamiento crítico, investigación independiente y ciudadanía global para acceder a universidades de todo el mundo.',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'CAS'),
          jsonb_build_object('texto', 'Monografía'),
          jsonb_build_object('texto', 'Teoría del Conocimiento'),
          jsonb_build_object('texto', 'Reconocido mundialmente')
        ),
        'btnText', 'Conocer el Programa IB',
        'btnHref', '/academico/ib',
        'stats', jsonb_build_array(
          jsonb_build_object('value', 'ÚNICO', 'label', 'Programa IB en Ambato',            'sub', 'Desde 2018 acreditado por IBO'),
          jsonb_build_object('value', '4.000', 'label', 'Palabras — Extended Essay',         'sub', 'Investigación independiente'),
          jsonb_build_object('value', '150+',  'label', 'Universidades que reconocen el IB', 'sub', 'Acceso global garantizado')
        ),
        'statsCardImg', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80'
      )
    ),
    'Niveles Educativos — Unidad Educativa Atenas',
    'Desde Educación Inicial hasta el Diploma IB: cinco niveles con metodologías de excelencia en la Unidad Educativa Atenas, Ambato.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
