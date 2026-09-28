-- ============================================================
-- Migración 094 — Asistente del panel: su clave es privada y su uso se anota.
--
-- QUÉ ES
--
-- El panel estrena un asistente de ayuda —botón «Ayuda», abajo a la
-- derecha— que responde con el manual de /admin/documentacion. Igual que el
-- chatbot público, su proveedor de IA, el modelo y la clave viven en
-- `configuracion_global`, bajo la key 'asistente'. La IA la paga el colegio.
--
-- DOS COSAS
--
-- 1. La key 'asistente' guarda una credencial, así que sale de la lectura
--    pública igual que 'correos' y 'chatbot' desde la 068. La lee solo el
--    servidor, con getConfiguracionPrivada().
--
-- 2. Tabla `asistente_uso`: UNA fila por pregunta, con los tokens que costó,
--    el modelo y en qué pantalla se hizo. NUNCA el texto de la pregunta ni de
--    la respuesta. Sirve para dos cosas: que el colegio vea cuánto gasta, y
--    saber en qué pantallas la gente se atasca, que es donde el manual está
--    flojo.
--
-- ORDEN DE APLICACIÓN: da igual. Sin esta migración el asistente responde
-- igual; solo pierde el registro de uso (queda en el log del servidor) y la
-- clave seguiría siendo legible por la clave anónima, que es lo que NO puede
-- quedarse así en producción. Correrla antes del push.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

begin;

-- 1. La clave del asistente no se sirve a la clave anónima -------------------

DROP POLICY IF EXISTS "configuracion_global_select_public" ON configuracion_global;
CREATE POLICY "configuracion_global_select_public"
  ON configuracion_global FOR SELECT
  TO anon, authenticated
  USING (key NOT IN ('correos', 'chatbot', 'asistente'));

COMMENT ON TABLE configuracion_global IS
  'Configuración global key-value del sitio. Las keys ''correos'', ''chatbot'' y '
  '''asistente'' guardan credenciales y NO son legibles con la clave anónima '
  '(migraciones 068 y 094): leerlas desde el servidor con getConfiguracionPrivada().';

-- 2. Registro de uso ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS asistente_uso (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at      timestamptz NOT NULL DEFAULT now(),
  -- Sin clave foránea a propósito: es un registro histórico. Un usuario
  -- borrado no debe arrastrar su gasto, ni su gasto impedir que se le borre
  -- (borrar usuarios ya falló una vez por una clave foránea olvidada).
  user_id         uuid,
  -- El PATRÓN de la pantalla, no la URL real: '/admin/admisiones/:id' y no
  -- el número de una solicitud concreta.
  pantalla        text NOT NULL,
  provider        text NOT NULL,
  model           text NOT NULL,
  tokens_entrada  integer NOT NULL DEFAULT 0,
  tokens_cache    integer NOT NULL DEFAULT 0,
  tokens_salida   integer NOT NULL DEFAULT 0,
  con_pantalla    boolean NOT NULL DEFAULT false,
  ok              boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE asistente_uso IS
  'Una fila por pregunta al asistente del panel: cuánto costó y desde qué '
  'pantalla. Nunca guarda el texto de la pregunta ni de la respuesta. '
  'Solo accesible con service_role.';
COMMENT ON COLUMN asistente_uso.pantalla IS
  'Patrón de la pantalla según el mapa de Header (p.ej. /admin/contenido/paginas/:id), '
  'nunca la URL real con identificadores.';
COMMENT ON COLUMN asistente_uso.tokens_entrada IS
  'Tokens de entrada cobrados a precio completo (sin los servidos desde caché).';
COMMENT ON COLUMN asistente_uso.tokens_cache IS
  'Tokens de entrada servidos desde la caché del proveedor (más baratos).';
COMMENT ON COLUMN asistente_uso.tokens_salida IS
  'Tokens de la respuesta, incluido el razonamiento interno si el modelo lo cobra.';
COMMENT ON COLUMN asistente_uso.con_pantalla IS
  'Si el usuario dejó que se enviara la estructura de su pantalla (títulos, botones, campos).';
COMMENT ON COLUMN asistente_uso.ok IS
  'false cuando el proveedor falló: la pregunta se hizo pero no hubo respuesta.';

CREATE INDEX IF NOT EXISTS idx_asistente_uso_created_at
  ON asistente_uso (created_at DESC);

ALTER TABLE asistente_uso ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE asistente_uso FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE asistente_uso TO service_role;

commit;
