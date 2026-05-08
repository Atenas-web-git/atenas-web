"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  hint?: string;
  minHeight?: number;
};

/**
 * Editor de texto rico simple — usa TipTap StarterKit + Link.
 * Output: HTML serializado. Apto para guardar en BD y renderizar con
 * `dangerouslySetInnerHTML` en el frontend público.
 *
 * NO incluye headings 1, imágenes, tablas, código, ni variables.
 * Para casos avanzados (emails con variables, plantillas), usar
 * componentes dedicados.
 */
export function RichTextEditor({
  value,
  onChange,
  label,
  hint,
  minHeight = 200,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener", target: "_blank" },
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rt-editor",
      },
    },
  });

  if (!editor) {
    return (
      <div
        style={{
          minHeight: minHeight + 60,
          background: "#FAFAF8",
          border: "1px solid #E8E4DD",
          borderRadius: 8,
        }}
      />
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Toolbar
          editor={editor}
          onLink={setLink}
        />
        <div style={{ minHeight, padding: 14, background: "#FFFFFF" }}>
          <EditorContent editor={editor} />
        </div>
      </div>
      {hint && (
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.5 }}>
          {hint}
        </span>
      )}

      <style>{`
        .rt-editor:focus { outline: none; }
        .rt-editor h2 { font-size: 18px; font-weight: 700; margin: 10px 0 8px; color: #1A2B4A; }
        .rt-editor h3 { font-size: 15px; font-weight: 700; margin: 8px 0 6px; color: #1A2B4A; }
        .rt-editor p { margin: 6px 0; line-height: 1.65; font-size: 14px; color: #1A2B4A; }
        .rt-editor ul, .rt-editor ol { margin: 8px 0; padding-left: 24px; }
        .rt-editor li { margin: 2px 0; font-size: 14px; color: #1A2B4A; }
        .rt-editor blockquote { border-left: 3px solid #C9A84C; padding-left: 12px; margin: 10px 0; color: #6B6660; font-style: italic; }
        .rt-editor a { color: #C9A84C; text-decoration: underline; }
        .rt-editor strong { font-weight: 700; }
        .rt-editor em { font-style: italic; }
      `}</style>
    </div>
  );
}

function Toolbar({
  editor,
  onLink,
}: {
  editor: ReturnType<typeof useEditor>;
  onLink: () => void;
}) {
  if (!editor) return null;

  const Btn = ({
    active,
    disabled,
    onClick,
    children,
    title,
  }: {
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 28,
        height: 26,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#1A2B4A" : "transparent",
        color: active ? "#FFFFFF" : "#1A2B4A",
        border: "none",
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );

  const Sep = () => (
    <span
      style={{
        display: "inline-block",
        width: 1,
        height: 16,
        background: "#E8E4DD",
        margin: "0 4px",
      }}
    />
  );

  return (
    <div
      className="flex items-center gap-0.5 px-2 py-1 flex-wrap"
      style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}
    >
      <Btn
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Subtítulo"
      >
        <Heading2 size={14} strokeWidth={2} />
      </Btn>
      <Btn
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Subtítulo menor"
      >
        <Heading3 size={14} strokeWidth={2} />
      </Btn>
      <Sep />
      <Btn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrita"
      >
        <Bold size={14} strokeWidth={2.5} />
      </Btn>
      <Btn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Cursiva"
      >
        <Italic size={14} strokeWidth={2.5} />
      </Btn>
      <Btn
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Tachado"
      >
        <Strikethrough size={14} strokeWidth={2.5} />
      </Btn>
      <Sep />
      <Btn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista"
      >
        <List size={14} strokeWidth={2.5} />
      </Btn>
      <Btn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
      >
        <ListOrdered size={14} strokeWidth={2.5} />
      </Btn>
      <Btn
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Cita"
      >
        <Quote size={14} strokeWidth={2.5} />
      </Btn>
      <Sep />
      <Btn active={editor.isActive("link")} onClick={onLink} title="Insertar enlace">
        <LinkIcon size={14} strokeWidth={2.5} />
      </Btn>
      <Sep />
      <Btn
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
        title="Deshacer"
      >
        <Undo size={14} strokeWidth={2.5} />
      </Btn>
      <Btn
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        title="Rehacer"
      >
        <Redo size={14} strokeWidth={2.5} />
      </Btn>
    </div>
  );
}
