// src/features/faqs/components/organisms/ChatInterface.tsx
import React, { useRef, useEffect } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { ChatMessage } from "../molecules/ChatMessage";
import { ChatInput } from "../molecules/ChatInput";
import { useChatbot } from "../../hooks/useChatbot";
import { cn } from "@/lib/utils";

export interface Message {
  role: "user" | "model";
  text?: string;
  timestamp: Date;
  isAiGenerated?: boolean;
  suggestions?: string[];
}

const INITIAL_SUGGESTIONS = [
  "¿Cuándo me anoto a cursar?",
  "¿Cómo veo los grupos de WhatsApp?",
  "¿Cuándo son los exámenes finales?",
];

// SVG Trash inline para el botón de limpiar chat
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const ChatInterface: React.FC = () => {
  const {
    messages,
    isTyping,
    canUseAI,
    userPoints,
    isCheckingPoints,
    handleSendMessage,
    clearChat,
  } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-none lg:rounded-3xl border-0 lg:border border-itec-border bg-itec-box shadow-glass animate-in fade-in duration-500">

      {/* Glow sutil de fondo */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-itec-sky/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-itec-emerald/5 blur-3xl" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-itec-border bg-itec-box/80 px-5 py-3.5 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-3">
          {/* Avatar del bot */}
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-itec-border bg-itec-surface p-1.5">
            <img
              src="/logo.png"
              alt="ITEC Bot"
              className="h-full w-full object-contain"
            />
            {/* Dot "en línea" */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-itec-box bg-itec-emerald" />
          </div>

          <div>
            <h2 className="text-sm font-bold leading-tight text-itec-text">ITEC Bot</h2>
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-itec-emerald">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-itec-emerald" />
              En línea
            </p>
          </div>
        </div>

        {/* Botón limpiar chat */}
        <button
          onClick={clearChat}
          title="Limpiar chat"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:bg-itec-box2 hover:text-itec-text active:scale-95"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* ── Área de mensajes ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col gap-5 overflow-y-auto p-4 md:p-5">

        {messages.map((msg, index) => (
          <div key={index} className="flex w-full flex-col">
            <ChatMessage
              role={msg.role}
              text={msg.text}
              timestamp={msg.timestamp}
              isAiGenerated={msg.isAiGenerated}
            />

            {/* Sugerencias dinámicas del bot */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="ml-10 mt-2 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {msg.suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className={cn(
                      "rounded-xl border border-itec-sky/20 bg-itec-sky/10 px-3 py-1.5 text-xs font-medium text-itec-sky",
                      "transition-all hover:bg-itec-sky/20 hover:border-itec-sky/40 active:scale-95"
                    )}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Sugerencias iniciales (primer mensaje) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {INITIAL_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className={cn(
                  "rounded-2xl border border-itec-border bg-itec-surface/60 px-4 py-2.5 text-xs font-medium text-itec-muted",
                  "transition-all hover:border-itec-sky/30 hover:bg-itec-sky/10 hover:text-itec-sky active:scale-95"
                )}
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex w-full animate-in fade-in duration-200 justify-start">
            <div className="flex items-end gap-2">
              <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-itec-border bg-itec-surface p-1.5">
                <img src="/logo.png" alt="Bot" className="h-full w-full object-contain" />
              </div>
              <div className="flex h-10 items-center gap-1.5 rounded-2xl rounded-bl-sm border border-itec-border bg-itec-box px-4 py-3">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-itec-sky/60"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        canUseAI={canUseAI}
        userPoints={userPoints}
        isCheckingPoints={isCheckingPoints}
      />
    </div>
  );
};
