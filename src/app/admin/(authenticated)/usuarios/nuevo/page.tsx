import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { UserForm } from "../UserForm";

export default async function NuevoUsuarioPage() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  return (
    <div className="p-8">
      <UserForm mode="create" />
    </div>
  );
}
