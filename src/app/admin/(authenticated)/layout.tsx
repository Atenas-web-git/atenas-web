import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { canAccessAdmin } from "@/lib/auth/types";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
// Tokens del panel + la capa que arregla foco, bordes de campo y tamaño de
// letra en las 64 pantallas a la vez. Se importa aquí y no en globals.css a
// propósito: el sitio público no debe cargar nada de esto.
import "../admin-ds.css";

// El backoffice nunca debe indexarse. robots.txt ya bloquea /admin/,
// pero declararlo también como metadata es defensa en profundidad.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/admin/login");
  if (!canAccessAdmin(user)) redirect("/admin/login?error=no_access");

  return (
    <div
      // `ds-admin` es el gancho de admin-ds.css. Sin esta clase la hoja no
      // aplica: todo lo de ahí cuelga de ella para no filtrarse al sitio público.
      //
      // `h-screen` + `overflow-hidden`, y no `min-h-screen`, para que el scroll
      // ocurra DENTRO del contenedor de contenido y no en la página entera.
      // Con `min-h-screen` este div crecía con el contenido, la página entera
      // se desplazaba, y el `overflow-auto` de abajo no llegaba a activarse
      // nunca: al bajar en una pantalla larga se perdían de vista el menú
      // lateral, el título y las migas de pan.
      className="ds-admin h-screen flex overflow-hidden"
      style={{ background: "#F4F1EB", fontFamily: "Poppins, sans-serif" }}
    >
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />
        {/* El único elemento que se desplaza. Las barras de guardado
            `sticky top-0` de los formularios de Configuración pasan a pegarse
            al borde superior de ESTA caja, es decir justo debajo de la
            cabecera, en lugar de al borde de la ventana. */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
