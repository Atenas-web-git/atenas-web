"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Edit2,
  X,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { MenuItemAdmin } from "@/lib/cms/getMegaMenu";
import {
  crearItemAction,
  actualizarItemAction,
  eliminarItemAction,
  reordenarItemAction,
} from "./actions";

type Props = { tree: MenuItemAdmin[] };

export function MegaMenuEditor({ tree }: Props) {
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<MenuItemAdmin | null>(null);
  const [creating, setCreating] = useState<{ parentId: string | null; defaultLabel?: string } | null>(null);
  const [deleting, setDeleting] = useState<MenuItemAdmin | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleCat = (id: string) =>
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleReorder = async (id: string, direccion: "up" | "down") => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("id", id);
    fd.append("direccion", direccion);
    const res = await reordenarItemAction({ error: null, ok: false }, fd);
    setBusy(false);
    if (res.error) setError(res.error);
    else router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Banner informativo */}
      <div
        className="flex items-start gap-3 p-4"
        style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10 }}
      >
        <Info size={18} strokeWidth={2.5} color="#1E40AF" style={{ flexShrink: 0, marginTop: 2 }} />
        <div className="flex flex-col gap-1">
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A", margin: 0 }}>
            Cómo funciona el mega-menú
          </p>
          <p style={{ fontSize: 13, color: "#1E3A8A", lineHeight: 1.6, margin: 0 }}>
            Cada <strong>categoría</strong> (Quiénes Somos, Académico, etc.) agrupa <strong>sub-items</strong> que apuntan a páginas del sitio o URLs externas. Las URLs que empiezan con <code style={{ fontFamily: "monospace" }}>http://</code> o <code style={{ fontFamily: "monospace" }}>https://</code> se abren en una nueva pestaña automáticamente. Puedes ocultar items temporalmente sin eliminarlos (toggle 👁).
          </p>
        </div>
      </div>

      {error && (
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
        >
          <AlertTriangle size={14} color="#991B1B" strokeWidth={2.5} />
          <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Botón crear categoría */}
      <button
        type="button"
        onClick={() => setCreating({ parentId: null })}
        className="flex items-center justify-center gap-1.5 self-start px-4 transition-opacity hover:opacity-80"
        style={{
          height: 38,
          background: "#1A2B4A",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        Agregar categoría
      </button>

      {/* Árbol de categorías */}
      {tree.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            Sin categorías. Crea la primera con el botón de arriba.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tree.map((cat, idx) => {
            const isExpanded = expandedCats.has(cat.id);
            return (
              <div
                key={cat.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E4DD",
                  borderRadius: 12,
                  overflow: "hidden",
                  opacity: cat.visible ? 1 : 0.55,
                }}
              >
                {/* Header de la categoría */}
                <div
                  className="flex items-center gap-3 px-5 py-3"
                  style={{
                    background: "#FAFAF8",
                    borderBottom: isExpanded ? "1px solid #E8E4DD" : "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleCat(cat.id)}
                    aria-label={isExpanded ? "Contraer" : "Expandir"}
                    style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer" }}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} color="#6B6660" strokeWidth={2.5} />
                    ) : (
                      <ChevronRight size={16} color="#6B6660" strokeWidth={2.5} />
                    )}
                  </button>

                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", flex: 1 }}>
                    {cat.label}
                  </span>

                  <span
                    className="inline-flex items-center px-2 rounded-full"
                    style={{
                      height: 20,
                      background: "#F4F1EB",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6B6660",
                      letterSpacing: 0.3,
                    }}
                  >
                    {cat.children.length} sub-item{cat.children.length === 1 ? "" : "s"}
                  </span>

                  {!cat.visible && (
                    <span
                      className="inline-flex items-center gap-1 px-2 rounded-full"
                      style={{ height: 20, background: "#FEE2E2", color: "#991B1B", fontSize: 11, fontWeight: 700 }}
                    >
                      <EyeOff size={10} strokeWidth={2.5} />
                      OCULTA
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorder(cat.id, "up")}
                      disabled={busy || idx === 0}
                      aria-label="Subir"
                      style={iconButton(busy || idx === 0)}
                    >
                      <ArrowUp size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(cat.id, "down")}
                      disabled={busy || idx === tree.length - 1}
                      aria-label="Bajar"
                      style={iconButton(busy || idx === tree.length - 1)}
                    >
                      <ArrowDown size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(cat)}
                      aria-label="Editar categoría"
                      style={iconButton(false)}
                    >
                      <Edit2 size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(cat)}
                      aria-label="Eliminar categoría"
                      style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Sub-items */}
                {isExpanded && (
                  <div className="flex flex-col">
                    {cat.children.length === 0 ? (
                      <div
                        className="flex items-center justify-center py-6 px-5"
                        style={{ borderBottom: "1px solid #F4F1EB" }}
                      >
                        <p style={{ fontSize: 13, color: "#A0AABA", margin: 0 }}>
                          Sin sub-items en esta categoría.
                        </p>
                      </div>
                    ) : (
                      cat.children.map((sub, subIdx) => (
                        <SubItemRow
                          key={sub.id}
                          sub={sub}
                          isFirst={subIdx === 0}
                          isLast={subIdx === cat.children.length - 1}
                          busy={busy}
                          onReorder={handleReorder}
                          onEdit={() => setEditing(sub)}
                          onDelete={() => setDeleting(sub)}
                        />
                      ))
                    )}
                    {/* Botón agregar sub-item */}
                    <div className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setCreating({ parentId: cat.id })}
                        className="flex items-center gap-1.5 px-3 transition-opacity hover:opacity-80"
                        style={addSubButton}
                      >
                        <Plus size={12} strokeWidth={2.5} />
                        Agregar sub-item a "{cat.label}"
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal crear */}
      {creating && (
        <CrearModal
          parentId={creating.parentId}
          parentLabel={
            creating.parentId
              ? tree.find((c) => c.id === creating.parentId)?.label
              : undefined
          }
          onClose={() => setCreating(null)}
          onCreated={() => {
            setCreating(null);
            router.refresh();
          }}
        />
      )}

      {/* Modal editar */}
      {editing && (
        <EditarModal
          item={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      {/* Modal eliminar */}
      {deleting && (
        <EliminarModal
          item={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setDeleting(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

/* ─── Row de sub-item ─── */

function SubItemRow({
  sub,
  isFirst,
  isLast,
  busy,
  onReorder,
  onEdit,
  onDelete,
}: {
  sub: MenuItemAdmin;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  onReorder: (id: string, direccion: "up" | "down") => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isExternal = sub.external || (sub.href?.startsWith("http") ?? false);
  return (
    <div
      className="flex items-center gap-3 px-5 py-3"
      style={{ borderBottom: "1px solid #F4F1EB", opacity: sub.visible ? 1 : 0.55 }}
    >
      <span style={{ width: 12, height: 1, background: "#C9C4BB" }} />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>{sub.label}</span>
          {isExternal && (
            <ExternalLink size={11} strokeWidth={2.5} color="#A0AABA" />
          )}
          {sub.badge && (
            <span
              className="inline-flex items-center px-1.5 rounded-full"
              style={{
                height: 16,
                background: "#9e1915",
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              {sub.badge}
            </span>
          )}
          {!sub.visible && <EyeOff size={11} strokeWidth={2.5} color="#991B1B" />}
        </div>
        <code
          className="truncate"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            color: "#6B6660",
          }}
          title={sub.href ?? ""}
        >
          {sub.href ?? "—"}
        </code>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => onReorder(sub.id, "up")}
          disabled={busy || isFirst}
          aria-label="Subir"
          style={iconButton(busy || isFirst)}
        >
          <ArrowUp size={12} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => onReorder(sub.id, "down")}
          disabled={busy || isLast}
          aria-label="Bajar"
          style={iconButton(busy || isLast)}
        >
          <ArrowDown size={12} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={onEdit} aria-label="Editar" style={iconButton(false)}>
          <Edit2 size={12} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Eliminar"
          style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}
        >
          <Trash2 size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Modales ─── */

function CrearModal({
  parentId,
  parentLabel,
  onClose,
  onCreated,
}: {
  parentId: string | null;
  parentLabel?: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isCategoria = parentId === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData();
    fd.append("label", label);
    fd.append("href", href);
    if (parentId) fd.append("parent_id", parentId);
    const res = await crearItemAction({ error: null, ok: false }, fd);
    setPending(false);
    if (res.error) setError(res.error);
    else onCreated();
  };

  return (
    <Modal
      title={isCategoria ? "Nueva categoría" : `Nuevo sub-item de "${parentLabel ?? ""}"`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Etiqueta"
          required
          hint={isCategoria ? 'Texto visible de la categoría (ej. "Quiénes Somos").' : 'Texto visible del sub-item (ej. "Misión").'}
        >
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} required autoFocus style={inputStyle} />
        </Field>
        <Field
          label={isCategoria ? "URL de destino (opcional)" : "URL de destino"}
          hint={
            isCategoria
              ? "Las categorías típicamente no tienen URL — solo agrupan sub-items. Si pones URL, la categoría también será clickeable."
              : 'Interna ("/matriculas/proceso") o externa ("https://..."). Las externas se abren en nueva pestaña automáticamente.'
          }
        >
          <input
            type="text"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder={isCategoria ? "(opcional)" : "/ruta o https://..."}
            style={{ ...inputStyle, fontFamily: monoFont }}
          />
        </Field>
        {error && (
          <div className="px-3 py-2 rounded-md" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
            <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{error}</p>
          </div>
        )}
        <div className="flex items-center gap-2 justify-end">
          <button type="button" onClick={onClose} style={cancelBtn}>Cancelar</button>
          <button type="submit" disabled={pending} style={{ ...submitBtn, opacity: pending ? 0.7 : 1, cursor: pending ? "wait" : "pointer" }}>
            {pending ? "Creando…" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditarModal({
  item,
  onClose,
  onUpdated,
}: {
  item: MenuItemAdmin;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [label, setLabel] = useState(item.label);
  const [href, setHref] = useState(item.href ?? "");
  const [badge, setBadge] = useState(item.badge ?? "");
  const [visible, setVisible] = useState(item.visible);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isCategoria = item.parent_id === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData();
    fd.append("id", item.id);
    fd.append("label", label);
    fd.append("href", href);
    fd.append("badge", badge);
    if (visible) fd.append("visible", "on");
    const res = await actualizarItemAction({ error: null, ok: false }, fd);
    setPending(false);
    if (res.error) setError(res.error);
    else onUpdated();
  };

  return (
    <Modal title={`Editar ${isCategoria ? "categoría" : "sub-item"}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Etiqueta" required>
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} required autoFocus style={inputStyle} />
        </Field>
        <Field
          label={isCategoria ? "URL de destino (opcional)" : "URL de destino"}
          hint='Interna ("/matriculas") o externa ("https://..."). Las externas se abren en nueva pestaña.'
        >
          <input
            type="text"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder={isCategoria ? "(opcional)" : "/ruta o https://..."}
            style={{ ...inputStyle, fontFamily: monoFont }}
          />
        </Field>
        <Field label="Badge (opcional)" hint='Etiqueta corta en rojo (ej. "Nuevo", "Próximamente"). Aparece junto al texto.'>
          <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Nuevo" maxLength={20} style={inputStyle} />
        </Field>
        <label
          className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer"
          style={{ background: "#FAFAF8", border: "1px solid #E8E4DD" }}
        >
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <div className="flex items-center gap-2">
            {visible ? <Eye size={14} strokeWidth={2.5} color="#1A2B4A" /> : <EyeOff size={14} strokeWidth={2.5} color="#991B1B" />}
            <span style={{ fontSize: 14, color: "#1A2B4A" }}>
              {visible ? "Visible en el sitio público" : "Oculto (no se muestra al visitante)"}
            </span>
          </div>
        </label>
        {error && (
          <div className="px-3 py-2 rounded-md" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
            <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{error}</p>
          </div>
        )}
        <div className="flex items-center gap-2 justify-end">
          <button type="button" onClick={onClose} style={cancelBtn}>Cancelar</button>
          <button type="submit" disabled={pending} style={{ ...submitBtn, opacity: pending ? 0.7 : 1, cursor: pending ? "wait" : "pointer" }}>
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EliminarModal({
  item,
  onClose,
  onDeleted,
}: {
  item: MenuItemAdmin;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isCategoria = item.parent_id === null;

  const handleDelete = async () => {
    setPending(true);
    setError(null);
    const fd = new FormData();
    fd.append("id", item.id);
    const res = await eliminarItemAction({ error: null, ok: false }, fd);
    setPending(false);
    if (res.error) setError(res.error);
    else onDeleted();
  };

  return (
    <Modal title={`Eliminar ${isCategoria ? "categoría" : "sub-item"}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div
          className="flex items-start gap-3 p-4 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
        >
          <AlertTriangle size={18} strokeWidth={2.5} color="#991B1B" style={{ flexShrink: 0, marginTop: 1 }} />
          <div className="flex flex-col gap-1">
            <p style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", margin: 0 }}>
              ¿Eliminar "{item.label}"?
            </p>
            <p style={{ fontSize: 13, color: "#7F1D1D", margin: 0, lineHeight: 1.6 }}>
              {isCategoria
                ? "Esto eliminará la categoría Y TODOS sus sub-items. Esta acción es irreversible."
                : "Esta acción es irreversible."}
            </p>
          </div>
        </div>
        {error && (
          <div className="px-3 py-2 rounded-md" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
            <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{error}</p>
          </div>
        )}
        <div className="flex items-center gap-2 justify-end">
          <button type="button" onClick={onClose} style={cancelBtn}>Cancelar</button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            style={{
              ...submitBtn,
              background: "#991B1B",
              opacity: pending ? 0.7 : 1,
              cursor: pending ? "wait" : "pointer",
            }}
          >
            {pending ? "Eliminando…" : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 43, 74, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          maxWidth: 520,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid #E8E4DD" }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ background: "transparent", border: "none", padding: 4, cursor: "pointer", color: "#6B6660" }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

const monoFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
const addSubButton: React.CSSProperties = {
  height: 32,
  background: "transparent",
  color: "#1A2B4A",
  border: "1px dashed #C9C4BB",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
const submitBtn: React.CSSProperties = {
  height: 34,
  paddingLeft: 16,
  paddingRight: 16,
  background: "#1A2B4A",
  color: "#FFFFFF",
  border: "none",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};
const cancelBtn: React.CSSProperties = {
  height: 34,
  paddingLeft: 14,
  paddingRight: 14,
  background: "transparent",
  color: "#6B6660",
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};

function iconButton(disabled: boolean): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: disabled ? "#C9C4BB" : "#1A2B4A",
    border: "1px solid #E8E4DD",
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
}
