import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Protege todas las rutas bajo `/admin/*` excepto `/admin/login`.
 * Si no hay sesión activa, redirige al login.
 *
 * La verificación de roles + estado activo del perfil ocurre en
 * `src/app/admin/layout.tsx` (con `getCurrentUser()`), no aquí —
 * el proxy solo verifica que haya sesión.
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
