import { Intro } from "@/components/home/Intro";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { Tagline } from "@/components/home/Tagline";
import { HScroll } from "@/components/home/HScroll";
import { Trayectoria } from "@/components/home/Trayectoria";
import { Niveles } from "@/components/home/Niveles";
import { PorQueAtenas } from "@/components/home/PorQueAtenas";
import { FooterCTA } from "@/components/home/FooterCTA";

export default function Home() {
  return (
    <>
      <Intro />
      <Navbar />
      <main>
        <Hero />
        <Tagline />
        <HScroll />
        <Trayectoria />
        <Niveles />
        <PorQueAtenas />
        <FooterCTA />
      </main>
    </>
  );
}
