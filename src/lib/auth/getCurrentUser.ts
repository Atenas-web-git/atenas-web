import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminUser, RoleSlug } from "./types";

/**
 * Obtiene el usuario autenticado + su perfil + roles asignados.
 *
 * Usa el cliente con cookies para verificar la sesión (auth.getUser),
 * y el cliente admin (service_role) para leer profile y roles. Esto
 * evita problemas de RLS justo después del login (cuando el JWT puede
 * no haberse propagado todavía al backend de Postgres).
 *
 * Devuelve null si no hay sesión, si el perfil no existe / está inactivo,
 * o si las tablas aún no se ejecutaron en Supabase.
 */
export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const admin = createAdminClient();

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, full_name, avatar_url, is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile || !profile.is_active) return null;

    const { data: rolesData } = await admin
      .from("user_roles")
      .select("roles(slug)")
      .eq("user_id", user.id);

    const roles: RoleSlug[] = (rolesData ?? [])
      .map((r) => {
        const rel = (r as { roles: { slug: string } | { slug: string }[] | null }).roles;
        if (!rel) return null;
        const slug = Array.isArray(rel) ? rel[0]?.slug : rel.slug;
        return (slug ?? null) as RoleSlug | null;
      })
      .filter((s): s is RoleSlug => s !== null);

    return {
      id: profile.id,
      email: user.email ?? "",
      fullName: profile.full_name ?? user.email ?? "",
      avatarUrl: profile.avatar_url,
      isActive: profile.is_active,
      roles,
    };
  } catch {
    // Si las tablas no existen aún (migración no ejecutada) o hay otro error,
    // tratar al usuario como no autenticado para que la UI no se quiebre.
    return null;
  }
}
