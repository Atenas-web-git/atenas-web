-- ============================================================
-- 085 — La política de ESCRITURA de configuracion_global también daba lectura
--
-- La 068 cerró las keys con credenciales para `anon`:
--
--   configuracion_global_select_public
--     FOR SELECT TO anon, authenticated
--     USING (key NOT IN ('correos', 'chatbot'))
--
-- Pero no tocó la política de escritura de la 011, que es `FOR ALL`:
--
--   configuracion_global_write_admin
--     FOR ALL TO authenticated
--     USING (superadmin OR editor_admisiones OR editor_comm)
--
-- **`FOR ALL` incluye SELECT**, y en Postgres las políticas permisivas se
-- combinan con OR: basta con que una deje pasar. Así que la exclusión de la
-- 068 no aplicaba a un usuario autenticado con esos dos roles.
--
-- Qué se llevaba, en concreto: con la sesión de marketing o de secretaría
-- abierta, un GET a la API REST con su propio token devolvía la key `correos`
-- —contraseña SMTP y API key de Resend en claro— y la key `chatbot` —la API
-- key del modelo, que es un servicio de pago—. Con la contraseña SMTP se manda
-- correo COMO el colegio a cualquier familia.
--
-- Y la otra mitad: el WITH CHECK tenía los mismos roles, así que esos editores
-- también podían ESCRIBIR la key `correos` por la misma vía y cambiar el
-- destinatario de los avisos de admisión. A partir de ahí, cada solicitud
-- nueva —nombre del menor, nivel, correo y teléfono del representante— llegaba
-- al buzón que ellos eligieran, sin pasar por el panel y sin dejar rastro.
--
-- El arreglo es separar las dos cosas: la escritura deja de ser `FOR ALL` y
-- pasa a nombrar INSERT, UPDATE y DELETE. La lectura se queda solo con la
-- política de la 068, que sí excluye las keys con credenciales.
--
-- No cambia nada para la aplicación: TODO el panel lee y escribe esta tabla
-- con `service_role` (`createAdminClient`), que salta las políticas. Verificado
-- el 2026-08-20: ningún componente usa la sesión del usuario para esta tabla.
--
-- ⚠️ Esto NO rota las credenciales que estuvieron expuestas. La cabecera de la
-- 068 ya dejaba anotada esa rotación como pendiente; este hallazgo la vuelve
-- urgente en vez de higiénica.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

DROP POLICY IF EXISTS "configuracion_global_write_admin" ON configuracion_global;

DROP POLICY IF EXISTS "configuracion_global_insert_admin" ON configuracion_global;
CREATE POLICY "configuracion_global_insert_admin"
  ON configuracion_global FOR INSERT
  TO authenticated
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  );

DROP POLICY IF EXISTS "configuracion_global_update_admin" ON configuracion_global;
CREATE POLICY "configuracion_global_update_admin"
  ON configuracion_global FOR UPDATE
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  );

DROP POLICY IF EXISTS "configuracion_global_delete_admin" ON configuracion_global;
CREATE POLICY "configuracion_global_delete_admin"
  ON configuracion_global FOR DELETE
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  );

COMMENT ON TABLE configuracion_global IS
  'Configuración global key-value del sitio. Las keys ''correos'' y ''chatbot'' '
  'guardan credenciales y NO son legibles con la clave anónima (068) ni por '
  'ningún rol del panel (085): leerlas desde el servidor con '
  'getConfiguracionPrivada(), que usa service_role. La política de escritura '
  'nombra INSERT/UPDATE/DELETE a propósito — un FOR ALL daría SELECT también, '
  'que es justo el fallo que la 085 corrige.';
