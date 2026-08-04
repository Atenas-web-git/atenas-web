/**
 * Wrapper fijo del email de admisiones.
 *
 * Define el "marco" visual común a todos los correos del pipeline:
 * header navy con título dinámico, área del mensaje (que se inyecta
 * desde la plantilla editada en el backoffice), bloque del N° de
 * seguimiento, CTA opcional al seguimiento público y footer.
 *
 * Este wrapper NO se edita desde la UI: se mantiene en código para
 * preservar el diseño consistente del colegio. Si el equipo de Atenas
 * decide cambiar el diseño global del email, eso se hace tocando este
 * archivo, no las plantillas individuales.
 *
 * Las plantillas en BD (`plantillas_correo_admision`) solo guardan:
 *   - titulo       (texto plano del header)
 *   - asunto       (asunto del email)
 *   - cuerpo_html  (HTML rico del cuerpo del mensaje)
 *
 * Y este wrapper inyecta esos campos en su lugar.
 */

type WrapperData = {
  titulo: string;
  contenido: string;
  numero: string;
  url_seguimiento: string;
  mostrar_cta?: boolean;
  texto_cta?: string;
};

export function buildWrappedEmail({
  titulo,
  contenido,
  numero,
  url_seguimiento,
  mostrar_cta = true,
  texto_cta = "Ver estado de mi solicitud →",
}: WrapperData): string {
  const cta = mostrar_cta
    ? `<a href="${url_seguimiento}" style="display:block;background:#1A2B4A;color:#fff;text-decoration:none;text-align:center;padding:13px 24px;border-radius:6px;font-size:13px;font-weight:700;margin:0 0 16px;">${texto_cta}</a>`
    : "";

  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1A2B4A;">
  <div style="background:#1A2B4A;padding:36px;border-radius:8px 8px 0 0;">
    <p style="color:#9e1915;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px;">Unidad Educativa Atenas</p>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;line-height:1.2;">${titulo}</h1>
  </div>
  <div style="background:#fff;padding:32px;border:1px solid #E8E4DD;border-top:none;border-radius:0 0 8px 8px;">
    <div style="font-size:14px;color:#374151;line-height:1.65;">${contenido}</div>
    <div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:8px;padding:14px 20px;text-align:center;margin:24px 0;">
      <p style="font-size:11px;font-weight:700;color:#6B7280;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px;">N° de seguimiento</p>
      <p style="font-size:20px;font-weight:800;color:#1A2B4A;margin:0;letter-spacing:1px;">${numero}</p>
    </div>
    ${cta}
    <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0;">¿Tienes dudas? Escríbenos a <a href="mailto:admisiones@atenas.edu.ec" style="color:#9e1915;">admisiones@atenas.edu.ec</a></p>
  </div>
  <p style="color:#bbb;font-size:11px;text-align:center;margin:14px 0 0;">Unidad Educativa Atenas · Izamba, Ambato, Ecuador</p>
</div>`;
}

/** Estados terminales — no muestran el CTA al seguimiento. */
const ESTADOS_TERMINALES = new Set(["matriculado", "no_admitido"]);

export function debeOcultarCta(estado: string): boolean {
  return ESTADOS_TERMINALES.has(estado);
}
