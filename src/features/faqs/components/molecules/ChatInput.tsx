// src/features/faqs/components/molecules/ChatInput.tsx
import React, { useState, useRef, useEffect } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";
import { AI_POINTS_COST } from "../../services/chatbotService";

interface Props {
  onSendMessage: (text?: string, forceAI?: boolean) => void;
  disabled?: boolean;
  canUseAI: boolean;
  userPoints: number;
  isCheckingPoints: boolean;
}

export const ChatInput: React.FC<Props> = ({
  onSendMessage,
  disabled,
  canUseAI,
  userPoints,
  isCheckingPoints,
}) => {
  const [input, setInput]   = useState("");
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input, false);
    setInput("");
  };

  const handleForceAI = () => {
    if (!input.trim() || disabled || !canUseAI) return;
    onSendMessage(input, true);
    setInput("");
  };

  const aiButtonActive = input.trim() && !disabled && canUseAI && !isCheckingPoints;

  return (
    <div className="shrink-0 border-t border-itec-border bg-itec-box/80 px-4 py-3 backdrop-blur-xl">
      {/* Input principal */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder="Escribí tu consulta..."
            className={cn(
              "w-full rounded-2xl border bg-itec-surface/80 px-4 py-3 pr-10 text-sm text-itec-text outline-none backdrop-blur-sm transition-all",
              "placeholder:text-itec-muted/60",
              "border-itec-border focus:border-itec-sky/40 focus:ring-2 focus:ring-itec-sky/10",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </div>

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all",
            "border-itec-sky/30 bg-itec-sky/20 text-itec-sky",
            "hover:bg-itec-sky/30 active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:scale-100"
          )}
          aria-label="Enviar mensaje"
        >
          <Icons type="send" className="h-4 w-4" />
        </button>
      </form>

      {/* Botón IA Avanzada */}
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handleForceAI}
          disabled={!aiButtonActive}
          title={
            !canUseAI
              ? `Necesitás ${AI_POINTS_COST} puntos (tenés ${userPoints})`
              : `Cuesta ${AI_POINTS_COST} puntos`
          }
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all",
            aiButtonActive
              ? "cursor-pointer border-itec-sky/25 bg-itec-sky/10 text-itec-sky hover:bg-itec-sky/20 active:scale-95 shadow-[0_0_12px_rgba(56,189,248,0.1)]"
              : "cursor-not-allowed border-itec-border/50 bg-transparent text-itec-muted/50"
          )}
        >
          {/* Icono IA */}
          <div className="h-3.5 w-3.5 shrink-0">
            <Icons type="star" />
          </div>
          <span>
            {isCheckingPoints
              ? "Verificando..."
              : canUseAI
              ? `Consultar con IA · ${AI_POINTS_COST} pts`
              : `Sin puntos suficientes (${userPoints}/${AI_POINTS_COST})`}
          </span>
        </button>

        {/* Indicador de puntos disponibles */}
        {!isCheckingPoints && (
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-[0.2em]",
            canUseAI ? "text-itec-emerald" : "text-itec-muted"
          )}>
            {userPoints} pts
          </span>
        )}
      </div>
    </div>
  );
};
