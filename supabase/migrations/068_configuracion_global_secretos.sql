-- ============================================================
-- Migración 068 — Cerrar la lectura pública de las keys con credenciales.
--
-- PROBLEMA (auditoría del 2026-08-03)
--
-- La migración 011 abrió `configuracion_global` a lectura pública sin
-- ningún filtro:
--
--     FOR SELECT TO anon, authenticated USING (true)
--
-- Era razonable entonces: la tabla solo guardaba las fechas de matrículas.
-- Hoy guarda también credenciales, en texto plano:
--
--   • key = 'correos'  → smtp.pass  y  resend.apiKey   (migración 040)
--   • key = 'chatbot'  → apiKey del modelo de lenguaje (migración 057)
--
-- Como NEXT_PUBLIC_SUPABASE_ANON_KEY viaja en el bundle del sitio —cosa
-- normal y correcta—, cualquiera podía pedirle esas filas a PostgREST
-- directamente desde el navegador y llevarse la contraseña del correo del
-- colegio. El enmascarado de la clave en el panel no protegía nada: el
-- acceso no pasaba por el panel.
--
-- SOLUCIÓN
--
-- La lectura pública sigue existiendo —de ella viven la marca, el pie de
-- página, el mega-menú, el SEO y el banner de matrículas del sitio
-- público— pero deja fuera las dos keys con credenciales.
--
-- El código que sí necesita leerlas lo hace desde el servidor con la
-- service_role key, vía `getConfiguracionPrivada()` en
-- src/lib/cms/getConfiguracion.ts. Los administradores autenticados
-- conservan el acceso por la política `configuracion_global_write_admin`,
-- que es FOR ALL y por tanto también cubre SELECT.
--
-- ⚠️ ORDEN DE APLICACIÓN: esta migración se corre DESPUÉS de desplegar el
-- código que usa `getConfiguracionPrivada()`. Al revés, el código en
-- producción se queda sin poder leer la configuración de correo y los
-- envíos fallan en silencio.
--
-- ⚠️ PENDIENTE OPERATIVO, no cubierto por este SQL: las credenciales
-- estuvieron expuestas, así que hay que ROTARLAS. Contraseña del SMTP
-- (la cambia el TI del colegio, conviene juntarlo con el cambio de
-- usuario a admisiones@) y API key de Resend.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

-- Keys cuyo valor contiene credenciales y por tanto NO se sirven a anon.
-- Si en el futuro se añade otra key con secretos, va en esta lista.
DROP POLICY IF EXISTS "configuracion_global_select_public" ON configuracion_global;
CREATE POLICY "configuracion_global_select_public"
  ON configuracion_global FOR SELECT
  TO anon, authenticated
  USING (key NOT IN ('correos', 'chatbot'));

COMMENT ON TABLE configuracion_global IS
  'Configuración global key-value del sitio. Las keys ''correos'' y ''chatbot'' '
  'guardan credenciales y NO son legibles con la clave anónima (migración 068): '
  'leerlas desde el servidor con getConfiguracionPrivada().';
