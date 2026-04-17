"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const floatingImgs = [
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    w: 270, h: 350, style: { left: 50, bottom: 0, rotate: -3 },
    initial: { opacity: 0, y: 50 }, delay: 0.55,
  },
  {
    src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
    w: 210, h: 250, style: { right: 0, top: 10, rotate: 4 },
    initial: { opacity: 0, y: -30 }, delay: 0.78,
  },
  {
    src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80",
    w: 155, h: 175, style: { left: 5, top: 60, rotate: -5 },
    initial: { opacity: 0, x: -20 }, delay: 1.0,
  },
];

export function HeroAcademico() {
  return (
    <section className="relative overflow-hidden bg-[#0D1825] min-h-[560px] md:min-h-[640px]">

      {/* Fondo con overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1440&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.18 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(13,24,37,0.96) 0%, rgba(13,24,37,0.58) 55%, rgba(13,24,37,0.88) 100%)" }}
        />
      </div>

      {/* Ghost ACADÉMICO */}
      <div
        className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 100 }}
      >
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:240, fontWeight:700, color:"white", opacity:0.03, lineHeight:1, marginLeft:-10, whiteSpace:"nowrap" }}>
          ACADÉMICO
        </span>
      </div>
      <div
        className="md:hidden absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 110 }}
      >
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:52, fontWeight:700, color:"white", opacity:0.04, lineHeight:1, letterSpacing:-1, whiteSpace:"nowrap" }}>
          ACADÉMICO
        </span>
      </div>

      {/* Collage flotante — desktop */}
      <div className="hidden md:block absolute pointer-events-none" style={{ right: 80, top: 130, width: 400, height: 480 }}>
        {floatingImgs.map((img, i) => (
          <motion.div
            key={i}
            className="absolute rounded-[14px] overflow-hidden"
            style={{
              width: img.w,
              height: img.h,
              ...img.style,
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
            }}
            initial={img.initial as never}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: img.delay, ease }}
          >
            <Image src={img.src} alt="" fill className="object-cover" sizes="320px" />
          </motion.div>
        ))}

        {/* Badge dorado */}
        <motion.div
          className="absolute z-20 flex flex-col gap-[3px] rounded-[10px] px-4 py-3"
          style={{ background: "#C9A84C", right: 10, bottom: 30, boxShadow: "0 8px 24px rgba(0,0,0,0.40)" }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.15, ease }}
        >
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:20, fontWeight:700, color:"#0D1825", lineHeight:1 }}>5</span>
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:9, fontWeight:700, color:"rgba(13,24,37,0.70)", letterSpacing:1 }}>
            NIVELES EDUCATIVOS
          </span>
        </motion.div>

        {/* Línea decorativa */}
        <motion.div
          className="absolute"
          style={{ left: 30, top: -20, width: 2, height: 60, background: "#C9A84C", opacity: 0.5 }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 px-6 pt-[180px] pb-16 md:px-[160px] md:pt-[260px] md:pb-[80px] flex flex-col gap-[14px] md:gap-[18px]">

        {/* Badge */}
        <motion.div
          className="flex items-center gap-[10px]"
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:0.1, ease }}
        >
          <motion.span
            className="block bg-[#C9A84C] flex-shrink-0"
            style={{ width:28, height:2 }}
            initial={{ scaleX:0, originX:0 }}
            animate={{ scaleX:1 }}
            transition={{ duration:0.4, delay:0.15, ease }}
          />
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"#C9A84C", letterSpacing:2, textTransform:"uppercase" }}>
            NIVELES EDUCATIVOS
          </span>
        </motion.div>

        {/* Título */}
        <div>
          {(["Formación", "integral."] as const).map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-bold"
                style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(44px,5vw,72px)", fontWeight:700, lineHeight:1.1, color: i===0 ? "#FFFFFF" : "#C9A84C" }}
                initial={{ y:70, opacity:0 }}
                animate={{ y:0, opacity:1 }}
                transition={{ duration:0.75, delay:0.28 + i*0.13, ease }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Subtítulo */}
        <motion.p
          style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(15px,1.2vw,17px)", color:"rgba(255,255,255,0.65)", lineHeight:1.65, maxWidth:560 }}
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, delay:0.58, ease }}
        >
          Desde los primeros pasos en Inicial hasta el{" "}
          <span className="relative inline-block">
            Diploma IB,
            <motion.span
              className="absolute left-0 -bottom-0.5 block bg-[#C9A84C]"
              style={{ height:3, borderRadius:2 }}
              initial={{ scaleX:0, originX:0 }}
              animate={{ scaleX:1 }}
              transition={{ duration:0.5, delay:0.9, ease }}
            />
          </span>
          {" "}cada nivel construye sobre el anterior con metodologías de excelencia.
        </motion.p>

        {/* Chips de niveles */}
        <motion.div
          className="flex flex-wrap gap-[8px] mt-[4px]"
          initial={{ opacity:0, y:14 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, delay:0.72, ease }}
        >
          {["Inicial","Básica Elemental","Básica Superior","BGU","IB ★"].map((lvl) => (
            <span
              key={lvl}
              className="rounded-full px-[14px] py-[6px] text-[11px] font-bold"
              style={{
                fontFamily:"Poppins,sans-serif",
                background: lvl.includes("IB") ? "#C9A84C" : "rgba(255,255,255,0.08)",
                color: lvl.includes("IB") ? "#0D1825" : "rgba(255,255,255,0.70)",
                letterSpacing: 0.5,
              }}
            >
              {lvl}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
