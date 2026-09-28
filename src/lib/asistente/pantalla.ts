/**
 * La «estructura de la pantalla»: lo que el asistente sabe de lo que el
 * usuario tiene delante.
 *
 * Es la lista de títulos, pestañas, botones, campos y avisos visibles. NUNCA
 * lo que hay escrito dentro de un campo, ni el contenido de una tabla: eso
 * son datos —de una familia, de un aspirante, de un empleado— y no salen del
 * panel. Este archivo no importa nada del navegador: lo comparten el lector
 * del cliente (`leerPantalla.ts`) y el saneado del servidor (`/api/asistente`).
 */

export type CampoPantalla = {
  etiqueta: string;
  /** «texto», «selector», «casilla», «área de texto», «archivo», «fecha»… */
  tipo: string;
  obligatorio?: boolean;
  deshabilitado?: boolean;
};

export type EstructuraPantalla = {
  titulos: string[];
  pestanas: string[];
  botones: string[];
  campos: CampoPantalla[];
  avisos: string[];
};

/** Topes. Pasan de largo en el cliente y se vuelven a aplicar en el servidor. */
export const LIMITES = {
  titulos: 15,
  pestanas: 15,
  botones: 40,
  campos: 60,
  avisos: 6,
  largo: 120,
  largoAviso: 240,
} as const;

/**
 * En Admisiones el panel maneja datos de menores. De ahí solo salen botones,
 * pestañas y etiquetas de campo. NI títulos —el de la ficha de una solicitud
 * es el nombre del aspirante—, NI avisos —un error puede llevar dentro un
 * nombre o un correo—, NI enlaces (eso lo filtra el cliente, que es quien
 * distingue un enlace de un botón).
 */
export function esRutaDeAdmisiones(ruta: string): boolean {
  return ruta === "/admin/admisiones" || ruta.startsWith("/admin/admisiones/");
}

/**
 * Lo que el servidor quita de una estructura venida de Admisiones, aunque el
 * navegador lo hubiera mandado. El cliente ya no los envía; esto es por si
 * alguien llama a la API con otro cliente.
 */
export function recortarParaAdmisiones(e: EstructuraPantalla): EstructuraPantalla {
  return { ...e, titulos: [], avisos: [] };
}

function textos(v: unknown, max: number, largo: number): string[] {
  if (!Array.isArray(v)) return [];
  const salida: string[] = [];
  for (const item of v) {
    if (typeof item !== "string") continue;
    const t = item.replace(/\s+/g, " ").trim().slice(0, largo);
    if (t && !salida.includes(t)) salida.push(t);
    if (salida.length >= max) break;
  }
  return salida;
}

/** Vuelve a validar en el servidor lo que mandó el cliente. Nunca se confía en el navegador. */
export function sanearEstructura(raw: unknown): EstructuraPantalla | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const campos: CampoPantalla[] = [];
  if (Array.isArray(r.campos)) {
    for (const c of r.campos) {
      if (!c || typeof c !== "object") continue;
      const cc = c as Record<string, unknown>;
      const etiqueta =
        typeof cc.etiqueta === "string"
          ? cc.etiqueta.replace(/\s+/g, " ").trim().slice(0, LIMITES.largo)
          : "";
      if (!etiqueta) continue;
      campos.push({
        etiqueta,
        tipo: typeof cc.tipo === "string" ? cc.tipo.slice(0, 24) : "texto",
        ...(cc.obligatorio === true ? { obligatorio: true } : {}),
        ...(cc.deshabilitado === true ? { deshabilitado: true } : {}),
      });
      if (campos.length >= LIMITES.campos) break;
    }
  }

  const estructura: EstructuraPantalla = {
    titulos: textos(r.titulos, LIMITES.titulos, LIMITES.largo),
    pestanas: textos(r.pestanas, LIMITES.pestanas, LIMITES.largo),
    botones: textos(r.botones, LIMITES.botones, LIMITES.largo),
    campos,
    avisos: textos(r.avisos, LIMITES.avisos, LIMITES.largoAviso),
  };

  const vacia =
    estructura.titulos.length +
      estructura.pestanas.length +
      estructura.botones.length +
      estructura.campos.length +
      estructura.avisos.length ===
    0;
  return vacia ? null : estructura;
}

/** Cómo se le cuenta al modelo. */
export function estructuraATexto(e: EstructuraPantalla): string {
  const partes: string[] = [];
  if (e.titulos.length) partes.push(`Títulos: ${e.titulos.join(" · ")}`);
  if (e.pestanas.length) partes.push(`Pestañas: ${e.pestanas.join(" · ")}`);
  if (e.botones.length) partes.push(`Botones y enlaces de acción: ${e.botones.join(" · ")}`);
  if (e.campos.length) {
    const lista = e.campos.map((c) => {
      const extras = [
        c.tipo,
        c.obligatorio ? "obligatorio" : null,
        c.deshabilitado ? "deshabilitado" : null,
      ]
        .filter(Boolean)
        .join(", ");
      return `- ${c.etiqueta} (${extras})`;
    });
    partes.push(`Campos del formulario:\n${lista.join("\n")}`);
  }
  if (e.avisos.length) partes.push(`Avisos visibles: ${e.avisos.join(" · ")}`);
  return partes.join("\n");
}
