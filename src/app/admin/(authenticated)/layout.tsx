import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { canAccessAdmin } from "@/lib/auth/types";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";

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
      className="min-h-screen flex"
      style={{ background: "#F4F1EB", fontFamily: "Poppins, sans-serif" }}
    >
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
