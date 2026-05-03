"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

const inputStyle: React.CSSProperties = {
  fontFamily: "Poppins, sans-serif",
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FFFFFF",
  border: "1.5px solid #C8C4BD",
  borderRadius: 6,
  padding: "11px 14px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.18s ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Poppins, sans-serif",
  fontSize: 12,
  fontWeight: 500,
  color: "#1A2B4A",
  display: "block",
  marginBottom: 6,
};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" style={labelStyle}>
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isPending}
          placeholder="tu@atenas.edu.ec"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1A2B4A")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#C8C4BD")}
        />
      </div>

      <div>
        <label htmlFor="password" style={labelStyle}>
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          placeholder="••••••••"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1A2B4A")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#C8C4BD")}
        />
      </div>

      {state.error && (
        <div
          className="rounded-[6px] px-3 py-2"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "#9A3412",
          }}
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-[6px] py-3 font-semibold transition-opacity"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 14,
          background: "#1A2B4A",
          color: "#FFFFFF",
          border: "none",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
