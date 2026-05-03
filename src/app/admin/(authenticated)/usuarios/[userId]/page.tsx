import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole, type RoleSlug } from "@/lib/auth/types";
import { UserForm } from "../UserForm";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function EditarUsuarioPage({ params }: Props) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !hasRole(currentUser, ROLES.SUPERADMIN)) redirect("/admin");

  const { userId } = await params;

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, is_active")
    .eq("id", userId)
    .single();

  if (!profile) notFound();

  const { data: { user: authUser } } = await supabase.auth.admin.getUserById(userId);

  const { data: rolesData } = await supabase
    .from("user_roles")
    .select("roles(slug)")
    .eq("user_id", userId);

  const roles: RoleSlug[] = (rolesData ?? [])
    .map((r) => {
      const rel = (r as { roles: { slug: string } | { slug: string }[] | null }).roles;
      if (!rel) return null;
      const slug = (Array.isArray(rel) ? rel[0]?.slug : rel.slug) as RoleSlug | undefined;
      return slug ?? null;
    })
    .filter((s): s is RoleSlug => s !== null);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Link
        href="/admin/usuarios"
        className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#1A2B4A",
          textDecoration: "none",
          width: "fit-content",
        }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a usuarios
      </Link>

      <UserForm
        mode="edit"
        userId={userId}
        initialFullName={profile.full_name ?? ""}
        initialEmail={authUser?.email ?? ""}
        initialIsActive={profile.is_active}
        initialRoles={roles}
        isSelf={currentUser.id === userId}
      />
    </div>
  );
}
