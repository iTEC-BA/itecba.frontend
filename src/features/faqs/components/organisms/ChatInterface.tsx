import React, { useEffect, useRef, useState } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import { useFAQs } from "../../hooks/useFAQs";
import { ChatMessage } from "../molecules/ChatMessage";
import { ChatInput } from "../molecules/ChatInput";
import { FAQSuggestions } from "./FAQSuggestions";
import { FAQAdminPanel } from "./FAQAdminPanel";
import { AIBadge } from "../atoms/AIBadge";
import { useAuth } from "@context/AuthContext";
import Logo from "@assets/logo.png"
import { Icons } from "@/components/ui/icons/Icons";

export const ChatInterface: React.FC = () => {
  const {
    messages,
    loading,
    mode,
    error,
    canUseAI,
    userPoints,
    sendMessage,
    toggleMode,
    clearChat,
    AI_COST,
  } = useChatbot();
  const { topFaqs, loading: faqsLoading } = useFAQs();
  const { isAdmin } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasConversation = messages.length > 1;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-dvh bg-itec-bg overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-itec-border bg-itec-box backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600/40 to-indigo-600/30 border border-white/10 flex items-center justify-center">
            <img src={Logo} alt="" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">
              Asistente ITEC
            </p>
            <p className="text-[10px] text-emerald-400 mt-0.5">En línea</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Puntos */}
          {userPoints > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-300/10 border border-amber-300/20 px-2.5 py-1 rounded-full">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
              </svg>
              {userPoints} pts
            </span>
          )}

          {/* Limpiar chat */}
          {hasConversation && (
            <button
              onClick={clearChat}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              title="Nueva conversación"
            >
              <img src={Logo} alt="" />
            </button>
          )}

          {/* Admin */}
          {isAdmin && (
            <button
              onClick={() => setAdminOpen(true)}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              title="Admin FAQs"
            >
              <Icons type="settings" className="size-4"/>
            </button>
          )}
        </div>
      </header>

      {/* Cuerpo de mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasConversation ? (
          <FAQSuggestions
            topFaqs={topFaqs}
            loading={faqsLoading}
            onSelect={sendMessage}
          />
        ) : (
          <div className="px-4 py-4 max-w-2xl mx-auto w-full">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </div>

      {/* Barra inferior */}
      <div className="shrink-0 border-t border-itec-border bg-itec-box backdrop-blur-xl pb-[env(safe-area-inset-bottom)] px-4 py-3">
        <div className="max-w-2xl mx-auto space-y-2">
          {/* Toggle IA */}
          <div className="flex items-center justify-between">
            <button
              onClick={toggleMode}
              disabled={!canUseAI && mode === "faq"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                mode === "ai"
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : canUseAI
                    ? "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                    : "bg-white/3 border-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${mode === "ai" ? "bg-violet-400 animate-pulse" : "bg-white/20"}`}
              />
              {mode === "ai" ? "IA Activa" : "Activar IA"}
              <AIBadge cost={AI_COST} active={mode === "ai"} />
            </button>
            {!canUseAI && (
              <p className="text-[10px] text-white/25">
                Necesitás {AI_COST} pts para usar la IA
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            loading={loading}
            placeholder={
              mode === "ai"
                ? "Preguntale a la IA..."
                : "Buscá entre las FAQs..."
            }
          />
        </div>
      </div>

      {/* Modal admin */}
      {isAdmin && (
        <FAQAdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      )}
    </div>
  );
};
