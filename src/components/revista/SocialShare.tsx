"use client";

import { useState } from "react";

const REDES = [
  {
    nombre: "Facebook",
    color: "#1877F2",
    getUrl: (url: string, titulo: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    nombre: "Instagram",
    color: "#E1306C",
    getUrl: (url: string) => `https://www.instagram.com/`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    nombre: "TikTok",
    color: "#010101",
    getUrl: (url: string) => `https://www.tiktok.com/`,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.79 1.54V6.79a4.86 4.86 0 0 1-1.02-.1z"/>
      </svg>
    ),
  },
  {
    nombre: "WhatsApp",
    color: "#25D366",
    getUrl: (url: string, titulo: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${titulo} ${url}`)}`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
      </svg>
    ),
  },
  {
    nombre: "X",
    color: "#000000",
    getUrl: (url: string, titulo: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
] as const;

interface SocialShareProps {
  titulo: string;
  slug: string;
}

export function SocialShare({ titulo, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/revista/${slug}` : `/revista/${slug}`;
  const shortUrl = `atenas.edu.ec/revista/${slug}`;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="rounded-[12px] p-6 flex flex-col gap-[14px]"
      style={{ background: "#F8F5F0", border: "1px solid #E8E4DD" }}
    >
      <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>
        Compartir artículo
      </p>

      {/* Íconos de redes */}
      <div className="flex items-center gap-[10px]">
        {REDES.map(red => (
          <a
            key={red.nombre}
            href={red.getUrl(url, titulo)}
            target="_blank"
            rel="noopener noreferrer"
            title={red.nombre}
            className="flex items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
            style={{ width: 44, height: 44, background: red.color, color: "#FFFFFF", flexShrink: 0 }}
          >
            {red.icon}
          </a>
        ))}
      </div>

      {/* Copiar link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] text-left transition-colors hover:bg-[#EAE6E1]"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD" }}
      >
        <span
          className="flex-1 truncate"
          style={{ fontFamily: "Poppins,sans-serif", fontSize: 11, color: "rgba(26,43,74,0.55)" }}
        >
          {shortUrl}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={copied ? "#22c55e" : "#C9A84C"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {copied
            ? <><polyline points="20 6 9 17 4 12"/></>
            : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>
          }
        </svg>
      </button>
    </div>
  );
}
