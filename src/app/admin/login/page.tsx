import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { LogoSVG } from "@/components/shared/LogoSVG";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export const metadata: Metadata = {
  title: "Backoffice — Iniciar sesión",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const { next } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#F4F1EB" }}
    >
      <div className="w-full max-w-[440px] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <LogoSVG className="h-[64px] w-auto" />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#6B6660",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Backoffice
          </span>
        </div>

        <div
          className="rounded-[12px] p-10"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
          }}
        >
          <div className="flex flex-col items-center gap-1.5 mb-6">
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#1A2B4A",
                margin: 0,
              }}
            >
              Backoffice Atenas
            </h1>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "#6B6660",
                margin: 0,
                textAlign: "center",
              }}
            >
              Inicia sesión para administrar el sitio
            </p>
          </div>

          <LoginForm next={next ?? "/admin"} />

          <div
            className="mt-6 pt-4 text-center"
            style={{ borderTop: "1px solid #E8E4DD" }}
          >
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                color: "#6B6660",
              }}
            >
              Acceso solo para personal autorizado
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
