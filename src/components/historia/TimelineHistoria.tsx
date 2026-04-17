"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { useState } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── Configuración del video ────────────────────────────────────── */
const YT_ID    = "0b91AsQRfJM";
const YT_START = 28;   // segundo de inicio del loop
const YT_END   = 55;   // segundo de fin del loop

/* ── Contenido ──────────────────────────────────────────────────── */
const milestones = [
  { year: "1976",       title: "Fundación",                 desc: "Unidad Educativa Atenas abre sus puertas en Ambato",                                                    highlight: false },
  { year: "1996",       title: "Primera Graduación",        desc: "Primera promoción de 36 bachilleres egresada",                                                          highlight: false },
  { year: "2006",       title: "ISO 9001",                  desc: "Primera institución del centro del país en certificarse ISO 9001",                                      highlight: false },
  { year: "2013",       title: "Bachillerato Internacional", desc: "Autorización del programa Diploma IB en mayo de 2013",                                                 highlight: false },
  { year: "2017–2019",  title: "Tecnología e Innovación",   desc: "Feria de Universidades y nuevas tecnologías educativas en el aula",                                     highlight: false },
  { year: "2020–2026 ★", title: "Excelencia Nacional",     desc: "2020: educación online reconocida a nivel nacional. Hoy: referentes de calidad en Ecuador",             highlight: true  },
];

const photos = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
];

/* ── Video de fondo en loop (segmento 28-55s) ───────────────────── */
function YTLoopBackground() {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    function boot() {
      if (playerRef.current || !document.getElementById("yt-tl-player")) return;
      playerRef.current = new (window as any).YT.Player("yt-tl-player", {
        width: "100%",
        height: "100%",
        videoId: YT_ID,
        playerVars: {
          autoplay:       1,
          mute:           1,
          controls:       0,
          disablekb:      1,
          fs:             0,
          rel:            0,
          modestbranding: 1,
          playsinline:    1,
          start:          YT_START,
          end:            YT_END,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
            /* Deshabilitar interacción con el iframe */
            const iframe = e.target.getIframe() as HTMLElement | null;
            if (iframe) iframe.style.pointerEvents = "none";
          },
          onStateChange: (e: any) => {
            /* state 0 = video terminado → volver al inicio del segmento */
            if (e.data === 0) {
              e.target.seekTo(YT_START, true);
              e.target.playVideo();
            }
          },
        },
      });
    }

    if ((window as any).YT?.Player) {
      boot();
    } else {
      if (!document.getElementById("yt-api-script")) {
        const s = document.createElement("script");
        s.id  = "yt-api-script";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => { boot(); prev?.(); };
    }

    return () => {
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
      playerRef.current = null;
    };
  }, []);

  return (
    /* El div ocupa el inset completo; el div interno se dimensiona para
       cubrir siempre el contenedor sin importar el aspect-ratio de pantalla */
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.22 }}>
      <div
        id="yt-tl-player"
        className="absolute"
        style={{
          top:       "50%",
          left:      "50%",
          /* max() asegura que el video cubra el contenedor en cualquier orientación */
          width:     "max(100%, calc(100vh * 1.7778))",
          height:    "max(100%, calc(100vw * 0.5625))",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

/* ── Tarjeta de hito — desktop, con hover ───────────────────────── */
function MilestoneCard({ year, title, desc, highlight, delay }: {
  year: string; title: string; desc: string; highlight: boolean; delay: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="rounded-[8px] flex flex-col gap-[10px] p-[24px_20px] cursor-default flex-1"
      style={{
        background:  hovered
          ? (highlight ? "rgba(201,168,76,0.22)" : "rgba(255,255,255,0.12)")
          : (highlight ? "rgba(201,168,76,0.10)" : "rgba(255,255,255,0.05)"),
        border:      highlight ? "1px solid rgba(201,168,76,0.33)" : "1px solid transparent",
        boxShadow:   hovered ? "0 8px 32px rgba(0,0,0,0.30)" : "none",
        transition:  "background 0.25s ease, box-shadow 0.25s ease",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
    >
      <motion.span
        style={{ fontFamily: "Poppins, sans-serif", fontSize: 32, fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {year}
      </motion.span>
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: highlight ? 700 : 600, color: "#FFFFFF", lineHeight: 1.3 }}>
        {title}
      </span>
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.53)", lineHeight: 1.5 }}>
        {desc}
      </span>
    </motion.div>
  );
}

/* ── Tarjeta mobile ─────────────────────────────────────────────── */
function MobileCard({ year, title, desc, highlight, delay }: {
  year: string; title: string; desc: string; highlight: boolean; delay: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="rounded-[8px] flex gap-[16px] p-[16px]"
      style={{
        background: highlight ? "rgba(201,168,76,0.10)" : "rgba(255,255,255,0.05)",
        border:     highlight ? "1px solid rgba(201,168,76,0.33)" : "none",
      }}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}
    >
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 22, fontWeight: 700, color: "#C9A84C", lineHeight: 1, flexShrink: 0, width: 80 }}>
        {year}
      </span>
      <div className="flex flex-col gap-[4px]">
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.3 }}>
          {title}
        </span>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.53)", lineHeight: 1.5 }}>
          {desc}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Foto con hover ─────────────────────────────────────────────── */
function PhotoStrip({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      className="relative flex-1 rounded-[8px] overflow-hidden"
      style={{ height: 148 }}
      whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}
      transition={{ duration: 0.28, ease }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="33vw" />
      {/* Overlay dorado en hover */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(201,168,76,0.18)" }}
      />
    </motion.div>
  );
}

/* ── Componente principal ───────────────────────────────────────── */
export function TimelineHistoria() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(headerRef, { once: true, amount: 0.2 });

  /* Parallax del fondo */
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#1A2B4A] min-h-[880px] md:min-h-[860px]"
    >

      {/* ── Fondo con parallax ── */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* Foto de respaldo (visible siempre, cubierta por el video cuando carga) */}
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1440&q=80"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.08 }}
        />
        {/* Video YouTube en loop 28-55s */}
        <YTLoopBackground />
        {/* Overlay oscuro para contraste con el texto */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(26,43,74,0.80) 0%, rgba(26,43,74,0.65) 50%, rgba(26,43,74,0.85) 100%)" }}
        />
      </motion.div>

      {/* Ghost "50" — solo desktop */}
      <div
        className="absolute pointer-events-none select-none hidden md:block overflow-hidden"
        style={{ right: 0, top: 60 }}
      >
        <span style={{ display: "block", fontFamily: "Poppins, sans-serif", fontSize: 520, fontWeight: 700, color: "white", opacity: 0.03, lineHeight: 1, whiteSpace: "nowrap" }}>
          50
        </span>
      </div>

      {/* ── Contenido ── */}
      <div
        ref={headerRef}
        className="relative z-10 px-6 pt-[52px] pb-10 md:px-0 md:pt-[72px] md:pb-0 md:pl-[120px]"
      >
        {/* Label */}
        <motion.p
          style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: 3, textTransform: "uppercase" }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease }}
        >
          Nuestra Trayectoria
        </motion.p>

        <motion.span
          className="block bg-[#C9A84C]"
          style={{ width: 40, height: 2, marginTop: 8, marginBottom: 8 }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        />

        <motion.h2
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px, 3.06vw, 44px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, maxWidth: 560 }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          Hitos que marcaron<br />nuestra historia
        </motion.h2>

        {/* Mobile: cards apiladas */}
        <div className="md:hidden flex flex-col gap-[12px] mt-[28px]">
          {milestones.map((m, i) => <MobileCard key={m.year} {...m} delay={0.05 * i} />)}
        </div>

        {/* Mobile: foto strip */}
        <div className="md:hidden flex gap-[12px] mt-[12px] overflow-hidden" style={{ height: 110 }}>
          {photos.slice(0, 2).map((src, i) => (
            <motion.div key={i} className="relative flex-1 rounded-[8px] overflow-hidden" whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }}>
              <Image src={src} alt="" fill className="object-cover" sizes="50vw" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: grid 2×3 + foto strip */}
      <div className="hidden md:block relative z-10 pl-[120px] pr-[120px] mt-[56px]">
        <div className="flex gap-[20px]">
          {milestones.slice(0, 3).map((m, i) => <MilestoneCard key={m.year} {...m} delay={0.05 + i * 0.08} />)}
        </div>
        <div className="flex gap-[20px] mt-[20px]">
          {milestones.slice(3, 6).map((m, i) => <MilestoneCard key={m.year} {...m} delay={0.25 + i * 0.08} />)}
        </div>

        {/* Foto strip */}
        <div className="flex gap-[16px] mt-[20px] pb-[56px]">
          {photos.map((src, i) => <PhotoStrip key={i} src={src} alt={`Campus Atenas ${i + 1}`} />)}
        </div>
      </div>

    </section>
  );
}
