import React, { useState, useRef, useEffect } from "react";

interface Props {
  onSend: (text: string) => void;
  loading: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<Props> = ({ onSend, loading, placeholder }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="relative flex items-end gap-2 bg-itec-surface border border-itec-border rounded-3xl px-4 py-3 focus-within:border-itec-sky/40 transition-all shadow-glass">
      {/* design_system_fixed */}
      <textarea
        id="chat-input"
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
        }}
        placeholder={placeholder ?? "Preguntá lo que quieras..."}
        className="flex-1 bg-transparent text-sm text-itec-text placeholder:text-itec-muted resize-none outline-none leading-relaxed min-h-[22px] max-h-[120px]"
        disabled={loading}
      />
      <button
        onClick={submit}
        disabled={!value.trim() || loading}
        className="w-8 h-8 flex items-center justify-center rounded-2xl bg-itec-box2 hover:bg-itec-gray/30 border border-itec-border disabled:opacity-30 transition-all active:scale-90 shrink-0"
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white -rotate-90 translate-x-px">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
};
