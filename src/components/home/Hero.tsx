"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { HeroPlantillaM } from "@/app/admin/(authenticated)/contenido/plantillas";
import { parseYouTubeUrl } from "@/lib/cms/parseYouTubeUrl";

type Props = { hero: HeroPlantillaM };

/* ── Video de fondo YouTube en loop (mute, sin controles) ───────────── */

type YTPlayer = {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getIframe: () => HTMLElement | null;
};

type YTWindow = {
  YT?: { Player: new (...args: unknown[]) => YTPlayer };
  onYouTubeIframeAPIReady?: () => void;
};

function YTLoopBackground({
  videoId,
  startSeconds,
  endSeconds,
}: {
  videoId: string;
  startSeconds: number;
  endSeconds: number;
}) {
  const playerRef = useRef<YTPlayer | null>(null);
  const start = startSeconds || 0;
  const end = endSeconds && endSeconds > start ? endSeconds : undefined;

  useEffect(() => {
    function boot() {
      const w = window as unknown as YTWindow;
      if (playerRef.current || !document.getElementById("yt-home-hero-player")) return;
      if (!w.YT?.Player) return;
      playerRef.current = new w.YT.Player("yt-home-hero-player", {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start,
          ...(end ? { end } : {}),
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.mute();
            e.target.playVideo();
            const iframe = e.target.getIframe();
            if (iframe) iframe.style.pointerEvents = "none";
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            // state 0 = video terminado → volver al inicio del segmento
            if (e.data === 0) {
              e.target.seekTo(start, true);
              e.target.playVideo();
            }
          },
        },
      });
    }

    const w = window as unknown as YTWindow;
    if (w.YT?.Player) {
      boot();
    } else {
      if (!document.getElementById("yt-api-script")) {
        const s = document.createElement("script");
        s.id = "yt-api-script";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        boot();
        prev?.();
      };
    }

    return () => {
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [videoId, start, end]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        id="yt-home-hero-player"
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          width: "max(100%, calc(100vh * 1.7778))",
          height: "max(100%, calc(100vw * 0.5625))",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────── */

export function Hero({ hero }: Props) {
  const yt = parseYouTubeUrl(hero.videoYoutubeUrl);
  const hasVideo = !!yt?.videoId;
  // Si el editor no dio un linkUrl explícito, caemos al URL del video de fondo.
  const videoLinkUrl = (hero.videoLinkUrl || hero.videoYoutubeUrl || "").trim();
  const videoLinkText = hero.videoLinkText?.trim() || "REPRODUCIR VIDEO";

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Capa de fondo: foto (siempre) + video YouTube (encima si está) */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        {hero.bgImageSrc && (
          <Image
            src={hero.bgImageSrc}
            alt="Campus Unidad Educativa Atenas"
            fill
            priority
            className="object-cover object-center"
          />
        )}
      </motion.div>

      {hasVideo && (
        <YTLoopBackground
          videoId={yt!.videoId}
          startSeconds={hero.startSeconds}
          endSeconds={hero.endSeconds}
        />
      )}

      {/* Overlay cinematográfico */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,24,37,0.73) 0%, rgba(13,24,37,0.33) 42%, rgba(13,24,37,0.86) 100%)",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-[5vh] md:pb-[8vh] px-8 md:px-[160px]">
        <div className="max-w-[860px]">
          {hero.titleLines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                className="text-white font-bold leading-[1.0] text-[clamp(36px,4.7vw,68px)]"
                initial={{ y: 64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.75,
                  delay: 0.3 + i * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {line}
              </motion.h1>
            </div>
          ))}

          {hero.subtitle && (
            <div className="overflow-hidden mt-5">
              <motion.p
                className="text-white/70 text-[clamp(14px,1.1vw,16px)] leading-[1.6] max-w-[560px]"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.3 + hero.titleLines.length * 0.15 + 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {hero.subtitle}
              </motion.p>
            </div>
          )}
        </div>

        {/* Link "Reproducir Video" — abre el video real en YouTube */}
        {videoLinkUrl && (
          <motion.a
            href={videoLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 mt-10 group w-fit no-underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.span
              className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:border-white/80 transition-all duration-300"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </motion.span>
            <span className="text-white/70 group-hover:text-white text-[11px] font-semibold tracking-[2.5px] transition-colors">
              {videoLinkText}
            </span>
          </motion.a>
        )}
      </div>
    </section>
  );
}
