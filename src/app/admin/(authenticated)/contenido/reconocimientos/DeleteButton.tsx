"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type Props = {
  action: (formData: FormData) => void;
  hiddenFields: Record<string, string | number>;
  label?: string;
  confirmMessage: string;
  variant?: "lg" | "sm";
};

export function DeleteButton({
  action,
  hiddenFields,
  label = "Eliminar",
  confirmMessage,
  variant = "lg",
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={String(v)} />
      ))}
      <SubmitBtn label={label} variant={variant} />
    </form>
  );
}

function SubmitBtn({ label, variant }: { label: string; variant: "lg" | "sm" }) {
  const { pending } = useFormStatus();
  const isSm = variant === "sm";
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 rounded-md transition-opacity hover:opacity-70 disabled:opacity-50"
      style={{
        height: isSm ? 28 : 36,
        padding: isSm ? "0 10px" : "0 12px",
        background: "#FEE2E2",
        fontSize: isSm ? 11 : 13,
        color: "#991B1B",
        fontWeight: 600,
        border: "1px solid #FCA5A5",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      <Trash2 size={isSm ? 11 : 13} strokeWidth={2.5} />
      {pending ? "Eliminando…" : label}
    </button>
  );
}
