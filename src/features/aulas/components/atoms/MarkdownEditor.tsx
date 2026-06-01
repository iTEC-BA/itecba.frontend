// src/features/aulas/components/atoms/MarkdownEditor.tsx
// Editor de Markdown con dos tabs: Editar (textarea) y Vista previa (ReactMarkdown).
// No requiere dependencias nuevas: react-markdown ya está en el proyecto.
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  label:       string;
  placeholder?: string;
  value:       string;
  onChange:    (v: string) => void;
  rows?:       number;
}

const fieldCls =
  "w-full px-4 py-2.5 text-sm rounded-b-2xl rounded-tr-2xl bg-itec-surface " +
  "border border-itec-border text-itec-text outline-none focus:border-itec-sky " +
  "transition-colors placeholder:text-itec-muted/60 resize-none font-mono";

const tabCls = (active: boolean) =>
  `px-4 py-1.5 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer select-none ${
    active
      ? "bg-itec-surface border border-b-0 border-itec-border text-itec-text"
      : "text-itec-muted hover:text-itec-text"
  }`;

/**
 * Estilos inline para el render Markdown.
 * No se usa @tailwindcss/typography para no añadir dependencias;
 * en cambio se aplican clases de Tailwind base directamente al contenedor.
 */
const proseStyles: React.CSSProperties = {
  fontSize:   "0.875rem",
  lineHeight: "1.7",
  color:      "var(--itec-text, #e2e8f0)",
};

export const MarkdownEditor: React.FC<Props> = ({
  label,
  placeholder = "Soporta **negrita**, _cursiva_, listas, `código`, [enlaces](url)...",
  value,
  onChange,
  rows = 5,
}) => {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="flex flex-col gap-0">
      {/* Label */}
      <span className="text-xs font-semibold text-itec-muted mb-1.5">
        {label}
      </span>
      <span className="text-xs ml-2 text-itec-description">
        — soporta Markdown
      </span>

      {/* Tabs */}
      <div className="flex gap-1 items-end">
        <button type="button" className={tabCls(tab === "edit")}    onClick={() => setTab("edit")}>
          Editar
        </button>
        <button type="button" className={tabCls(tab === "preview")} onClick={() => setTab("preview")}>
          Preview
        </button>
      </div>

      {/* Panel Editar */}
      {tab === "edit" && (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={fieldCls}
        />
      )}

      {/* Panel Preview */}
      {tab === "preview" && (
        <div
          className="w-full px-2 py-1 rounded-b-2xl rounded-tr-2xl bg-itec-surface border border-itec-border overflow-auto"
          style={{ minHeight: `${rows * 1.75}rem` }}
        >
          {value.trim() ? (
            <div style={proseStyles} className="markdown-body">
              <ReactMarkdown
                components={{
                  // Párrafos
                  p:      ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  // Títulos
                  h1:     ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 text-itec-text">{children}</h1>,
                  h2:     ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 text-itec-text">{children}</h2>,
                  h3:     ({ children }) => <h3 className="text-base font-semibold mb-2 mt-3 text-itec-text">{children}</h3>,
                  // Listas
                  ul:     ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                  ol:     ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                  li:     ({ children }) => <li className="text-sm text-itec-text">{children}</li>,
                  // Énfasis
                  strong: ({ children }) => <strong className="font-bold text-itec-text">{children}</strong>,
                  em:     ({ children }) => <em className="italic text-itec-text/90">{children}</em>,
                  // Código
                  code:   ({ children }) => (
                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-itec-sky font-mono text-xs">
                      {children}
                    </code>
                  ),
                  pre:    ({ children }) => (
                    <pre className="bg-white/5 rounded-xl p-4 overflow-x-auto mb-3 text-xs font-mono">
                      {children}
                    </pre>
                  ),
                  // Separador
                  hr:     () => <hr className="border-itec-border my-4" />,
                  // Blockquote
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-itec-sky/50 pl-4 italic text-itec-muted/80 my-3">
                      {children}
                    </blockquote>
                  ),
                  // Links
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-itec-sky underline underline-offset-2 hover:text-itec-sky/80"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-itec-muted/50 italic">
              Escribí algo en la pestaña Editar para ver la vista previa...
            </p>
          )}
        </div>
      )}
    </div>
  );
};
