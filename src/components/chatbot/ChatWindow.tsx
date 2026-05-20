"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, RotateCcw } from "lucide-react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Role = "user" | "assistant";
type Mascot = "comunicador" | "indagador" | "informador" | "reflexivo";

type Message = {
  id: string;
  role: Role;
  content: string;
  fallback?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
};

const STORAGE_KEY = "atenas:chat:history:v1";

type Props = {
  open: boolean;
  onClose: () => void;
  welcomeMessage: string;
  fallbackMessage: string;
  fallbackCtaLabel: string;
  fallbackCtaUrl: string;
};

const MASCOT_SRC: Record<Mascot, string> = {
  comunicador: "/images/ateneo-comunicador.png",
  indagador: "/images/ateneo-indagador.png",
  informador: "/images/ateneo-informador.png",
  reflexivo: "/images/ateneo-reflexivo.png",
};

const MASCOT_HINT: Record<Mascot, string> = {
  comunicador: "Listo para ayudarte",
  indagador: "Estoy buscando…",
  informador: "Te cuento esto",
  reflexivo: "No estoy seguro",
};

export function ChatWindow({
  open,
  onClose,
  welcomeMessage,
  fallbackMessage,
  fallbackCtaLabel,
  fallbackCtaUrl,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mascot, setMascot] = useState<Mascot>("comunicador");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Cargar historial de localStorage al abrir
  useEffect(() => {
    if (!open) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      /* noop */
    }
    // Mensaje de bienvenida en primer apertura
    setMessages([
      {
        id: makeId(),
        role: "assistant",
        content: welcomeMessage,
      },
    ]);
  }, [open, welcomeMessage]);

  // Persist historial en localStorage
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* noop */
    }
  }, [messages]);

  // Auto-scroll al fondo cuando llega un mensaje nuevo
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Focus en input al abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // Esc cierra
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const userMsg: Message = { id: makeId(), role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setMascot("indagador");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }

      const json = (await res.json()) as {
        message?: string;
        fallback?: boolean;
        ctaLabel?: string;
        ctaUrl?: string;
      };

      const replyText = json.message?.trim() || fallbackMessage;
      const isFallback = Boolean(json.fallback);
      setMascot(isFallback ? "reflexivo" : "informador");

      const reply: Message = {
        id: makeId(),
        role: "assistant",
        content: replyText,
        fallback: isFallback,
        ctaLabel: isFallback ? (json.ctaLabel || fallbackCtaLabel) : undefined,
        ctaUrl: isFallback ? (json.ctaUrl || fallbackCtaUrl) : undefined,
      };
      setMessages((prev) => [...prev, reply]);

      // Vuelve a "comunicador" a los 3s
      setTimeout(() => setMascot("comunicador"), 3000);
    } catch (e) {
      console.error("[chatbot]", e);
      setError("No pude conectarme. Inténtalo de nuevo en un momento.");
      setMascot("reflexivo");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([
      { id: makeId(), role: "assistant", content: welcomeMessage },
    ]);
    setError(null);
    setMascot("comunicador");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="chat-window"
          className="fixed z-50 flex flex-col overflow-hidden"
          style={{
            right: 24,
            bottom: 24,
            width: "min(420px, calc(100vw - 32px))",
            height: "min(640px, calc(100vh - 80px))",
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(13,24,37,0.25)",
            fontFamily: "Poppins, sans-serif",
          }}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.28, ease }}
        >
          {/* HEADER navy con mascota dinámica flotando */}
          <div
            className="flex items-center gap-3 px-4 py-3 relative overflow-hidden flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1A2B4A 0%, #0D1825 100%)",
              minHeight: 84,
            }}
          >
            {/* Decoración tenue dorada — pointer-events:none para que NO bloquee clicks */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: -40,
                right: -30,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <div
              className="relative flex-shrink-0"
              style={{ width: 64, height: 78 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mascot}
                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -6 }}
                  transition={{ duration: 0.3, ease }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Image
                    src={MASCOT_SRC[mascot]}
                    alt="Ateneo"
                    width={160}
                    height={180}
                    priority
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1 relative z-10">
              <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", letterSpacing: 0.2 }}>
                Ateneo
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{ fontSize: 11, color: "rgba(201,168,76,0.85)", letterSpacing: 0.3 }}
              >
                <motion.span
                  animate={loading ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={loading ? { duration: 1, repeat: Infinity } : {}}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: loading ? "#C9A84C" : "#10b981",
                    display: "inline-block",
                  }}
                />
                {MASCOT_HINT[mascot]}
              </span>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Nueva conversación"
              title="Empezar nueva conversación"
              className="flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0 relative z-10"
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0 relative z-10"
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "rgba(255,255,255,0.8)",
                cursor: "pointer",
              }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* MENSAJES */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
            style={{ background: "#FAFAF8" }}
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E4DD",
                    borderRadius: "16px 16px 16px 4px",
                  }}
                >
                  <Loader2 size={14} className="animate-spin" color="#C9A84C" strokeWidth={2.5} />
                  <span style={{ fontSize: 13, color: "#6B6660", fontStyle: "italic" }}>
                    Buscando en el sitio…
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div
                className="px-4 py-2 rounded-lg"
                style={{
                  background: "#FEE2E2",
                  border: "1px solid #FCA5A5",
                  fontSize: 12,
                  color: "#991B1B",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* INPUT */}
          <div
            className="flex items-end gap-2 p-3 flex-shrink-0"
            style={{ borderTop: "1px solid #E8E4DD", background: "#FFFFFF" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe tu pregunta…"
              disabled={loading}
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                fontFamily: "inherit",
                fontSize: 13,
                color: "#1A2B4A",
                background: "#FAFAF8",
                border: "1px solid #E8E4DD",
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
                maxHeight: 100,
                lineHeight: 1.45,
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Enviar"
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: input.trim() && !loading ? "#1A2B4A" : "#E8E4DD",
                color: "#FFFFFF",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                flexShrink: 0,
                transition: "background 0.18s",
              }}
            >
              <Send size={16} strokeWidth={2.2} />
            </button>
          </div>

          {/* FOOTER */}
          <div
            className="px-4 py-2 flex-shrink-0"
            style={{
              background: "#FAFAF8",
              borderTop: "1px solid #E8E4DD",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "rgba(26,43,74,0.42)",
                textAlign: "center",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Ateneo es un asistente con IA. Verifica información crítica con el equipo del colegio.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease }}
    >
      <div
        className="flex flex-col gap-2 max-w-[85%]"
        style={{ alignItems: isUser ? "flex-end" : "flex-start" }}
      >
        <div
          style={{
            background: isUser ? "#1A2B4A" : "#FFFFFF",
            color: isUser ? "#FFFFFF" : "#1A2B4A",
            border: isUser ? "none" : "1px solid #E8E4DD",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            padding: "10px 14px",
            fontSize: 13,
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {linkify(message.content)}
        </div>
        {message.fallback && message.ctaUrl && message.ctaLabel && (
          <Link
            href={message.ctaUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-opacity hover:opacity-80"
            style={{
              background: "#C9A84C",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {message.ctaLabel} →
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/** Convierte URLs internas y externas en links clicables. */
function linkify(text: string): React.ReactNode[] {
  const re = /(https?:\/\/[^\s)]+|\/[a-z0-9/_-]+)/gi;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const url = match[0];
    const isExternal = /^https?:\/\//i.test(url);
    parts.push(
      isExternal ? (
        <a
          key={parts.length}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline", fontWeight: 600 }}
        >
          {url}
        </a>
      ) : (
        <Link
          key={parts.length}
          href={url}
          style={{ color: "inherit", textDecoration: "underline", fontWeight: 600 }}
        >
          {url}
        </Link>
      )
    );
    lastIdx = match.index + url.length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
