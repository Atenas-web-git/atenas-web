import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionValores } from "@/components/el-atenas/SeccionValores";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Valores — Unidad Educativa Atenas",
  description:
    "Los nueve valores institucionales que guían la vida de nuestra comunidad educativa: Respeto, Verdad, Solidaridad y más.",
};

export default function ValoresPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          title="Valores"
          subtitle="Los pilares que definen el carácter de nuestra comunidad educativa."
          ghostText="VALORES"
        />
        <SeccionValores />
        <FooterCTA />
      </main>
    </>
  );
}
