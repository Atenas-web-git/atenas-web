import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Protege todas las rutas bajo `/admin/*` excepto `/admin/login`.
 * Si no hay sesión activa, redirige al login.
 *
 * La verificación de roles + estado activo del perfil ocurre en
 * `src/app/admin/(authenticated)/layout.tsx` (con `getCurrentUser()`), no
 * aquí — el proxy solo verifica que haya sesión.
 *
 * ⚠️ Ojo con el nombre: **no existe `src/app/admin/layout.tsx`**. El del panel
 * está anidado dentro de `(authenticated)`, así que NO reemplaza al layout
 * raíz: `src/app/layout.tsx` envuelve también todo `/admin`, con sus etiquetas
 * de GTM, GA4 y los pixels dentro. Esta línea decía lo contrario y por eso
 * nadie lo vio en dos meses.
 * → ficha 2026-08-19-el-panel-manda-a-google-y-meta-lo-que-busca-secretaria
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo aplicamos al área /admin
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // /admin/login es público
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
