// src/features/forum/components/atoms/ComposeBox.tsx
// Caja de texto reutilizable para crear posts y respuestas
import React, { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
 
interface ComposeBoxProps {
  placeholder:  string;
  maxLength?:   number;
  minLength?:   number;
  onSubmit:     (body: string) => Promise<void>;
  onCancel?:    () => void;
  autoFocus?:   boolean;
  buttonLabel?: string;
}
 
export const ComposeBox: React.FC<ComposeBoxProps> = ({
  placeholder,
  maxLength   = 2000,
  minLength   = 3,
  onSubmit,
  onCancel,
  autoFocus   = false,
  buttonLabel = "Publicar",
}) => {
  const [body,      setBody]      = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const remaining   = maxLength - body.length;
  const tooShort    = body.trim().length < minLength;
 
  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);
 
  // Auto-grow textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    setError(null);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
 
  const handleSubmit = async () => {
    if (tooShort || loading) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(body.trim());
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al publicar");
    } finally {
      setLoading(false);
    }
  };
 
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
  };
 
  return (
    <div className="rounded-xl border border-itec-border bg-itec-box p-3 space-y-2">
      <textarea
        ref={textareaRef}
        value={body}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full resize-none bg-transparent text-itec-text text-sm placeholder:text-itec-muted outline-none leading-relaxed min-h-[72px]"
      />
      {error && (
        <p className="text-xs text-itec-accent">{error}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`text-xs ${remaining < 50 ? "text-itec-amber" : "text-itec-muted"}`}>
          {remaining} caracteres restantes
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 text-xs text-itec-muted hover:text-itec-text transition-colors px-3 py-1.5 rounded-lg hover:bg-itec-surface"
            >
              <X size={13} /> Cancelar
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={tooShort || loading || remaining < 0}
            className="flex items-center gap-1.5 text-xs font-semibold bg-itec-accent hover:bg-itec-accent/90 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={13} />
            )}
            {loading ? "Publicando..." : buttonLabel}
          </button>
        </div>
      </div>
      <p className="text-[10px] text-itec-muted">
        Ctrl+Enter para publicar · Anónimo — nadie puede ver quién sos
      </p>
    </div>
  );
};
