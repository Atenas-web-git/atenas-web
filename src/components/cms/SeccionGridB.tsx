"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import type { TarjetaPlantillaB } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = {
  badge?: string;
  heading?: string;
  description?: string;
  items: TarjetaPlantillaB[];
  /** 3 columnas (default) o 4 columnas en desktop (lg). */
  cols?: 3 | 4;
  /** Color de fondo de la sección. Default: #F8F5F0 (cream). */
  bgColor?: string;
};

export function SeccionGridB({
  badge,
  heading,
  description,
  items,
  cols = 3,
  bgColor = "#F8F5F0",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  const gridCols =
    cols === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: bgColor, padding: "80px 0" }}
    >
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 480,
          height: 480,
          background:
            "radial-gradient(ellipse at top right, rgba(201,168,76,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="px-6 md:px-[160px]">
        {(badge || heading || description) && (
          <div className="flex flex-col gap-[14px] mb-[48px]">
            {badge && (
              <motion.div
                className="flex items-center gap-[10px]"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, ease }}
              >
                <motion.span
                  className="block bg-[#C9A84C] flex-shrink-0"
                  style={{ width: 28, height: 2 }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.1, ease }}
                />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#C9A84C",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {badge}
                </span>
              </motion.div>
            )}

            {heading && (
              <div className="overflow-hidden">
                <motion.h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "clamp(24px, 2.5vw, 36px)",
                    fontWeight: 700,
                    color: "#1A2B4A",
                    lineHeight: 1.2,
                  }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.15, ease }}
                >
                  {heading}
                </motion.h2>
              </div>
            )}

            {description && (
              <motion.p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "rgba(13,24,37,0.55)",
                  lineHeight: 1.7,
                  maxWidth: 540,
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25, ease }}
              >
                {description}
              </motion.p>
            )}
          </div>
        )}

        <div className={`grid ${gridCols} gap-[16px]`}>
          {items.map((item, i) => (
            <Tarjeta key={`${item.title}-${i}`} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tarjeta({
  item,
  index,
  inView,
}: {
  item: TarjetaPlantillaB;
  index: number;
  inView: boolean;
}) {
  const isRed = item.color === "red";
  const accent = isRed ? "#9e1915" : "#C9A84C";
  const accentBg = isRed ? "rgba(158,25,21,0.10)" : "rgba(201,168,76,0.12)";
  const borderDefault = item.highlight
    ? "rgba(201,168,76,0.45)"
    : isRed
      ? "rgba(158,25,21,0.28)"
      : "rgba(26,43,74,0.08)";
  const borderHover = isRed ? "rgba(158,25,21,0.55)" : "rgba(201,168,76,0.55)";
  const bgDefault = item.highlight
    ? "rgba(26,43,74,0.04)"
    : isRed
      ? "rgba(158,25,21,0.03)"
      : "#FFFFFF";

  const baseStyle: React.CSSProperties = {
    background: bgDefault,
    border: `1.5px solid ${borderDefault}`,
    boxShadow: "0 2px 12px rgba(13,24,37,0.05)",
    textDecoration: "none",
    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
  };

  const onEnter = (e_: React.MouseEvent<HTMLElement>) => {
    const el = e_.currentTarget;
    el.style.transform = "translateY(-6px)";
    el.style.boxShadow = "0 16px 40px rgba(13,24,37,0.10)";
    el.style.borderColor = borderHover;
  };
  const onLeave = (e_: React.MouseEvent<HTMLElement>) => {
    const el = e_.currentTarget;
    el.style.transform = "translateY(0)";
    el.style.boxShadow = "0 2px 12px rgba(13,24,37,0.05)";
    el.style.borderColor = borderDefault;
  };

  const inner = (
    <>
      <div
        className="flex items-center justify-center rounded-[10px] flex-shrink-0"
        style={{ width: 44, height: 44, background: accentBg }}
      >
        {item.icon && (
          <DynamicIcon
            name={item.icon as never}
            size={20}
            color={accent}
            strokeWidth={1.8}
          />
        )}
      </div>

      <div className="flex flex-col gap-[4px] flex-1">
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#1A2B4A",
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </span>
        {item.subtitle && (
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: accent,
            }}
          >
            {item.subtitle}
          </span>
        )}
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "rgba(13,24,37,0.52)",
            lineHeight: 1.65,
            marginTop: 4,
          }}
        >
          {item.description}
        </span>
      </div>

      {item.href && item.ctaText && (
        <div className="flex items-center gap-[6px] mt-auto pt-[4px]">
          <span
            className="group-hover:underline"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: accent,
              letterSpacing: 0.5,
            }}
          >
            {item.ctaText}
          </span>
          <span style={{ color: accent, fontSize: 13, fontWeight: 700 }}>→</span>
        </div>
      )}
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay: 0.08 + index * 0.06, ease },
  };

  if (item.href) {
    const isExternal = /^https?:\/\//i.test(item.href);
    if (isExternal) {
      return (
        <motion.a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-[14px] rounded-[14px] p-[22px] h-full group"
          style={baseStyle}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          {...motionProps}
        >
          {inner}
        </motion.a>
      );
    }
    return (
      <motion.div {...motionProps}>
        <Link
          href={item.href}
          className="flex flex-col gap-[14px] rounded-[14px] p-[22px] h-full group"
          style={baseStyle}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-[14px] rounded-[14px] p-[22px] h-full"
      style={baseStyle}
      {...motionProps}
    >
      {inner}
    </motion.div>
  );
}
