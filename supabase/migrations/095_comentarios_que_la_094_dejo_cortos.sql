-- ============================================================
-- Migración 095 — Dos comentarios de la base que la 094 dejó cortos.
--
-- Solo documentación de la base: no cambia ni una tabla, ni una política, ni
-- un dato. Da igual cuándo se corra.
--
-- 1. El `COMMENT ON TABLE configuracion_global` de la 094 SUSTITUYÓ al de la
--    085 y con él se perdió la advertencia de que ningún rol del panel puede
--    leer las keys con credenciales y de por qué la política de escritura
--    nombra INSERT/UPDATE/DELETE en vez de FOR ALL. Es el patrón #44 aplicado
--    a los comentarios: un comentario nuevo pisa al viejo sin avisar. Aquí van
--    los dos textos juntos.
--
-- 2. El comentario de `asistente_uso.pantalla` decía «el mapa de Header».
--    El mapa se movió a `src/components/admin/mapaPantallas.ts` ese mismo día.
--
-- Lo cazó el auditor de cierre el 2026-09-27.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

begin;

COMMENT ON TABLE configuracion_global IS
  'Configuración global key-value del sitio. Las keys ''correos'', ''chatbot'' y '
  '''asistente'' guardan credenciales y NO son legibles con la clave anónima '
  '(068, 094) ni por ningún rol del panel (085): leerlas desde el servidor con '
  'getConfiguracionPrivada(), que usa service_role. La política de escritura '
  'nombra INSERT/UPDATE/DELETE a propósito — un FOR ALL daría SELECT también, '
  'que es justo el fallo que la 085 corrige.';

COMMENT ON COLUMN asistente_uso.pantalla IS
  'Patrón de la pantalla según el mapa de src/components/admin/mapaPantallas.ts '
  '(p.ej. /admin/contenido/paginas/:id), nunca la URL real con identificadores. '
  'Sin esta tabla, el asistente pierde el registro de uso Y el tope diario por '
  'usuario, que se cuenta aquí.';

commit;
