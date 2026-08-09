-- ============================================================
-- Migración 078 — Subir el techo de los archivos de formularios.
--
-- Hasta ahora el límite real eran 4 MB, y no por el bucket: **Vercel corta el
-- cuerpo de una petición en 4,5 MB**, así que un archivo mayor no llegaba
-- siquiera al código. El formulario de empleo del colegio admite 10 MB de hoja
-- de vida y 100 MB de audio de presentación, y con ese techo no se podía
-- replicar.
--
-- Ya no pasa: el navegador sube el archivo DIRECTO a Storage con un permiso
-- firmado (`POST /api/formularios/[slug]/subida`) y a nuestro servidor solo le
-- llega la ruta. Vercel deja de estar en medio, así que el único límite que
-- queda es el del bucket.
--
-- 100 MB es el mismo número que ya usan en su Google Forms para el audio.
-- ============================================================

BEGIN;

UPDATE storage.buckets
   SET file_size_limit = 104857600  -- 100 MB
 WHERE id = 'formularios-archivos';

-- Los campos del formulario de empleo vuelven a los tamaños del colegio y se
-- les quita la advertencia de los 4 MB, que ya no aplica.
UPDATE formularios
   SET campos = (
     SELECT jsonb_agg(
       CASE
         WHEN campo->>'key' = 'hoja_de_vida' THEN
           campo
             || '{"maxMb": 10}'::jsonb
             || jsonb_build_object(
                  'ayuda',
                  'Sube tu hoja de vida sin certificados ni documentos de identificación personal. PDF o Word, máximo 10 MB.'
                )
         WHEN campo->>'key' = 'audio_presentacion' THEN
           campo
             || '{"maxMb": 100}'::jsonb
             || jsonb_build_object(
                  'ayuda',
                  'Solo si la vacante lo pide (aplica a vacantes de idiomas). Audio o video de máximo 100 MB.'
                )
         ELSE campo
       END
       ORDER BY orden
     )
     FROM jsonb_array_elements(campos) WITH ORDINALITY AS t(campo, orden)
   )
 WHERE slug = 'postulacion-empleo';

COMMIT;
