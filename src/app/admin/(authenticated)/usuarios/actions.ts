"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole, type RoleSlug } from "@/lib/auth/types";

export type UserActionState = {
  error: string | null;
  ok: boolean;
};

const VALID_ROLES: RoleSlug[] = [
  ROLES.SUPERADMIN,
  ROLES.EDITOR_COMM,
  ROLES.EDITOR_ADMISIONES,
  ROLES.EDITOR_ACADEMICO,
];

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function createUserAction(
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  await assertSuperadmin();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const rolesRaw = formData.getAll("roles").map((r) => String(r));

  if (!fullName) return { error: "El nombre completo es obligatorio.", ok: false };
  if (!email) return { error: "El correo electrónico es obligatorio.", ok: false };
  if (!password || password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres.", ok: false };
  }

  const selectedRoles = rolesRaw.filter((r): r is RoleSlug =>
    VALID_ROLES.includes(r as RoleSlug)
  );
  if (selectedRoles.length === 0) {
    return { error: "Debes asignar al menos un rol.", ok: false };
  }

  const supabase = createAdminClient();

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created.user) {
    return {
      error: createError?.message?.includes("already")
        ? "Ya existe un usuario con ese correo."
        : "No se pudo crear el usuario. Verifica los datos.",
      ok: false,
    };
  }

  // El trigger ya creó el profile. Aseguramos full_name correcto y is_active true.
  await supabase
    .from("profiles")
    .update({ full_name: fullName, is_active: true })
    .eq("id", created.user.id);

  // Asignar roles
  const { data: rolesRows } = await supabase
    .from("roles")
    .select("id, slug")
    .in("slug", selectedRoles);

  const inserts = (rolesRows ?? []).map((r) => ({
    user_id: created.user!.id,
    role_id: r.id,
  }));

  if (inserts.length > 0) {
    const { error: assignError } = await supabase.from("user_roles").insert(inserts);
    if (assignError) {
      // Si falla la asignación, limpiar el usuario para evitar un huérfano
      await supabase.auth.admin.deleteUser(created.user.id);
      return { error: "No se pudieron asignar los roles. Intenta de nuevo.", ok: false };
    }
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function updateUserAction(
  userId: string,
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const currentUser = await assertSuperadmin();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const isSelf = currentUser.id === userId;
  // Si es el propio usuario, su checkbox "isActive" está deshabilitado en el form
  // y por tanto el browser no envía el valor; forzamos true para que no se
  // interprete como desactivado.
  const isActive = isSelf ? true : formData.get("isActive") === "on";
  const rolesRaw = formData.getAll("roles").map((r) => String(r));

  if (!fullName) return { error: "El nombre completo es obligatorio.", ok: false };

  const selectedRoles = rolesRaw.filter((r): r is RoleSlug =>
    VALID_ROLES.includes(r as RoleSlug)
  );

  // Bloqueo: el superadmin no puede quitarse a sí mismo el rol superadmin
  if (isSelf && !selectedRoles.includes(ROLES.SUPERADMIN)) {
    return {
      error: "No puedes quitarte el rol de superadministrador a ti mismo.",
      ok: false,
    };
  }

  if (selectedRoles.length === 0) {
    return { error: "El usuario debe tener al menos un rol.", ok: false };
  }

  const supabase = createAdminClient();

  await supabase
    .from("profiles")
    .update({ full_name: fullName, is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", userId);

  // Reescribir roles: borrar todos y reinsertar
  await supabase.from("user_roles").delete().eq("user_id", userId);

  const { data: rolesRows } = await supabase
    .from("roles")
    .select("id, slug")
    .in("slug", selectedRoles);

  const inserts = (rolesRows ?? []).map((r) => ({
    user_id: userId,
    role_id: r.id,
    granted_by: currentUser.id,
  }));

  if (inserts.length > 0) {
    await supabase.from("user_roles").insert(inserts);
  }

  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${userId}`);
  return { error: null, ok: true };
}
