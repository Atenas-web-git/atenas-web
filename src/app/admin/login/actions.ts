"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type LoginState = {
  error: string | null;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const supabase = await createClient();

  const { error: authError, data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: "Correo o contraseña incorrectos." };
  }

  // Usamos el cliente admin (service_role) para verificar profile y roles,
  // porque las RLS de profiles pueden no estar disponibles aún en la sesión
  // recién creada — el JWT está en la cookie pero esa cookie no se ha
  // propagado al request actual de Postgres.
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("is_active")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error:
        "No se ha creado el perfil de este usuario. Contacta al superadministrador para que lo registre en el sistema.",
    };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta está desactivada. Contacta al superadministrador." };
  }

  const { count } = await admin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", authData.user.id);

  if (!count || count === 0) {
    await supabase.auth.signOut();
    return {
      error: "Tu cuenta no tiene roles asignados. Contacta al superadministrador.",
    };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
