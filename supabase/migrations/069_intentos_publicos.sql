-- ============================================================
-- Migración 069 — Límite de intentos en endpoints públicos.
--
-- PROBLEMA (auditoría del 2026-08-03)
--
-- El sitio no tiene límite de intentos en NINGÚN endpoint público. El caso
-- que obliga a arreglarlo es /api/admisiones/seguimiento: devolvía los datos
-- del aspirante pidiendo solo el número de solicitud, y los números son
-- secuenciales (ADM026-001, -002, …). Recorrerlos daba el padrón completo de
-- postulantes, con nombre y nivel. Son datos de menores.
--
-- El arreglo principal es exigir un segundo dato que solo tenga la familia
-- (el correo del representante). Esta tabla es la defensa secundaria: evita
-- que se pruebe ese segundo dato por fuerza bruta contra un número conocido.
--
-- POR QUÉ EN BASE Y NO EN MEMORIA
--
-- En Vercel cada petición puede caer en una instancia distinta y las
-- instancias se reciclan solas. Un contador en memoria se esquiva con
-- paciencia. La tabla es el único sitio compartido que tenemos.
--
-- SE REGISTRAN TODOS LOS INTENTOS, NO SOLO LOS FALLIDOS
--
-- Es deliberado, y costó una segunda pasada de auditoría entenderlo. Contar
-- solo los fallos obliga a contar ANTES de saber si el intento falla, y
-- entonces una ráfaga de peticiones simultáneas lee todas el contador a cero
-- y pasa entera. Registrando primero, el INSERT y el COUNT ocurren en la misma
-- llamada y el número que decide es el que devuelve esta función.
--
-- El precio es que las consultas legítimas también cuentan; por eso los
-- umbrales del servidor son holgados.
--
-- GENÉRICA A PROPÓSITO: la columna `endpoint` permite reusarla en el chatbot
-- —donde cada consulta cuesta dinero— y en el motor de formularios, sin otra
-- migración.
--
-- PRIVACIDAD: el `identificador` NO guarda la IP en claro, sino un hash con
-- sal. La IP es dato personal (LOPDP) y aquí quedaría además asociada a quien
-- consulta la solicitud de un menor. No es anonimización —un hash de IP es un
-- seudónimo estable y reversible por fuerza bruta si se conoce la sal—, pero
-- evita que la columna sea legible para quien acceda a la base. El aviso de
-- privacidad debe declararlo como identificador técnico seudonimizado.
--
-- ACCESO: sin políticas RLS a propósito. Con RLS activo y cero políticas,
-- anon y authenticated no pueden leer ni escribir NADA. Solo la service_role
-- llega, que es como la usa el servidor. Es deliberado, no un olvido.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

CREATE TABLE IF NOT EXISTS intentos_publicos (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  endpoint      text        NOT NULL,
  identificador text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE intentos_publicos IS
  'Intentos contra endpoints públicos, para limitar fuerza bruta. El '
  'identificador es un HASH con sal (nunca la IP en claro). Se registran todos '
  'los intentos, no solo los fallidos. Solo accesible con service_role.';
COMMENT ON COLUMN intentos_publicos.endpoint IS
  'Identificador lógico del contador, p.ej. "admisiones-seguimiento:ip".';
COMMENT ON COLUMN intentos_publicos.identificador IS
  'Hash con sal de quien lo intenta (IP) o del par recurso+IP.';

-- Índice de la consulta caliente: cuántos intentos de este identificador en
-- este endpoint durante los últimos N minutos.
CREATE INDEX IF NOT EXISTS idx_intentos_publicos_busqueda
  ON intentos_publicos (endpoint, identificador, created_at DESC);

-- Índice para la purga por antigüedad.
CREATE INDEX IF NOT EXISTS idx_intentos_publicos_created_at
  ON intentos_publicos (created_at);

ALTER TABLE intentos_publicos ENABLE ROW LEVEL SECURITY;

-- Sin CREATE POLICY: ver la nota de ACCESO en la cabecera.
--
-- Y por el mismo motivo que la función, tampoco basta con la RLS: los default
-- privileges de Supabase conceden GRANT ALL sobre las tablas nuevas de `public`
-- a anon y authenticated. Hoy la RLS sin políticas los frena igual, pero eso
-- deja una sola capa: la primera migración futura que añada una política "para
-- ver los intentos desde el panel" abriría la tabla a la clave anónima, que
-- viaja en el bundle del navegador. Se revocan los privilegios de tabla además
-- de la RLS.
REVOKE ALL ON TABLE intentos_publicos FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE intentos_publicos TO service_role;

-- ─── Registrar y contar, en una sola operación ────────────────
-- Va junto A PROPÓSITO: si el servidor contara por un lado y registrara por
-- otro, una ráfaga simultánea leería todas "0 intentos" antes de que ninguna
-- hubiera registrado el suyo, y pasarían todas. El valor que devuelve esta
-- función es el que decide si se bloquea.
CREATE OR REPLACE FUNCTION registrar_intento_publico(
  p_endpoint        text,
  p_identificador   text,
  p_ventana_minutos int DEFAULT 15
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_id    text := left(p_identificador, 64);
  v_total integer;
BEGIN
  -- Serializa por identificador durante la transacción. Sin esto, el INSERT y
  -- el COUNT juntos NO bastan: PostgREST abre una transacción por petición en
  -- READ COMMITTED, así que peticiones simultáneas no ven los INSERT sin
  -- confirmar de las otras y todas cuentan un número bajo. Una ráfaga de 300
  -- peticiones en paralelo pasaba entera. El coste es nulo salvo bajo ataque,
  -- que es justo cuando interesa pagarlo.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_endpoint || v_id, 0));

  INSERT INTO intentos_publicos (endpoint, identificador)
  VALUES (p_endpoint, v_id);

  SELECT count(*) INTO v_total
  FROM intentos_publicos
  WHERE endpoint = p_endpoint
    AND identificador = v_id
    AND created_at > now() - make_interval(mins => p_ventana_minutos);

  RETURN v_total;
END;
$$;

-- Sin SECURITY DEFINER: solo la ejecuta service_role, que ya salta la RLS.
-- Añadirlo sería superficie de ataque gratis.

-- ⚠️ `REVOKE ... FROM PUBLIC` NO BASTA en Supabase.
--
-- Supabase concede EXECUTE sobre las funciones de `public` a `anon` y
-- `authenticated` mediante default privileges, y esos grants sobreviven al
-- revoke de PUBLIC. Comprobado contra esta misma base: una función creada sin
-- ningún GRANT explícito responde igual a una llamada RPC hecha con la clave
-- anónima. Como esa clave viaja en el bundle del navegador, olvidar este
-- revoke deja la función expuesta a cualquiera.
--
-- Si algún día se hace DROP + CREATE de esta función, hay que copiar también
-- estas dos líneas: los default privileges se reaplican solos.
REVOKE ALL ON FUNCTION registrar_intento_publico(text, text, int)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION registrar_intento_publico(text, text, int)
  TO service_role;

-- La purga de registros viejos NO se expone como función: el servidor la hace
-- con un DELETE directo usando service_role. Una función destructiva en
-- `public` es una puerta de más que hay que acordarse de cerrar — y en la
-- primera versión de esta migración se olvidó, quedando ejecutable por anon.
--
-- Limpieza defensiva de esa primera versión, por si llegó a pegarse en el
-- editor SQL antes de corregirla. Se recorre pg_proc porque `DROP FUNCTION
-- IF EXISTS` con una firma concreta no borra las variantes con otra.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT oid::regprocedure AS firma
    FROM pg_proc
    WHERE proname IN ('purgar_intentos_fallidos', 'registrar_intento_fallido')
      AND pronamespace = 'public'::regnamespace
  LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %s', r.firma);
  END LOOP;
END $$;

DROP TABLE IF EXISTS intentos_fallidos;
