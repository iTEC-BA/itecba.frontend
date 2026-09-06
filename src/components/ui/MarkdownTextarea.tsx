import React, { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { MarkdownContent } from "./MarkdownContent";
import { cn } from "@/lib/utils";

interface Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  /** Texto de ayuda debajo del textarea (por defecto menciona Markdown/LaTeX). */
  hint?: string;
  /** Clase para el <textarea>. `className` se aplica al contenedor externo. */
  textareaClassName?: string;
}

/**
 * Textarea con soporte de Markdown + LaTeX: un botón alterna entre edición
 * y vista previa renderizada con <MarkdownContent/> (react-markdown + KaTeX),
 * el mismo motor que ya usan CourseSidebar / CourseVideoPlayer para mostrar
 * el contenido final. Así el editor deja de ser "texto a ciegas".
 */
export const MarkdownTextarea: React.FC<Props> = ({
  value,
  onChange,
  hint = "Soporta Markdown y LaTeX (ej: **negrita**, $x^2$, $$\\frac{a}{b}$$).",
  className = "",
  textareaClassName = "",
  placeholder,
  ...rest
}) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all",
            showPreview
              ? "bg-itec-section-courses text-white border-itec-section-courses"
              : "bg-itec-box border-itec-border text-itec-gray hover:text-itec-text"
          )}
        >
          {showPreview ? <Pencil className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {showPreview ? "Editar" : "Vista previa"}
        </button>
      </div>

      {showPreview ? (
        <div
          className={cn(
            "w-full bg-itec-box border border-itec-border rounded-lg px-3 py-2 min-h-[60px] overflow-y-auto custom-scrollbar",
            textareaClassName
          )}
        >
          {value?.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-xs text-itec-gray/50 italic">Nada para previsualizar todavía.</p>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-itec-box border border-itec-border rounded-lg px-3 py-2 text-xs text-itec-text placeholder-itec-gray/40 outline-none focus:border-itec-section-courses/50 min-h-[60px] resize-y custom-scrollbar",
            textareaClassName
          )}
          {...rest}
        />
      )}

      {hint && !showPreview && <p className="text-[10px] text-itec-gray/70">{hint}</p>}
    </div>
  );
};
