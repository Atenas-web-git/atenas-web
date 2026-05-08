-- ============================================================
-- Migración 012 — Seed /matriculas/autorizaciones como plantilla C
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- Siembra la página `matriculas/autorizaciones` con plantilla C (Hero +
-- tarjetas de bancos + pasos numerados + nota), replicando el contenido
-- actual hardcodeado (con números de cuenta como placeholder XXXXXXX-X
-- pendientes del cliente real).
--
-- IDEMPOTENTE: si la página ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'matriculas/autorizaciones',
    'tpl_c_hero_pasos',
    'Autorizaciones Bancarias',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'MATRÍCULAS · AUTORIZACIONES',
        'title',     'Autorizaciones Bancarias',
        'subtitle',  'Realiza el pago de matrícula o pensión en cualquiera de los bancos autorizados y sube tu comprobante al portal.',
        'ghostText', 'BANCOS'
      ),
      'intro', jsonb_build_object(
        'badge',       'AUTORIZACIONES BANCARIAS',
        'heading',     'Cuentas para pago de matrícula',
        'descripcion', 'Realiza el pago en cualquiera de los bancos autorizados y sube el comprobante al portal de matrículas.'
      ),
      'tarjetas', jsonb_build_object(
        'titulo', 'Bancos autorizados',
        'items', jsonb_build_array(
          jsonb_build_object(
            'color',  '#1A4FA8',
            'titulo', 'Banco Pichincha',
            'filas',  jsonb_build_array(
              jsonb_build_object('label', 'Tipo',         'value', 'Cuenta Corriente'),
              jsonb_build_object('label', 'N° de cuenta', 'value', 'XXXXXXX-X', 'destacado', true),
              jsonb_build_object('label', 'Titular',      'value', 'Unidad Educativa Atenas'),
              jsonb_build_object('label', 'RUC',          'value', '1891XXXXXXX001')
            )
          ),
          jsonb_build_object(
            'color',  '#007A4D',
            'titulo', 'Banco del Pacífico',
            'filas',  jsonb_build_array(
              jsonb_build_object('label', 'Tipo',         'value', 'Cuenta de Ahorros'),
              jsonb_build_object('label', 'N° de cuenta', 'value', 'XXXXXXX-X', 'destacado', true),
              jsonb_build_object('label', 'Titular',      'value', 'Unidad Educativa Atenas'),
              jsonb_build_object('label', 'RUC',          'value', '1891XXXXXXX001')
            )
          ),
          jsonb_build_object(
            'color',  '#E6A817',
            'titulo', 'Banco Guayaquil',
            'filas',  jsonb_build_array(
              jsonb_build_object('label', 'Tipo',         'value', 'Cuenta Corriente'),
              jsonb_build_object('label', 'N° de cuenta', 'value', 'XXXXXXX-X', 'destacado', true),
              jsonb_build_object('label', 'Titular',      'value', 'Unidad Educativa Atenas'),
              jsonb_build_object('label', 'RUC',          'value', '1891XXXXXXX001')
            )
          )
        )
      ),
      'pasos', jsonb_build_object(
        'titulo', 'Pasos para subir el comprobante',
        'items', jsonb_build_array(
          jsonb_build_object('texto', 'Realiza la transferencia o depósito al banco de tu preferencia.'),
          jsonb_build_object('texto', 'Guarda el comprobante de pago en formato PDF o imagen (JPG/PNG).'),
          jsonb_build_object('texto', 'Ingresa al portal de matrículas y sube el comprobante en la sección correspondiente.'),
          jsonb_build_object('texto', 'Secretaría validará el pago en un plazo de 2 días hábiles y te notificará por correo.')
        )
      ),
      'nota', jsonb_build_object(
        'icono', '💬',
        'texto', '¿Tienes dudas sobre el pago? Contáctanos en <strong>secretaria@atenas.edu.ec</strong> o llámanos al <strong>032 456 789</strong>.'
      )
    ),
    'Autorizaciones Bancarias | Matrículas 2026–2027 | Atenas',
    'Cuentas bancarias autorizadas para el pago de matrícula y pensiones en la Unidad Educativa Atenas.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
