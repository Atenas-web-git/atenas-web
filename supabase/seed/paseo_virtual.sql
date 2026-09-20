-- =============================================================================
-- Siembra del paseo virtual — 63 escenas y 229 puntos
-- -----------------------------------------------------------------------------
-- GENERADO, NO ESCRITO A MANO. Sale de `_Context/paseo-virtual-original/
-- _herramientas/generar-seed.py` a partir del tour de 2016 ya extraído.
--
-- Correrlo dos veces no duplica nada: las escenas van con `on conflict do
-- nothing` y los puntos solo entran si su escena todavía no tiene ninguno.
--
-- Requiere la migración 089.
-- =============================================================================

insert into public.paseo_escenas
  (slug, titulo, grupo, orden_grupo, orden, carpeta, vista_yaw, vista_pitch, vista_fov)
values
  ('vista-aerea', 'Vista Aérea', 'Administrativo', 1, 1, 'vista_aerea_30', 131.963, -35.0638, 35),
  ('ingreso', 'Ingreso', 'Administrativo', 1, 2, 'ingreso_14', 19.1142, 0.0705, 50),
  ('entrada-principal', 'Entrada Principal', 'Administrativo', 1, 3, 'entrada_principal_13', 1.4409, 0.3202, 65),
  ('gerencia', 'Gerencia', 'Administrativo', 1, 4, 'gerencia_15', -126.798, 1.1823, 60),
  ('rectorado', 'Rectorado', 'Administrativo', 1, 5, 'rectorado_23', -115.86, 0.44, 55),
  ('talento-humano', 'Talento Humano', 'Administrativo', 1, 6, 'talento_humano_29', -125.85, 0.4064, 55),
  ('secretaria-y-tesoreria', 'Secretaría y Tesorería', 'Administrativo', 1, 7, 'secretaria_y_tesorer_28', 46.873, 1.0501, 55),
  ('coordinacion-administrativa', 'Coordinación Administrativa', 'Administrativo', 1, 8, 'coordinacion_adminis_12', 106.946, 0, 55),
  ('marketing-y-admisiones', 'Marketing y Admisiones', 'Administrativo', 1, 9, 'marketing_y_admision_19', 79.8522, -0.2709, 55),
  ('proyeccion-academica', 'Proyección Académica', 'Administrativo', 1, 10, 'proyeccion_academica_21', -155.653, 0, 55),
  ('llave-del-aprendizaje', 'Llave del Aprendizaje', 'Administrativo', 1, 11, 'llave_del_aprendizaj_17', 43.6207, -0.8128, 55),
  ('recepcion', 'Recepción', 'Administrativo', 1, 12, 'recepcion_22', -151.921, -0.2709, 55),
  ('sala-de-directorio', 'Sala de Directorio', 'Administrativo', 1, 13, 'sala_de_directorio_24', -28.1773, 0, 55),
  ('sala-de-entrevistas', 'Sala de Entrevistas', 'Administrativo', 1, 14, 'sala_de_entrevistas_25', 0.1355, 0.6773, 55),
  ('sala-de-reunion', 'Sala de Reunión', 'Administrativo', 1, 15, 'sala_de_reunion_27', 138.31, -0.27, 75),
  ('lobby-de-ingreso', 'Lobby de ingreso', 'Administrativo', 1, 16, 'lobby_de_ingreso_18', -79.7142, 0.6563, 50),
  ('sala-de-espera', 'Sala de Espera', 'Administrativo', 1, 17, 'sala_de_espera_26', 157.685, 0.4064, 55),
  ('pasillo-a-oficinas', 'Pasillo a oficinas', 'Administrativo', 1, 18, 'pasillo_a_oficinas_20', 137.032, 0, 55),
  ('ingreso-a-oficinas', 'Ingreso a oficinas', 'Administrativo', 1, 19, 'ingreso_a_oficinas_16', -90.4926, -0.4064, 55),
  ('acceso', 'Acceso', 'Administrativo', 1, 20, 'acceso_10', 1.55, 1.77, 55),
  ('auditorio', 'Auditorio', 'Auditorio', 2, 1, 'auditorio_52', -135.468, 2.032, 55),
  ('escenario', 'Escenario', 'Auditorio', 2, 2, 'escenario_53', 160.259, 0.5419, 55),
  ('laboratorio-de-ciencias-experimentales', 'Laboratorio de Ciencias Experimentales', 'Bloque E', 3, 1, 'laboratorio_de_cienc_57', -129.507, 0.5419, 55),
  ('laboratorio-de-fisica', 'Laboratorio de Física', 'Bloque E', 3, 2, 'laboratorio_de_fisic_59', -135.468, 1.3547, 55),
  ('aula-modelo-escuela', 'Aula Modelo - Escuela', 'Bloque E', 3, 3, 'aula_modelo___escuel_56', -84.3966, 0.4064, 55),
  ('laboratorio-de-computacion', 'Laboratorio de Computación', 'Bloque E', 3, 4, 'laboratorio_de_compu_58', -139.938, 0.1355, 55),
  ('pasillo-y-lockers-c', 'Pasillo y lockers c', 'Bloque E', 3, 5, 'pasillo_y_lockers_c_72', -1.4902, 0, 55),
  ('aula-modelo-bachillerato', 'Aula Modelo - Bachillerato', 'Bloque C', 4, 1, 'aula_modelo___bachil_66', -75.4557, -0.6773, 55),
  ('dece', 'DECE', 'Bloque C', 4, 2, 'dece_67', -135.603, 0, 55),
  ('direccion-de-bachillerato', 'Dirección de Bachillerato', 'Bloque C', 4, 3, 'direccion_de_bachill_68', -28.3128, 0.5419, 55),
  ('laboratorio-de-computacion-c', 'Laboratorio de Computación C', 'Bloque C', 4, 4, 'laboratorio_de_compu_71', -137.229, -0.1355, 55),
  ('ingreso-de-alumnos', 'Ingreso de alumnos', 'Bloque C', 4, 5, 'ingreso_de_alumnos_69', -33.1897, -1.2192, 55),
  ('jardines', 'Jardines', 'Bloque C', 4, 6, 'jardines_70', 169.397, 0.5419, 55),
  ('pasillo-y-lockers', 'Pasillo y lockers', 'Bloque C', 4, 7, 'pasillo_y_lockers_60', 166.249, -0.1706, 55),
  ('inicial', 'Inicial', 'Bloque P', 5, 1, 'inicial_87', 0, 0, 55),
  ('bano-de-inicial', 'Baño de Inicial', 'Bloque P', 5, 2, 'bano_de_inicial_81', 0, 0, 55),
  ('sala-de-motricidad', 'Sala de Motricidad', 'Bloque P', 5, 3, 'sala_de_motricidad_91', -106.071, 1.0837, 55),
  ('area-de-juegos-inicial', 'Área de juegos Inicial', 'Bloque P', 5, 4, 'area_de_juegos_inici_80', -171.293, -0.8128, 55),
  ('sala-de-computacion-e-ingles', 'Sala de Computación e Inglés', 'Bloque P', 5, 5, 'sala_de_computacion__90', -164.458, -0.6773, 55),
  ('departamento-medico', 'Departamento Médico', 'Bloque P', 5, 6, 'departamento_medico_84', -152.808, -0.4064, 55),
  ('ingreso-a-la-biblioteca', 'Ingreso a la Biblioteca', 'Bloque P', 5, 7, 'ingreso_a_la_bibliot_86', -138.99, 0.4064, 55),
  ('biblioteca', 'Biblioteca', 'Bloque P', 5, 8, 'biblioteca_83', -130.382, 0.1355, 55),
  ('primer-grado', 'Primer Grado', 'Bloque P', 5, 9, 'primer_grado_89', 161.404, -0.8128, 55),
  ('bano', 'Baño', 'Bloque P', 5, 10, 'bano_82', -145.086, 5.6897, 55),
  ('direccion-inicial', 'Dirección Inicial', 'Bloque P', 5, 11, 'direccion_inicial_85', -105.603, -0.4064, 55),
  ('hall-de-acceso', 'Hall de acceso', 'Bloque P', 5, 12, 'plaza_de_acceso_88', 93.9409, 0.5419, 55),
  ('vista-aerea-de-inicial', 'Vista aérea de inicial', 'Bloque P', 5, 13, 'vista_aerea_de_inici_92', -6.6379, -16.1207, 55),
  ('cancha-sintetica', 'Cancha Sintética', 'Zonas Recreativas', 6, 1, 'cancha_sintetica_11', -134.791, -0.2709, 55),
  ('canchas-de-basket', 'Canchas de básket', 'Zonas Recreativas', 6, 2, 'canchas_de_basket_108', 123.202, -3.2512, 55),
  ('juegos-infantiles', 'Juegos infantiles', 'Zonas Recreativas', 6, 3, 'juegos_infantiles_112', 66.0549, -87.7357, 50),
  ('canchas-de-futbol', 'Canchas de fútbol', 'Zonas Recreativas', 6, 4, 'canchas_de_futbol_109', -1.3547, -40.6404, 55),
  ('bar', 'Bar', 'Zonas Recreativas', 6, 5, 'bar_107', -90.6281, -1.0837, 55),
  ('vista-aerea-de-canchas-y-juegos', 'Vista aérea de canchas y juegos', 'Zonas Recreativas', 6, 6, 'aerea_de_canchas_y_j_106', 179.076, -4.6022, 55),
  ('comedor', 'Comedor', 'Zonas Recreativas', 6, 7, 'comedor_111', 21.8966, -0.4926, 50),
  ('vista-aerea-de-juegos-y-canchas', 'Vista aérea de juegos y canchas', 'Zonas Recreativas', 6, 8, 'vista_aerea_de_juego_113', -163.314, 0.9131, 55),
  ('cocina', 'Cocina', 'Zonas Recreativas', 6, 9, 'cocina_110', -157.069, -0.4064, 55),
  ('bicicross', 'Bicicross', 'Zonas Recreativas', 6, 10, 'bicicross_122', 2.9803, -33.867, 55),
  ('aula-de-piano', 'Aula de Piano', 'Bloque A', 7, 1, 'aula_de_piano_124', -72.7463, -2.303, 55),
  ('aula-de-pintura', 'Aula de Pintura', 'Bloque A', 7, 2, 'aula_de_pintura_125', -42.266, -0.6773, 55),
  ('musica-y-guitarra', 'Música y Guitarra', 'Bloque A', 7, 3, 'musica_y_guitarra_126', 158.288, -2.5739, 55),
  ('radio', 'Radio', 'Bloque A', 7, 4, 'radio_127', -116.773, -4.335, 55),
  ('teatro-y-danza', 'Teatro y Danza', 'Bloque A', 7, 5, 'teatro_y_danza_128', -66.6502, 0.1355, 55),
  ('vista-aerea-del-bloque-a', 'Vista aérea del Bloque A', 'Bloque A', 7, 6, 'vista_aerea_del_bloq_129', 0, 0, 55)
on conflict (slug) do nothing;

-- Los puntos se resuelven por slug, no por id: los uuid los pone la base.

-- Vista Aérea → 12 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso', 135.7092::numeric, -46.6706::numeric, 'Estacionamiento', false, 1),
    ('canchas-de-futbol', 122.2592::numeric, -34.1545::numeric, 'Canchas de Fútbol', false, 2),
    ('canchas-de-basket', 130.7182::numeric, -27.6842::numeric, 'Canchas de Básket', false, 3),
    ('bicicross', 126.1998::numeric, -27.2068::numeric, 'Bicicross', false, 4),
    ('auditorio', 137.7583::numeric, -42.4809::numeric, 'Auditorio', false, 5),
    ('hall-de-acceso', 130.14::numeric, -36.7531::numeric, 'Inicial', false, 6),
    ('pasillo-y-lockers', 139.9126::numeric, -39.2458::numeric, 'Bloque C', false, 7),
    ('pasillo-y-lockers-c', 137.0754::numeric, -36.594::numeric, 'Bloque E', false, 8),
    ('bar', 128.9462::numeric, -31.3587::numeric, 'Bar', false, 9),
    ('lobby-de-ingreso', 131.4536::numeric, -43.5946::numeric, 'Ingreso Principal', false, 10),
    ('cancha-sintetica', 120.3678::numeric, -44.7082::numeric, 'Cancha Sintética', false, 11),
    ('vista-aerea-del-bloque-a', 134.9212::numeric, -25.0855::numeric, 'Bloque A', false, 12)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'vista-aerea'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Ingreso → 5 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea', -162.7095::numeric, 17.7118::numeric, 'Vista aérea', false, 1),
    ('entrada-principal', -16.155::numeric, -16.5343::numeric, 'Fachada', false, 2),
    ('cancha-sintetica', -48.9042::numeric, -10.4866::numeric, 'Cancha Sintética', false, 3),
    ('lobby-de-ingreso', -10.9109::numeric, -12.7885::numeric, 'Ingresar', false, 4),
    ('ingreso-de-alumnos', 19.0049::numeric, -8.4409::numeric, 'Ingreso de alumnos', false, 5)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'ingreso'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Entrada Principal → 5 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso', 143.4697::numeric, 0.295::numeric, 'Ingreso', false, 1),
    ('cancha-sintetica', -123.8879::numeric, -8.5262::numeric, 'Cancha Sintética', false, 2),
    ('vista-aerea', 168.3871::numeric, 19.5919::numeric, 'Vista aérea', false, 3),
    ('lobby-de-ingreso', -0.9148::numeric, -32.0762::numeric, 'Ingreso', false, 4),
    ('secretaria-y-tesoreria', 9.4436::numeric, -9.172::numeric, 'Secretaría y Tesorería', false, 5)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'entrada-principal'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Gerencia → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-a-oficinas', 145.3241::numeric, -5.9999::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'gerencia'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Rectorado → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-a-oficinas', 26.1648::numeric, -7.2632::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'rectorado'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Talento Humano → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('secretaria-y-tesoreria', 3.3617::numeric, -6.7347::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'talento-humano'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Secretaría y Tesorería → 6 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso-a-oficinas', 169.9124::numeric, -15.4737::numeric, 'Bajar', false, 1),
    ('sala-de-directorio', 134.6058::numeric, -2.842::numeric, 'Sala de Directorio', false, 2),
    ('sala-de-espera', -104.9738::numeric, -8.5262::numeric, 'Sala de Espera', false, 3),
    ('marketing-y-admisiones', -36.1955::numeric, -4.5985::numeric, 'Marketing y Admisiones', false, 4),
    ('pasillo-a-oficinas', -47.9347::numeric, -2.6278::numeric, 'Pasillo de oficinas', false, 5),
    ('talento-humano', -56.9102::numeric, -1.1957::numeric, 'Talento Humano', false, 6)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'secretaria-y-tesoreria'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Coordinación Administrativa → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-a-oficinas', -26.3768::numeric, -5.2258::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'coordinacion-administrativa'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Marketing y Admisiones → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('secretaria-y-tesoreria', -169.5652::numeric, -6.3871::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'marketing-y-admisiones'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Proyección Académica → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('recepcion', 46.0868::numeric, -6.9678::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'proyeccion-academica'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Llave del Aprendizaje → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('recepcion', 151.5942::numeric, -4.0646::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'llave-del-aprendizaje'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Recepción → 5 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso-a-oficinas', -91.1034::numeric, -7.2632::numeric, 'Salir', false, 1),
    ('acceso', 1.5761::numeric, -2.2106::numeric, 'Entrar', false, 2),
    ('proyeccion-academica', 73.1732::numeric, -9.2601::numeric, 'Proyección Académica', false, 3),
    ('sala-de-reunion', 78.525::numeric, 0.5202::numeric, 'Sala de Reunión', false, 4),
    ('llave-del-aprendizaje', 84.9056::numeric, -3.6416::numeric, 'Llave del Aprendizaje', false, 5)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'recepcion'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Sala de Directorio → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('secretaria-y-tesoreria', -128.3011::numeric, 1.579::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'sala-de-directorio'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Sala de Entrevistas → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('secretaria-y-tesoreria', 176.2171::numeric, -12.9474::numeric, 'Secretaría y Tesorería', true, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'sala-de-entrevistas'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Sala de Reunión → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('recepcion', 83.5376::numeric, -5.3685::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'sala-de-reunion'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Lobby de ingreso → 2 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso', -168.6515::numeric, -8.5262::numeric, 'Salir', false, 1),
    ('ingreso-a-oficinas', 7.8808::numeric, -5.3685::numeric, 'Ingreso', false, 2)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'lobby-de-ingreso'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Sala de Espera → 2 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('secretaria-y-tesoreria', 43.8178::numeric, 2.842::numeric, 'Secretaría', false, 1),
    ('marketing-y-admisiones', 10.4029::numeric, 2.842::numeric, 'Marketing y Admisiones', false, 2)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'sala-de-espera'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Pasillo a oficinas → 6 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('gerencia', -6.647::numeric, -2.6865::numeric, 'Gerencia', false, 1),
    ('coordinacion-administrativa', -122.6268::numeric, -3.4736::numeric, 'Coordinación Administrativa', false, 2),
    ('rectorado', -86.499::numeric, -7.0834::numeric, 'Rectorado', false, 3),
    ('sala-de-entrevistas', 107.4956::numeric, -5.9999::numeric, 'Sala de Entrevistas', false, 4),
    ('talento-humano', 140.9108::numeric, -4.7369::numeric, 'Talento Humano', false, 5),
    ('sala-de-directorio', 126.256::numeric, 1.2022::numeric, 'Sala de Directorio', false, 6)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'pasillo-a-oficinas'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Ingreso a oficinas → 3 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('lobby-de-ingreso', 1.5761::numeric, -10.4211::numeric, 'Salir', false, 1),
    ('secretaria-y-tesoreria', -174.4992::numeric, -11.6327::numeric, 'Segundo Piso', false, 2),
    ('recepcion', -86.0594::numeric, -5.9999::numeric, 'Entrar', false, 3)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'ingreso-a-oficinas'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Acceso → 3 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('recepcion', -172.4343::numeric, -5.9999::numeric, 'Entrar', false, 1),
    ('jardines', 2.8372::numeric, 7.8948::numeric, 'Jardines', false, 2),
    ('ingreso-de-alumnos', 96.7777::numeric, -1.579::numeric, 'Ingreso de alumnos', false, 3)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'acceso'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Auditorio → 2 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('escenario', -138.3887::numeric, 0.3157::numeric, 'Escenario', false, 1),
    ('ingreso-de-alumnos', 130.1926::numeric, -0.9473::numeric, 'Salir', false, 2)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'auditorio'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Escenario → 2 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('auditorio', -134.6058::numeric, -9.1579::numeric, 'Auditorio', true, 1),
    ('ingreso-de-alumnos', -111.0145::numeric, -2.3226::numeric, 'Salir', false, 2)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'escenario'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Laboratorio de Ciencias Experimentales → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers-c', -45.0788::numeric, -9.1579::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'laboratorio-de-ciencias-experimentales'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Laboratorio de Física → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers-c', 3.2407::numeric, -1.4755::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'laboratorio-de-fisica'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Aula Modelo - Escuela → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers', -60.21::numeric, -5.3685::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'aula-modelo-escuela'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Laboratorio de Computación → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers', -118.7233::numeric, -1.4755::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'laboratorio-de-computacion'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Pasillo y lockers c → 6 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('laboratorio-de-ciencias-experimentales', 63.3625::numeric, -2.842::numeric, 'Laboratorio De Ciencias Experimentales', false, 1),
    ('laboratorio-de-fisica', -114.4307::numeric, -5.9999::numeric, 'Laboratorio de Física', false, 2),
    ('aula-modelo-escuela', 30.578::numeric, -4.7369::numeric, 'Aula Modelo', false, 3),
    ('laboratorio-de-computacion', -152.2592::numeric, -3.4736::numeric, 'Laboratorio de Computación', false, 4),
    ('jardines', 42.029::numeric, 0.5806::numeric, 'Salir', false, 5),
    ('jardines', -137.6812::numeric, 0.5806::numeric, 'Salir', false, 6)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'pasillo-y-lockers-c'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Aula Modelo - Bachillerato → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers', -151.6287::numeric, -4.7369::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'aula-modelo-bachillerato'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- DECE → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers', 79.1244::numeric, -8.5262::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'dece'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Dirección de Bachillerato → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers', -148.7725::numeric, -12.6886::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'direccion-de-bachillerato'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Laboratorio de Computación C → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers', -107.5288::numeric, -2.0655::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'laboratorio-de-computacion-c'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Ingreso de alumnos → 8 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('auditorio', -111.2785::numeric, -21.7895::numeric, 'Auditorio', false, 1),
    ('acceso', 50.7532::numeric, -14.2105::numeric, 'Oficinas Administrativas', false, 2),
    ('pasillo-y-lockers', -125.7793::numeric, -5.9999::numeric, 'Pasillo y lockers', true, 3),
    ('aula-modelo-bachillerato', -140.9108::numeric, -8.5262::numeric, 'Aula Modelo - Bachillerato', true, 4),
    ('laboratorio-de-computacion-c', -140.5796::numeric, 0.5807::numeric, 'Laboratorio de Computación', false, 5),
    ('direccion-de-bachillerato', -140.5922::numeric, 9.6637::numeric, 'Dirección de Bachillerato', false, 6),
    ('dece', -159.1371::numeric, -7.1023::numeric, 'DECE', false, 7),
    ('ingreso', -33.9289::numeric, -3.2103::numeric, 'Salir', false, 8)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'ingreso-de-alumnos'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Jardines → 14 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('auditorio', -68.4065::numeric, -18.0::numeric, 'Auditorio', false, 1),
    ('recepcion', 3.981::numeric, -31.1429::numeric, 'Ingreso a oficinas administrativas', false, 2),
    ('ingreso-de-alumnos', -51.1848::numeric, -26.2857::numeric, 'Ingreso de alumnos', false, 3),
    ('aula-modelo-bachillerato', -91.3475::numeric, -11.9435::numeric, 'Aula Modelo - Bachillerato', false, 4),
    ('laboratorio-de-computacion-c', -87.8047::numeric, -6.4897::numeric, 'Laboratorio de Computación', false, 5),
    ('direccion-de-bachillerato', -88.5596::numeric, -1.0345::numeric, 'Dirección de Bachillerato', false, 6),
    ('dece', -106.2346::numeric, -12.9474::numeric, 'DECE', false, 7),
    ('pasillo-y-lockers-c', -173.6953::numeric, -8.5262::numeric, 'Ingreso a Bloque E', false, 8),
    ('laboratorio-de-computacion', -164.4512::numeric, -4.5511::numeric, 'Laboratorio de Computación', false, 9),
    ('cancha-sintetica', 50.1732::numeric, -7.1278::numeric, 'Cancha Sintética', false, 10),
    ('biblioteca', 143.1497::numeric, -4.8469::numeric, 'Biblioteca', false, 11),
    ('hall-de-acceso', 154.8662::numeric, -5.0369::numeric, 'Ingreso a Inicial', false, 12),
    ('canchas-de-futbol', 99.3071::numeric, -6.7477::numeric, 'Canchas de fútbol', false, 13),
    ('sala-de-espera', 3.981::numeric, -19.4286::numeric, 'Administrativo', false, 14)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'jardines'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Pasillo y lockers → 5 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('dece', -94.8863::numeric, -1.579::numeric, 'DECE', false, 1),
    ('aula-modelo-bachillerato', -128.9318::numeric, -2.842::numeric, 'Aula Modelo Bachillerato', false, 2),
    ('direccion-de-bachillerato', 27.4255::numeric, -0.9473::numeric, 'Dirección de Bachillerato', false, 3),
    ('laboratorio-de-computacion-c', -157.9334::numeric, -4.7369::numeric, 'Laboratorio de Computación', false, 4),
    ('jardines', 43.7681::numeric, 0.5806::numeric, 'Salir', false, 5)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'pasillo-y-lockers'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Inicial → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('bano-de-inicial', -102.5233::numeric, -5.6878::numeric, 'Baño', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'inicial'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Baño de Inicial → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('inicial', 102.8149::numeric, -10.3279::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'bano-de-inicial'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Sala de Motricidad → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('hall-de-acceso', 137.7583::numeric, -4.1053::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'sala-de-motricidad'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Área de juegos Inicial → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('hall-de-acceso', 67.1454::numeric, -6.6316::numeric, 'Entrar a Inicial', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'area-de-juegos-inicial'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Sala de Computación e Inglés → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('hall-de-acceso', 167.1952::numeric, -2.5078::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'sala-de-computacion-e-ingles'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Departamento Médico → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('hall-de-acceso', 55.679::numeric, -9.1476::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'departamento-medico'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Ingreso a la Biblioteca → 2 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('biblioteca', -139.2577::numeric, -6.3569::numeric, 'Biblioteca', false, 1),
    ('hall-de-acceso', 45.0788::numeric, -13.579::numeric, 'Salir', false, 2)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'ingreso-a-la-biblioteca'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Biblioteca → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso-a-la-biblioteca', -160.2899::numeric, -4.0645::numeric, 'Recepción de Biblioteca', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'biblioteca'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Primer Grado → 2 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('hall-de-acceso', -11.6636::numeric, -5.3685::numeric, 'Salir', false, 1),
    ('bano', -46.8266::numeric, -5.7226::numeric, 'Baño', false, 2)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'primer-grado'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Baño → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('primer-grado', -44.4845::numeric, -13.2786::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'bano'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Dirección Inicial → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('hall-de-acceso', 171.0241::numeric, -12.4864::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'direccion-inicial'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Hall de acceso → 9 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso-a-la-biblioteca', 87.2464::numeric, -5.8065::numeric, 'Ingresar a la Biblioteca', false, 1),
    ('vista-aerea-de-inicial', 42.3306::numeric, -2.839::numeric, 'Salir', false, 2),
    ('direccion-inicial', 29.1542::numeric, -0.5371::numeric, 'Dirección de Inicial', false, 3),
    ('departamento-medico', -35.5154::numeric, -4.9873::numeric, 'Departamento Médico', false, 4),
    ('area-de-juegos-inicial', 131.4536::numeric, -4.1053::numeric, 'Área de juegos infantiles', false, 5),
    ('primer-grado', -88.601::numeric, -7.1626::numeric, 'Primer Grado', false, 6),
    ('inicial', -47.5646::numeric, -0.9342::numeric, 'Inicial', false, 7),
    ('sala-de-motricidad', 177.5131::numeric, -4.6714::numeric, 'Sala de Motricidad', false, 8),
    ('sala-de-computacion-e-ingles', -136.9886::numeric, -0.8852::numeric, 'Ir a la Sala de Computación e Inglés', false, 9)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'hall-de-acceso'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Vista aérea de inicial → 16 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('pasillo-y-lockers-c', 19.0354::numeric, -69.9257::numeric, 'Ingreso a Bloque E', false, 1),
    ('auditorio', 148.1832::numeric, -36.295::numeric, 'Auditorio', false, 2),
    ('acceso', -178.8216::numeric, -39.2459::numeric, 'Ingreso a oficinas Administrativas', false, 3),
    ('ingreso-de-alumnos', 161.735::numeric, -39.836::numeric, 'Ingreso de alumnos', false, 4),
    ('pasillo-y-lockers', 89.2634::numeric, -46.9181::numeric, 'Ingreso a Bloque C', false, 5),
    ('hall-de-acceso', -49.7873::numeric, -51.6393::numeric, 'Hall de Inicial', false, 6),
    ('biblioteca', -73.9444::numeric, -48.6886::numeric, 'Biblioteca', false, 7),
    ('direccion-inicial', -69.8198::numeric, -71.705::numeric, 'Dirección de Inicial', false, 8),
    ('area-de-juegos-inicial', -63.9551::numeric, -41.9218::numeric, 'Área de juegos de inicial', false, 9),
    ('inicial', -24.0642::numeric, -57.6779::numeric, 'Inicial', false, 10),
    ('primer-grado', -30.6648::numeric, -48.2044::numeric, 'Primer Grado', false, 11),
    ('sala-de-motricidad', -49.091::numeric, -41.517::numeric, 'Sala de Motricidad', false, 12),
    ('sala-de-computacion-e-ingles', -39.4654::numeric, -31.7648::numeric, 'Sala de Computación e Inglés', false, 13),
    ('bar', -23.6189::numeric, -18.5639::numeric, 'Bar', false, 14),
    ('comedor', -28.9318::numeric, -21.0314::numeric, 'Comedor', false, 15),
    ('juegos-infantiles', -12.0694::numeric, -22.9113::numeric, 'Juegos Infantiles', false, 16)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'vista-aerea-de-inicial'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Cancha Sintética → 2 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('ingreso', -131.9443::numeric, -1.1408::numeric, 'Salir', false, 1),
    ('canchas-de-futbol', 165.8279::numeric, -0.5782::numeric, 'Canchas de Fútbol', false, 2)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'cancha-sintetica'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Canchas de básket → 8 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('bicicross', -158.6898::numeric, -9.8415::numeric, 'Bicicross', false, 1),
    ('vista-aerea-del-bloque-a', 2.1312::numeric, -13.5499::numeric, 'Acceso a Bloque A', false, 2),
    ('canchas-de-futbol', 160.3948::numeric, -5.2774::numeric, 'Canchas de Fútbol', false, 3),
    ('vista-aerea-de-juegos-y-canchas', 115.6777::numeric, -6.0115::numeric, 'Canchas y juegos', false, 4),
    ('bar', 132.8983::numeric, -5.8239::numeric, 'Bar', false, 5),
    ('hall-de-acceso', 125.505::numeric, -3.5424::numeric, 'Acceso a Inicial', false, 6),
    ('cancha-sintetica', 137.191::numeric, -2.8219::numeric, 'Cancha Sintética', false, 7),
    ('teatro-y-danza', 1.5041::numeric, -4.3502::numeric, 'Teatro y Danza', false, 8)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'canchas-de-basket'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Juegos infantiles → 12 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('bar', 96.449::numeric, -29.6091::numeric, 'Bar', false, 1),
    ('cocina', 78.5455::numeric, -28.0456::numeric, 'Cocina', false, 2),
    ('comedor', 60.8342::numeric, -30.1954::numeric, 'Comedor', false, 3),
    ('hall-de-acceso', -16.1712::numeric, -12.9967::numeric, 'Acceso a Inicial', false, 4),
    ('pasillo-y-lockers-c', -34.7209::numeric, -15.1027::numeric, 'Ingreso a Bloque C', false, 5),
    ('canchas-de-futbol', 39.1817::numeric, -13.8688::numeric, 'Canchas de Fútbol', false, 6),
    ('canchas-de-basket', 150.9984::numeric, -11.6842::numeric, 'Canchas de Básket', false, 7),
    ('vista-aerea-de-juegos-y-canchas', 167.3906::numeric, -18.6316::numeric, 'Vista aérea de juegos y canchas', false, 8),
    ('bicicross', 127.2881::numeric, -8.581::numeric, 'Bicicross', false, 9),
    ('vista-aerea-del-bloque-a', 161.7689::numeric, -6.7183::numeric, 'Vista aérea del Bloque A', false, 10),
    ('aula-de-pintura', 168.9026::numeric, -5.9202::numeric, 'Aula de Pintura', false, 11),
    ('cancha-sintetica', -6.6503::numeric, -6.2199::numeric, 'Cancha Sintética', false, 12)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'juegos-infantiles'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Canchas de fútbol → 11 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('hall-de-acceso', -25.1363::numeric, -28.7609::numeric, 'Acceso a Inicial', false, 1),
    ('bar', -94.0932::numeric, -31.5::numeric, 'Bar', false, 2),
    ('cocina', -92.3594::numeric, -35.6087::numeric, 'Cocina', false, 3),
    ('comedor', -85.6181::numeric, -37.9566::numeric, 'Comedor', false, 4),
    ('juegos-infantiles', -76.1796::numeric, -29.5434::numeric, 'Juegos Infantiles', false, 5),
    ('pasillo-y-lockers-c', -29.3738::numeric, -24.2609::numeric, 'Acceso a Bloque E', false, 6),
    ('canchas-de-basket', -116.6215::numeric, -18.6695::numeric, 'Canchas de Básket', false, 7),
    ('bicicross', -133.7054::numeric, -19.0523::numeric, 'Bicicross', false, 8),
    ('secretaria-y-tesoreria', -2.4376::numeric, -20.2146::numeric, 'Administrativo', false, 9),
    ('cancha-sintetica', 28.6101::numeric, -18.927::numeric, 'Cancha Sintética', false, 10),
    ('vista-aerea-del-bloque-a', -114.3122::numeric, -14.2918::numeric, 'Bloque A', false, 11)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'canchas-de-futbol'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Bar → 4 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea-de-juegos-y-canchas', 51.8841::numeric, -2.3226::numeric, 'Salir', false, 1),
    ('vista-aerea-de-juegos-y-canchas', 111.5942::numeric, -5.8065::numeric, 'Salir', false, 2),
    ('vista-aerea-de-juegos-y-canchas', -6.6667::numeric, -6.3871::numeric, 'Salir', false, 3),
    ('cocina', -175.3638::numeric, -0.5821::numeric, 'Cocina', false, 4)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'bar'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Vista aérea de canchas y juegos → 10 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('canchas-de-basket', 168.2676::numeric, -4.4739::numeric, 'Canchas de Básket', false, 1),
    ('bar', 122.1613::numeric, -5.3064::numeric, 'Bar', false, 2),
    ('comedor', 98.9021::numeric, -10.7168::numeric, 'Comedor', false, 3),
    ('cocina', 110.223::numeric, -8.2197::numeric, 'Cocina', false, 4),
    ('hall-de-acceso', 20.8919::numeric, -4.4739::numeric, 'Acceso a Inicial', false, 5),
    ('pasillo-y-lockers-c', -5.8662::numeric, -6.763::numeric, 'Ingreso a Bloque E', false, 6),
    ('canchas-de-futbol', 73.5851::numeric, -4.4739::numeric, 'Canchas de Fútbol', false, 7),
    ('teatro-y-danza', -166.1136::numeric, -2.1989::numeric, 'Teatro y Danza', false, 8),
    ('aula-de-pintura', -171.1904::numeric, -1.1372::numeric, 'Aula de Pintura', false, 9),
    ('vista-aerea-del-bloque-a', -178.3575::numeric, -1.289::numeric, 'Acceso al Bloque A', false, 10)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'vista-aerea-de-canchas-y-juegos'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Comedor → 3 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea-de-canchas-y-juegos', -28.746::numeric, -6.1803::numeric, 'Salir', false, 1),
    ('cocina', -82.3794::numeric, -3.4764::numeric, 'Cocina', false, 2),
    ('cocina', -61.9293::numeric, -2.7039::numeric, 'Cocina', false, 3)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'comedor'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Vista aérea de juegos y canchas → 8 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('canchas-de-basket', -25.4394::numeric, -9.7524::numeric, 'Canchas de Básket', false, 1),
    ('bar', -136.877::numeric, -12.6059::numeric, 'Bar', false, 2),
    ('juegos-infantiles', -170.0993::numeric, -15.8823::numeric, 'Juegos Infantiles', false, 3),
    ('canchas-de-futbol', -123.786::numeric, -6.9381::numeric, 'Canchas de Fútbol', false, 4),
    ('vista-aerea-del-bloque-a', -4.2372::numeric, -4.0655::numeric, 'Ingreso al Bloque A', false, 5),
    ('bicicross', -55.7107::numeric, -5.6599::numeric, 'Bicicross', false, 6),
    ('teatro-y-danza', 13.81::numeric, -1.674::numeric, 'Teatro y Danza', false, 7),
    ('aula-de-pintura', 6.5912::numeric, -2.1523::numeric, 'Aula de Pintura', false, 8)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'vista-aerea-de-juegos-y-canchas'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Cocina → 3 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('comedor', -42.4789::numeric, -1.8367::numeric, 'Comedor', false, 1),
    ('bar', 172.6654::numeric, -1.2245::numeric, 'Bar', false, 2),
    ('juegos-infantiles', 115.0726::numeric, -4.6451::numeric, 'Salir', false, 3)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'cocina'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Bicicross → 9 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('canchas-de-futbol', -115.3264::numeric, -3.1914::numeric, 'Canchas de Fútbol', false, 1),
    ('canchas-de-basket', 152.4632::numeric, -8.0426::numeric, 'Canchas de Básket', false, 2),
    ('vista-aerea-del-bloque-a', 122.8478::numeric, -2.6557::numeric, 'Ingreso al Bloque A', false, 3),
    ('musica-y-guitarra', 108.644::numeric, -3.508::numeric, 'Música y Guitarra', false, 4),
    ('aula-de-pintura', 113.5429::numeric, -3.3084::numeric, 'Aula de Pintura', false, 5),
    ('radio', 109.4915::numeric, -1.1502::numeric, 'Radio', false, 6),
    ('vista-aerea-de-canchas-y-juegos', -159.1212::numeric, -3.1498::numeric, 'Canchas y Juegos', false, 7),
    ('hall-de-acceso', -137.9596::numeric, -1.7219::numeric, 'Acceso a Inicial', false, 8),
    ('cancha-sintetica', -122.7964::numeric, -1.7219::numeric, 'Cancha Sintética', false, 9)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'bicicross'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Aula de Piano → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea-del-bloque-a', -163.6077::numeric, -4.7369::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'aula-de-piano'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Aula de Pintura → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea-del-bloque-a', 93.6252::numeric, -0.9473::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'aula-de-pintura'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Música y Guitarra → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea-del-bloque-a', -111.9089::numeric, -2.842::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'musica-y-guitarra'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Radio → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea-del-bloque-a', 112.8496::numeric, -3.4256::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'radio'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Teatro y Danza → 1 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('vista-aerea-del-bloque-a', -136.4972::numeric, -4.7369::numeric, 'Salir', false, 1)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'teatro-y-danza'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);

-- Vista aérea del Bloque A → 12 acceso(s)
insert into public.paseo_puntos (escena_id, destino_id, yaw, pitch, etiqueta, etiqueta_automatica, orden)
select o.id, d.id, v.yaw, v.pitch, v.etiqueta, v.automatica, v.orden
from public.paseo_escenas o
cross join lateral (values
    ('teatro-y-danza', 17.5154::numeric, -10.6994::numeric, 'Teatro y Danza', false, 1),
    ('aula-de-pintura', -1.3666::numeric, -16.4894::numeric, 'Aula de Pintura', false, 2),
    ('musica-y-guitarra', -19.7971::numeric, -10.7878::numeric, 'Música y Guitarra', false, 3),
    ('canchas-de-basket', 165.8189::numeric, -14.9143::numeric, 'Canchas de Básket', false, 4),
    ('canchas-de-futbol', 170.073::numeric, -5.4515::numeric, 'Canchas de Fútbol', false, 5),
    ('bar', 150.084::numeric, -5.0807::numeric, 'Bar', false, 6),
    ('comedor', 147.2944::numeric, -4.5364::numeric, 'Comedor', false, 7),
    ('hall-de-acceso', 139.756::numeric, -3.0847::numeric, 'Ingreso a Inicial', false, 8),
    ('pasillo-y-lockers-c', 130.9712::numeric, -3.6895::numeric, 'Ingreso a Bloque E', false, 9),
    ('vista-aerea-de-juegos-y-canchas', 134.622::numeric, -6.3304::numeric, 'Juegos y Canchas', false, 10),
    ('aula-de-piano', 3.3898::numeric, -4.0572::numeric, 'Aula de Piano', false, 11),
    ('radio', -19.1876::numeric, -4.3151::numeric, 'Radio', false, 12)
  ) as v(destino_slug, yaw, pitch, etiqueta, automatica, orden)
join public.paseo_escenas d on d.slug = v.destino_slug
where o.slug = 'vista-aerea-del-bloque-a'
  and not exists (select 1 from public.paseo_puntos p where p.escena_id = o.id);
