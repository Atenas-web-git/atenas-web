import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { AutorizacionesBancarias } from "@/components/matriculas/AutorizacionesBancarias";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Autorizaciones Bancarias | Matrículas 2026–2027 | Atenas",
  description: "Cuentas bancarias autorizadas para el pago de matrícula y pensiones en la Unidad Educativa Atenas.",
};

export default function AutorizacionesPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="MATRÍCULAS · AUTORIZACIONES"
          title="Autorizaciones Bancarias"
          subtitle="Realiza el pago de matrícula o pensión en cualquiera de los bancos autorizados y sube tu comprobante al portal."
          ghostText="BANCOS"
        />
        <NavMatriculas current="autorizaciones" />
        <AutorizacionesBancarias />
        <FooterCTA />
      </main>
    </>
  );
}
