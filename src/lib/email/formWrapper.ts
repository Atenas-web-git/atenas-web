/**
 * Wrapper visual para las plantillas de correo de los FORMULARIOS públicos.
 *
 * Mantiene la misma identidad visual que `admisiones/email_wrapper.ts`
 * (header navy + caja blanca + footer) pero SIN la caja del N° de
 * seguimiento, porque los formularios genéricos no tienen un identificador
 * propio. Usado por:
 *
 *   - contactos
 *   - quejas
 *   - trabaja
 *   - admisiones-confirmacion (en su variante "antes de pasar al pipeline")
 *
 * Se mantiene en código (no editable desde UI) para preservar consistencia
 * de marca. Las plantillas en BD solo guardan título, asunto y cuerpo.
 */

type FormWrapperData = {
  titulo: string;
  contenido: string;
  /** Si viene, renderiza la caja con N° de seguimiento (caso admisiones-confirmacion). */
  numero?: string;
  /** Si viene, renderiza el CTA de seguimiento (caso admisiones-confirmacion). */
  url_seguimiento?: string;
};

export function buildFormWrappedEmail({
  titulo,
  contenido,
  numero,
  url_seguimiento,
}: FormWrapperData): string {
  const numeroBox = numero
    ? `<div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:8px;padding:14px 20px;text-align:center;margin:24px 0;">
      <p style="font-size:11px;font-weight:700;color:#6B7280;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px;">N° de seguimiento</p>
      <p style="font-size:20px;font-weight:800;color:#1A2B4A;margin:0;letter-spacing:1px;">${numero}</p>
    </div>`
    : "";
  const cta = url_seguimiento
    ? `<a href="${url_seguimiento}" style="display:block;background:#1A2B4A;color:#fff;text-decoration:none;text-align:center;padding:13px 24px;border-radius:6px;font-size:13px;font-weight:700;margin:0 0 16px;">Ver estado de mi solicitud →</a>`
    : "";

  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1A2B4A;">
  <div style="background:#1A2B4A;padding:36px;border-radius:8px 8px 0 0;">
    <p style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px;">Unidad Educativa Atenas</p>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;line-height:1.2;">${titulo}</h1>
  </div>
  <div style="background:#fff;padding:32px;border:1px solid #E8E4DD;border-top:none;border-radius:0 0 8px 8px;">
    <div style="font-size:14px;color:#374151;line-height:1.65;">${contenido}</div>
    ${numeroBox}
    ${cta}
    <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:20px 0 0;">¿Tienes dudas? Escríbenos a <a href="mailto:atenas@atenas.edu.ec" style="color:#C9A84C;">atenas@atenas.edu.ec</a></p>
  </div>
  <p style="color:#bbb;font-size:11px;text-align:center;margin:14px 0 0;">Unidad Educativa Atenas · Izamba, Ambato, Ecuador</p>
</div>`;
}
