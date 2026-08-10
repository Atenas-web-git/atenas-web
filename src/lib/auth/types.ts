// Roles del backoffice — espejo del catálogo en supabase/seed/roles.sql
export const ROLES = {
  SUPERADMIN: "superadmin",
  EDITOR_COMM: "editor_comm",
  EDITOR_ADMISIONES: "editor_admisiones",
  EDITOR_ACADEMICO: "editor_academico",
  EDITOR_TALENTO: "editor_talento",
} as const;

export type RoleSlug = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<RoleSlug, string> = {
  superadmin: "Superadministrador",
  editor_comm: "Editor de Comunicaciones",
  editor_admisiones: "Editor de Admisiones",
  editor_academico: "Editor Académico",
  editor_talento: "Editor de Talento Humano",
};

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isActive: boolean;
  roles: RoleSlug[];
};

export function hasRole(user: AdminUser | null, role: RoleSlug): boolean {
  return !!user && user.roles.includes(role);
}

export function hasAnyRole(user: AdminUser | null, roles: RoleSlug[]): boolean {
  return !!user && roles.some((r) => user.roles.includes(r));
}

export function canAccessAdmin(user: AdminUser | null): boolean {
  return !!user && user.isActive && user.roles.length > 0;
}
