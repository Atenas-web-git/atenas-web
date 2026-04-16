import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unidad Educativa Atenas — 50 años formando líderes",
  description:
    "La institución referente de Ambato, Ecuador. Educación de excelencia con bachillerato IB, certificación ISO 9001 y 50 años de historia.",
  keywords:
    "colegio Ambato, Unidad Educativa Atenas, bachillerato IB Ecuador, mejor colegio Ambato",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
