import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, ROLE_LABELS, hasRole, type RoleSlug } from "@/lib/auth/types";

type ProfileRow = {
  id: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
};

type AuthUserRow = {
  id: string;
  email?: string;
  last_sign_in_at?: string | null;
};

type UserListItem = {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: RoleSlug[];
  lastSignIn: string | null;
};

const ROLE_COLORS: Record<RoleSlug, { bg: string; fg: string }> = {
  superadmin: { bg: "#1A2B4A", fg: "#9e1915" },
  editor_comm: { bg: "#DBEAFE", fg: "#1E40AF" },
  editor_admisiones: { bg: "#FEF3C7", fg: "#92400E" },
  editor_academico: { bg: "#E0E7FF", fg: "#3730A3" },
  editor_talento: { bg: "#D1FAE5", fg: "#065F46" },
};

async function loadUsers(): Promise<UserListItem[]> {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, is_active, created_at")
    .order("created_at", { ascending: false });

  if (!profiles || profiles.length === 0) return [];

  const userIds = profiles.map((p: ProfileRow) => p.id);

  const { data: rolesData } = await supabase
    .from("user_roles")
    .select("user_id, roles(slug)")
    .in("user_id", userIds);

  // Lista de usuarios desde admin auth
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  const authMap = new Map<string, AuthUserRow>();
  (authUsers ?? []).forEach((u) => authMap.set(u.id, u));

  const rolesMap = new Map<string, RoleSlug[]>();
  (rolesData ?? []).forEach((r) => {
    const userId = (r as { user_id: string }).user_id;
    const rel = (r as { roles: { slug: string } | { slug: string }[] | null }).roles;
    if (!rel) return;
    const slug = (Array.isArray(rel) ? rel[0]?.slug : rel.slug) as RoleSlug | undefined;
    if (!slug) return;
    rolesMap.set(userId, [...(rolesMap.get(userId) ?? []), slug]);
  });

  return (profiles as ProfileRow[]).map((p) => {
    const authUser = authMap.get(p.id);
    return {
      id: p.id,
      email: authUser?.email ?? "—",
      fullName: p.full_name ?? authUser?.email ?? "Sin nombre",
      isActive: p.is_active,
      roles: rolesMap.get(p.id) ?? [],
      lastSignIn: authUser?.last_sign_in_at ?? null,
    };
  });
}

function formatRelativeOrAbsolute(iso: string | null): string {
  if (!iso) return "Nunca";
  const date = new Date(iso);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0) {
    return `Hoy, ${date.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
}

function initialsFromName(fullName: string, email: string): string {
  const source = fullName.trim() || email;
  const parts = source.split(/[\s.@]+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default async function UsuariosPage() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const users = await loadUsers();

  return (
    <div className="flex flex-col gap-5 p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span style={{ fontSize: 12, color: "#6B6660" }}>
            {users.length} usuario{users.length === 1 ? "" : "s"} en total
          </span>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="flex items-center gap-2 rounded-md transition-opacity"
          style={{
            height: 40,
            padding: "0 18px",
            background: "#1A2B4A",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Crear usuario
        </Link>
      </div>

      <div
        className="flex flex-col"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          className="flex items-center px-6 py-3.5"
          style={{
            background: "#FAF8F4",
            borderBottom: "1px solid #E8E4DD",
            fontSize: 11,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          <span style={{ width: 240 }}>Nombre</span>
          <span style={{ width: 280 }}>Email</span>
          <span style={{ width: 280 }}>Roles</span>
          <span style={{ width: 100 }}>Estado</span>
          <span style={{ width: 130 }}>Último acceso</span>
          <span style={{ flex: 1 }}></span>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
              No hay usuarios registrados aún. Crea el primero.
            </p>
          </div>
        ) : (
          users.map((u, i) => (
            <Link
              key={u.id}
              href={`/admin/usuarios/${u.id}`}
              className="flex items-center px-6 py-3.5 transition-colors hover:bg-[#FAF8F4]"
              style={{
                borderBottom: i === users.length - 1 ? "none" : "1px solid #E8E4DD",
                textDecoration: "none",
              }}
            >
              <div className="flex items-center gap-2.5" style={{ width: 240 }}>
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    background: "#1A2B4A",
                    borderRadius: "50%",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#9e1915" }}>
                    {initialsFromName(u.fullName, u.email)}
                  </span>
                </div>
                <span
                  className="truncate"
                  style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}
                >
                  {u.fullName}
                </span>
              </div>

              <span
                className="truncate"
                style={{ width: 280, fontSize: 12, color: "#6B6660" }}
              >
                {u.email}
              </span>

              <div className="flex items-center gap-1.5 flex-wrap" style={{ width: 280 }}>
                {u.roles.length === 0 ? (
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>
                    Sin roles
                  </span>
                ) : (
                  u.roles.map((r) => {
                    const c = ROLE_COLORS[r];
                    return (
                      <span
                        key={r}
                        className="flex items-center px-2.5 rounded-full"
                        style={{
                          height: 22,
                          background: c.bg,
                          fontSize: 10,
                          fontWeight: 700,
                          color: c.fg,
                        }}
                      >
                        {ROLE_LABELS[r]}
                      </span>
                    );
                  })
                )}
              </div>

              <div className="flex items-center gap-1.5" style={{ width: 100 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: u.isActive ? "#0F8458" : "#9CA3AF",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: u.isActive ? "#0F8458" : "#6B6660",
                  }}
                >
                  {u.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              <span
                style={{ width: 130, fontSize: 12, color: "#6B6660" }}
              >
                {formatRelativeOrAbsolute(u.lastSignIn)}
              </span>

              <span style={{ flex: 1 }}></span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
