"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Send, Save, Info, ShieldAlert, Check } from "lucide-react";
import {
  ROLES,
  ROLE_LABELS,
  type RoleSlug,
} from "@/lib/auth/types";
import {
  createUserAction,
  updateUserAction,
  type UserActionState,
} from "./actions";

const initialState: UserActionState = { error: null, ok: false };

const ROLE_DESCRIPTIONS: Record<RoleSlug, string> = {
  superadmin:
    "Control total: gestión de usuarios, configuración global y todos los módulos. Asignar solo a personal técnico de confianza.",
  editor_comm:
    "Páginas, noticias, cronograma, banners, galería, redes sociales y SEO por página.",
  editor_admisiones:
    "Solicitudes, cambios de estado, cupos por nivel y contenido del módulo admisiones.",
  editor_academico:
    "Niveles, IB y sub-páginas, espacios de desarrollo y documentos institucionales.",
};

const ROLES_ORDER: RoleSlug[] = [
  ROLES.EDITOR_COMM,
  ROLES.EDITOR_ADMISIONES,
  ROLES.EDITOR_ACADEMICO,
  ROLES.SUPERADMIN,
];

const inputStyle: React.CSSProperties = {
  fontFamily: "Poppins, sans-serif",
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FFFFFF",
  border: "1.5px solid #C8C4BD",
  borderRadius: 6,
  padding: "10px 14px",
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

type Props =
  | { mode: "create" }
  | {
      mode: "edit";
      userId: string;
      initialFullName: string;
      initialEmail: string;
      initialIsActive: boolean;
      initialRoles: RoleSlug[];
      isSelf: boolean;
    };

export function UserForm(props: Props) {
  const isEdit = props.mode === "edit";

  const action = isEdit
    ? updateUserAction.bind(null, props.userId)
    : createUserAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[720px_1fr] gap-6 items-start">
      <form
        action={formAction}
        className="flex flex-col"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
      >
        <div
          className="flex flex-col gap-1 px-7 py-6"
          style={{ borderBottom: "1px solid #E8E4DD" }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Datos del usuario
          </h2>
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0 }}>
            {isEdit
              ? "Modifica el nombre, los roles asignados o el estado de la cuenta."
              : "Recibirá un correo con sus credenciales para iniciar sesión."}
          </p>
        </div>

        <div className="flex flex-col gap-4 p-7">
          <div>
            <label htmlFor="fullName" style={labelStyle}>
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              disabled={isPending}
              defaultValue={isEdit ? props.initialFullName : ""}
              placeholder="Ej. María Vargas"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1A2B4A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#C8C4BD")}
            />
          </div>

          <div>
            <label htmlFor="email" style={labelStyle}>
              Correo electrónico institucional
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required={!isEdit}
              disabled={isPending || isEdit}
              defaultValue={isEdit ? props.initialEmail : ""}
              placeholder="usuario@atenas.edu.ec"
              style={{
                ...inputStyle,
                background: isEdit ? "#FAF8F4" : "#FFFFFF",
                cursor: isEdit ? "not-allowed" : "text",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = isEdit ? "#C8C4BD" : "#1A2B4A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#C8C4BD")}
            />
            {isEdit && (
              <p style={{ fontSize: 11, color: "#6B6660", margin: "6px 0 0" }}>
                El correo no se puede modificar después de creada la cuenta.
              </p>
            )}
          </div>

          {!isEdit && (
            <div>
              <label htmlFor="password" style={labelStyle}>
                Contraseña temporal
              </label>
              <input
                id="password"
                name="password"
                type="text"
                required
                minLength={8}
                disabled={isPending}
                placeholder="Mínimo 8 caracteres"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#1A2B4A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#C8C4BD")}
              />
              <p style={{ fontSize: 11, color: "#6B6660", margin: "6px 0 0" }}>
                Se la enviarás al usuario por un canal seguro. Se recomienda que la cambie en su primer ingreso.
              </p>
            </div>
          )}

          {isEdit && (
            <label className="flex items-start gap-3 cursor-pointer" style={{ paddingTop: 4 }}>
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={props.initialIsActive}
                disabled={isPending || props.isSelf}
                style={{ marginTop: 3, accentColor: "#1A2B4A", width: 16, height: 16 }}
              />
              <div className="flex flex-col gap-0.5">
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                  Cuenta activa
                </span>
                <span style={{ fontSize: 11, color: "#6B6660" }}>
                  Si la desactivas, este usuario no podrá iniciar sesión en el backoffice.
                  {props.isSelf && " (No puedes desactivar tu propia cuenta.)"}
                </span>
              </div>
            </label>
          )}

          <div className="flex flex-col gap-2.5" style={{ paddingTop: 4 }}>
            <span style={labelStyle}>Roles asignados</span>
            {ROLES_ORDER.map((slug) => {
              const checked = isEdit ? props.initialRoles.includes(slug) : false;
              const isSuperRole = slug === ROLES.SUPERADMIN;
              return (
                <RoleCheckbox
                  key={slug}
                  slug={slug}
                  defaultChecked={checked}
                  isSuperRole={isSuperRole}
                  disabled={isPending}
                />
              );
            })}
          </div>
        </div>

        {state.error && (
          <div
            className="mx-7 mb-4 rounded-md px-4 py-3"
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              fontSize: 12,
              color: "#9A3412",
            }}
          >
            {state.error}
          </div>
        )}

        {isEdit && state.ok && (
          <div
            className="mx-7 mb-4 flex items-center gap-2 rounded-md px-4 py-3"
            style={{
              background: "#F0FDF4",
              border: "1px solid #86EFAC",
              fontSize: 12,
              color: "#065F46",
            }}
          >
            <Check size={14} strokeWidth={2.5} /> Cambios guardados.
          </div>
        )}

        <div
          className="flex justify-end gap-3 px-7 py-5"
          style={{ background: "#FAF8F4", borderTop: "1px solid #E8E4DD" }}
        >
          <Link
            href="/admin/usuarios"
            className="flex items-center justify-center rounded-md transition-colors"
            style={{
              height: 40,
              padding: "0 18px",
              fontSize: 13,
              fontWeight: 600,
              color: "#1A2B4A",
              background: "#FFFFFF",
              border: "1px solid #C8C4BD",
              textDecoration: "none",
            }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-md transition-opacity"
            style={{
              height: 40,
              padding: "0 20px",
              background: "#1A2B4A",
              color: "#FFFFFF",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isEdit ? <Save size={14} /> : <Send size={14} />}
            {isPending
              ? "Guardando…"
              : isEdit
                ? "Guardar cambios"
                : "Crear y enviar invitación"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        <InfoCard
          icon={Info}
          color="#92400E"
          bg="#FEF9E7"
          border="#F0E1AC"
          title="Cómo funciona"
        >
          {isEdit ? (
            <>
              Al guardar los cambios, los roles y el estado se actualizan inmediatamente.
              Si el usuario tiene una sesión abierta, los nuevos permisos se aplican en su
              siguiente petición.
            </>
          ) : (
            <>
              Al crear el usuario, deberás compartirle el correo y la contraseña temporal por
              un canal seguro. Un usuario puede tener varios roles, marca todos los que apliquen.
            </>
          )}
        </InfoCard>

        <InfoCard
          icon={ShieldAlert}
          color="#9A3412"
          bg="#FEF2F2"
          border="#FECACA"
          title="Sobre el rol Superadmin"
        >
          Otorga control total: gestión de usuarios, configuración global y todos los módulos.
          Asignar solo a personal técnico de confianza.
        </InfoCard>
      </div>
    </div>
  );
}

function RoleCheckbox({
  slug,
  defaultChecked,
  isSuperRole,
  disabled,
}: {
  slug: RoleSlug;
  defaultChecked: boolean;
  isSuperRole: boolean;
  disabled: boolean;
}) {
  return (
    <label
      className="flex items-start gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors"
      style={{
        background: "#FAF8F4",
        border: "1.5px solid #E8E4DD",
      }}
    >
      <input
        type="checkbox"
        name="roles"
        value={slug}
        defaultChecked={defaultChecked}
        disabled={disabled}
        style={{ marginTop: 3, accentColor: "#1A2B4A", width: 18, height: 18 }}
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: isSuperRole ? "#9A3412" : "#1A2B4A",
          }}
        >
          {ROLE_LABELS[slug]}
        </span>
        <span style={{ fontSize: 11, fontWeight: 400, color: "#6B6660" }}>
          {ROLE_DESCRIPTIONS[slug]}
        </span>
      </div>
    </label>
  );
}

function InfoCard({
  icon: Icon,
  color,
  bg,
  border,
  title,
  children,
}: {
  icon: typeof Info;
  color: string;
  bg: string;
  border: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-md p-5"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <Icon size={16} color={color} strokeWidth={2.5} />
        <h3 style={{ fontSize: 13, fontWeight: 700, color, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 12, color: "#1A2B4A", lineHeight: 1.55, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}
