#!/usr/bin/env bash
# =============================================================================
# fix_faqs.sh — Aplica estilo oscuro premium Bento/Glassmorphism
# a FaqsPage + features/faqs/*, corrige endpoint AI (auth token),
# descuenta 5 puntos por consulta IA, y hace mobile = solo chat fullscreen.
#
# Ejecutar desde la RAIZ del proyecto itecba-frontend:
#   chmod +x fix_faqs.sh && ./fix_faqs.sh
# =============================================================================
set -euo pipefail

CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RESET='\033[0m'
info() { echo -e "${CYAN}[INFO]${RESET}  $1"; }
ok()   { echo -e "${GREEN}[OK]${RESET}    $1"; }

info "Iniciando fix de FaqsPage + features/faqs/*..."

mkdir -p src/features/faqs/components/molecules
mkdir -p src/features/faqs/components/organisms
mkdir -p src/features/faqs/hooks
mkdir -p src/features/faqs/services
mkdir -p src/features/faqs/types


# =============================================================================
# 1. src/pages/FaqsPage.tsx
#    - Mobile: solo ChatInterface a fullscreen (ImportantDatesWidget hidden)
#    - Desktop: layout 2/3 + 1/3 bento grid
#    - Elimina PageHeader (ya está en el header del chat)
# =============================================================================
info "Patching: src/pages/FaqsPage.tsx"
cat > src/pages/FaqsPage.tsx << 'HEREDOC'
// src/pages/FaqsPage.tsx
import React from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { usePageTitle } from "@hooks/usePageTitle";
import { useAuth } from "@context/AuthContext";
import { ChatInterface } from "@features/faqs/components/organisms/ChatInterface";
import { ImportantDatesWidget } from "@features/faqs/components/organisms/ImportantDatesWidget";

export const FaqsPage: React.FC = () => {
  usePageTitle("Consultas — ITEC");
  const { isAdmin } = useAuth();

  return (
    <MainLayout>
      {/*
        Mobile: ChatInterface ocupa toda la pantalla disponible.
        El calendario está oculto. Se muestra un layout de "un solo panel".
        Desktop (lg+): Grid 2/3 chat + 1/3 calendario.
      */}
      <div className="grid grid-cols-1 gap-0 lg:gap-6 lg:grid-cols-3 max-w-7xl mx-auto">

        {/* Chat — fullscreen en mobile, 2/3 en desktop */}
        <div className="lg:col-span-2 h-[calc(100dvh-4rem)] lg:h-auto">
          <ChatInterface />
        </div>

        {/* Calendario — OCULTO en mobile, visible en lg+ */}
        <div className="hidden lg:block lg:col-span-1">
          <ImportantDatesWidget isAdmin={isAdmin} />
        </div>

      </div>
    </MainLayout>
  );
};
HEREDOC
ok "FaqsPage.tsx patched"


# =============================================================================
# 2. src/features/faqs/services/chatbotService.ts
#    FIXES:
#    - Agrega token de Firebase Auth en askAdvancedAI (el endpoint requiere verifyToken)
#    - Mejora el hiddenContextQuery para respuestas más precisas
#    - Descuenta 5 puntos en Firestore al usar IA (deductAIPoints)
#    - Elimina emoji 👇 del texto de fallback
#    - canUseAI ahora delega en puntos, no en tiempo
# =============================================================================
info "Patching: chatbotService.ts"
cat > src/features/faqs/services/chatbotService.ts << 'HEREDOC'
// src/features/faqs/services/chatbotService.ts
import { FAQ_DATABASE } from "../types/faqs";
import type { Message } from "../components/organisms/ChatInterface";
import { auth } from "@lib/firebase";
import { db } from "@lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

const normalizeText = (text?: string) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,]/g, "")
    .trim();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Costo en puntos por usar la IA avanzada
export const AI_POINTS_COST = 5;

export const chatbotService = {

  /* ── Búsqueda local en FAQ_DATABASE ───────────────────────────────────── */
  searchFaqAnswer: (query: string): { text?: string; suggestions?: string[] } => {
    const cleanQuery = normalizeText(query);
    const queryWords = cleanQuery.split(" ");

    if (["hola", "buenas", "holis", "que tal", "saludos"].includes(cleanQuery)) {
      return {
        text: "Hola. ¿En qué te puedo ayudar hoy? Escribime tu consulta o elegí una opción rápida.",
      };
    }

    let bestMatch = null;
    let maxScore = 0;

    for (const faq of FAQ_DATABASE) {
      let score = 0;
      for (const kw of faq.keywords) {
        const cleanKw = normalizeText(kw);
        if (cleanKw.includes(" ")) {
          if (cleanQuery.includes(cleanKw)) score += 3;
        } else {
          if (queryWords.includes(cleanKw)) score += 1;
        }
      }
      if (score > maxScore) { maxScore = score; bestMatch = faq; }
    }

    if (bestMatch && maxScore > 0) {
      return { text: bestMatch.answer };
    }

    // Coincidencias parciales → sugerencias como botones
    const looseWords = queryWords.filter((w) => w.length >= 4);
    let relatedSuggestions: string[] = [];

    if (looseWords.length > 0) {
      const relatedFaqs = FAQ_DATABASE.filter((faq) =>
        looseWords.some(
          (lw) =>
            normalizeText(faq.answer).includes(lw) ||
            faq.keywords.some((kw) => normalizeText(kw).includes(lw))
        )
      );
      relatedSuggestions = relatedFaqs.slice(0, 3).map(
        (faq) => `¿Información sobre ${faq.keywords[0]}?`
      );
    }

    if (relatedSuggestions.length === 0) {
      relatedSuggestions = [
        "¿Trámites de Bedelía?",
        "¿Fechas de exámenes?",
        "¿Grupos de WhatsApp?",
      ];
    }

    return {
      text: "No encontré una respuesta exacta en mi base rápida. ¿Quizás te referías a alguna de estas opciones?\n\n*(Tip: También podés usar el botón **Consultar con IA** para analizar tu pregunta a fondo — cuesta 5 puntos).*",
      suggestions: relatedSuggestions,
    };
  },

  /* ── Consulta a la IA avanzada (Groq via backend) ─────────────────────── */
  askAdvancedAI: async (query: string, rawHistory: Message[]): Promise<string> => {
    try {
      // Obtener Firebase ID token — requerido por verifyToken en el backend
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        return "Para usar la IA avanzada necesitás estar logueado.";
      }

      const formattedHistory = rawHistory.slice(1).map((msg) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      // Construir contexto FAQ enriquecido (top-5 más relevantes)
      const cleanQuery = normalizeText(query);
      const queryWords = cleanQuery.split(" ");

      const scoredFaqs = FAQ_DATABASE.map((faq) => {
        let score = 0;
        for (const kw of faq.keywords) {
          const cleanKw = normalizeText(kw);
          if (cleanKw.includes(" ")) {
            if (cleanQuery.includes(cleanKw)) score += 3;
          } else {
            if (queryWords.includes(cleanKw)) score += 1;
          }
        }
        return { ...faq, score };
      });

      const top5 = scoredFaqs.sort((a, b) => b.score - a.score).slice(0, 5);
      const faqContext = top5
        .map((f) => `• [${f.keywords.slice(0, 3).join(" / ")}]: ${f.answer}`)
        .join("\n\n");

      // Prompt mejorado para respuestas precisas y acotadas
      const enrichedMessage = [
        "=== CONTEXTO OFICIAL ITEC / UTN FRBA ===",
        faqContext,
        "=== FIN CONTEXTO ===",
        "",
        "INSTRUCCIÓN: Respondé la siguiente consulta de forma DIRECTA, BREVE y PRECISA.",
        "Basate PRIMERO en el contexto oficial de arriba.",
        "Si la respuesta está ahí, no inventes ni agregues información innecesaria.",
        "Si no hay información suficiente en el contexto, guiá al estudiante a los recursos oficiales (SIGA, web UTN, etc).",
        "Usá formato markdown solo cuando aporte claridad (listas, negritas).",
        "Máximo 250 palabras.",
        "",
        `Consulta: "${query}"`,
      ].join("\n");

      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: enrichedMessage,
          history: formattedHistory,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("AI endpoint error:", response.status, errData);
        throw new Error(`Error ${response.status}: ${errData.message ?? response.statusText}`);
      }

      const data = await response.json();
      return data.response ?? "Sin respuesta del servidor.";
    } catch (error) {
      console.error("Error en askAdvancedAI:", error);
      return "No me pude conectar con el servidor de IA. Intentá de nuevo en unos segundos.";
    }
  },

  /* ── Sistema de puntos para IA ─────────────────────────────────────────── */

  /** Obtiene los puntos actuales del usuario desde Firestore */
  getUserPoints: async (uid: string): Promise<number> => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      return snap.exists() ? (snap.data().points ?? 0) : 0;
    } catch {
      return 0;
    }
  },

  /** Verifica si el usuario tiene puntos suficientes para usar la IA */
  canUseAI: async (uid: string): Promise<boolean> => {
    const points = await chatbotService.getUserPoints(uid);
    return points >= AI_POINTS_COST;
  },

  /** Descuenta AI_POINTS_COST puntos en Firestore */
  deductAIPoints: async (uid: string): Promise<boolean> => {
    try {
      const points = await chatbotService.getUserPoints(uid);
      if (points < AI_POINTS_COST) return false;
      await updateDoc(doc(db, "users", uid), {
        points: increment(-AI_POINTS_COST),
      });
      return true;
    } catch (err) {
      console.error("Error al descontar puntos:", err);
      return false;
    }
  },
};
HEREDOC
ok "chatbotService.ts patched"


# =============================================================================
# 3. src/features/faqs/hooks/useChatbot.ts
#    FIXES:
#    - canUseAI ahora es async (consulta puntos en Firestore)
#    - deductAIPoints antes de llamar a la IA
#    - Bloquea el envío si no tiene puntos
#    - Elimina todo el sistema localStorage de tiempo
#    - Muestra puntos disponibles en lugar de tiempo restante
#    - Elimina emoji ✅ y ⚠️
# =============================================================================
info "Patching: useChatbot.ts"
cat > src/features/faqs/hooks/useChatbot.ts << 'HEREDOC'
// src/features/faqs/hooks/useChatbot.ts
import { useState, useEffect, useCallback } from "react";
import type { Message } from "../components/organisms/ChatInterface";
import { chatbotService, AI_POINTS_COST } from "../services/chatbotService";
import { ITEC_FOOTER } from "../types/faqs";
import { useAuth } from "@context/AuthContext";

const WELCOME_MESSAGE: Message = {
  role: "model",
  text: "Hola. Soy **ITEC Bot**.\n\nEstoy aquí para resolver tus dudas sobre la UTN BA. Escribime tu consulta o elegí una opción rápida.",
  timestamp: new Date(),
};

export const useChatbot = () => {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [messages, setMessages]       = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping]       = useState(false);
  const [canUseAI, setCanUseAI]       = useState(false);
  const [userPoints, setUserPoints]   = useState<number>(0);
  const [isCheckingPoints, setIsCheckingPoints] = useState(false);

  // Recarga puntos desde Firestore
  const refreshPoints = useCallback(async () => {
    if (!uid) { setCanUseAI(false); setUserPoints(0); return; }
    setIsCheckingPoints(true);
    try {
      const pts = await chatbotService.getUserPoints(uid);
      setUserPoints(pts);
      setCanUseAI(pts >= AI_POINTS_COST);
    } finally {
      setIsCheckingPoints(false);
    }
  }, [uid]);

  useEffect(() => {
    refreshPoints();
  }, [refreshPoints]);

  const handleSendMessage = async (text?: string, forceAI = false) => {
    if (!text?.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text, timestamp: new Date() }]);
    setIsTyping(true);

    try {
      if (forceAI) {
        // Verificar puntos antes de llamar a la IA
        if (!uid) {
          setMessages((prev) => [
            ...prev,
            {
              role: "model",
              text: "Necesitás estar logueado para usar la IA avanzada.",
              timestamp: new Date(),
            },
          ]);
          return;
        }

        const pts = await chatbotService.getUserPoints(uid);
        if (pts < AI_POINTS_COST) {
          setMessages((prev) => [
            ...prev,
            {
              role: "model",
              text: `No tenés suficientes puntos para usar la IA avanzada. Necesitás **${AI_POINTS_COST} puntos** y tenés **${pts}**.\n\nPodés ganar puntos subiendo aportes o participando en la comunidad.`,
              timestamp: new Date(),
            },
          ]);
          return;
        }

        // Descontar puntos primero
        const deducted = await chatbotService.deductAIPoints(uid);
        if (!deducted) {
          setMessages((prev) => [
            ...prev,
            {
              role: "model",
              text: "No se pudieron descontar los puntos. Intentá de nuevo.",
              timestamp: new Date(),
            },
          ]);
          return;
        }

        // Llamar a la IA
        const aiResponse = await chatbotService.askAdvancedAI(text, messages);
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: aiResponse,
            timestamp: new Date(),
            isAiGenerated: true,
          },
        ]);

        // Refrescar puntos en UI
        await refreshPoints();
      } else {
        // Respuesta del FAQ local (con pequeño delay natural)
        await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 400) + 400));

        const isGreeting = ["hola", "buenas", "holis"].includes(
          text.toLowerCase().trim()
        );
        const responseData = chatbotService.searchFaqAnswer(text);
        const finalAnswer = responseData.text + (isGreeting ? "" : "\n\n" + ITEC_FOOTER);

        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: finalAnswer,
            timestamp: new Date(),
            suggestions: responseData.suggestions,
          },
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("¿Querés limpiar el historial de esta conversación?")) {
      setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    }
  };

  return {
    messages,
    isTyping,
    canUseAI,
    userPoints,
    isCheckingPoints,
    handleSendMessage,
    clearChat,
    refreshPoints,
  };
};
HEREDOC
ok "useChatbot.ts patched"


# =============================================================================
# 4. src/features/faqs/components/molecules/ChatInput.tsx
#    FIXES:
#    - Glassmorphism: bg-itec-box/80 backdrop-blur-xl
#    - Tokens itec: border-itec-border, focus:border-itec-sky
#    - Botón IA: tone-on-tone con itec-sky, sin purple crudo
#    - Elimina emojis ✨ ⏳
#    - Muestra puntos disponibles en el botón IA
#    - Microinteracciones active:scale-95
#    - Props: userPoints en lugar de timeLeftAI
# =============================================================================
info "Patching: ChatInput.tsx"
cat > src/features/faqs/components/molecules/ChatInput.tsx << 'HEREDOC'
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
HEREDOC
ok "ChatInput.tsx patched"


# =============================================================================
# 5. src/features/faqs/components/molecules/ChatMessage.tsx
#    FIXES:
#    - Elimina emojis ✓ y 📋
#    - Corrige bug de clase concatenada: `text-itec-textrounded-2xl` → separado
#    - Reemplaza bg-gradient-to-tr from-blue-600 con itec-sky tone-on-tone
#    - Reemplaza text-gray-200/300/500 con tokens itec
#    - Reemplaza text-teal-400/text-blue-400 con tokens
#    - Copy button: usa Icons type="copy" (si existe) o un SVG inline
# =============================================================================
info "Patching: ChatMessage.tsx"
cat > src/features/faqs/components/molecules/ChatMessage.tsx << 'HEREDOC'
// src/features/faqs/components/molecules/ChatMessage.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

interface Props {
  role: "user" | "model";
  text?: string;
  timestamp: Date;
  isAiGenerated?: boolean;
}

// SVG Copy inline (no depende de Icons si no existe "copy" ahí)
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Icono usuario inline
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const ChatMessage: React.FC<Props> = ({ role, text, timestamp, isAiGenerated }) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const timeString = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(text ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[90%] gap-2 md:max-w-[85%] items-end",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "mb-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
            isUser
              ? "border border-itec-sky/30 bg-itec-sky/20"
              : "p-1 border border-itec-border bg-itec-surface"
          )}
        >
          {isUser ? (
            <UserIcon className="h-4 w-4 text-itec-sky" />
          ) : (
            <img
              src="/logo.png"
              alt="ITEC Bot"
              className="h-full w-full object-contain"
            />
          )}
        </div>

        {/* Burbuja + metadata */}
        <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
          {/* Burbuja */}
          <div
            className={cn(
              "relative px-4 py-3 text-sm shadow-sm",
              isUser
                ? "rounded-2xl rounded-br-sm border border-itec-sky/20 bg-itec-sky/15 text-itec-text"
                : "rounded-2xl rounded-bl-sm border border-itec-border bg-itec-box text-itec-text/90"
            )}
          >
            {isAiGenerated && (
              <div className="mb-2 flex items-center gap-1.5">
                <div className="h-3 w-3 text-itec-sky">
                  <Icons type="star" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-itec-sky">
                  IA
                </span>
              </div>
            )}

            {isUser ? (
              <p className="leading-relaxed">{text}</p>
            ) : (
              <ReactMarkdown
                components={{
                  strong: ({ ...props }) => (
                    <span className="font-bold text-itec-text" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-3 last:mb-0 leading-relaxed text-itec-text/90" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="mb-3 list-disc space-y-1 pl-5 text-itec-muted" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li className="marker:text-itec-sky" {...props} />
                  ),
                  a: ({ ...props }) => (
                    <a
                      className="inline-flex items-center gap-1 font-medium text-itec-sky hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  code: ({ ...props }) => (
                    <code
                      className="rounded-lg border border-itec-border bg-itec-surface/80 px-1.5 py-0.5 font-mono text-xs text-itec-sky"
                      {...props}
                    />
                  ),
                  hr: () => (
                    <hr className="my-3 border-itec-border/50" />
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </div>

          {/* Hora + copiar */}
          <div className="mt-1 flex items-center gap-3 px-1">
            <span className="text-[10px] font-medium text-itec-muted">{timeString}</span>

            {!isUser && (
              <button
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-bold transition-all",
                  "opacity-0 group-hover:opacity-100 focus:opacity-100",
                  copied
                    ? "border-itec-emerald/20 bg-itec-emerald/10 text-itec-emerald"
                    : "border-itec-border bg-itec-surface/60 text-itec-muted hover:text-itec-text"
                )}
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-2.5 w-2.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-2.5 w-2.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
HEREDOC
ok "ChatMessage.tsx patched"


# =============================================================================
# 6. src/features/faqs/components/organisms/ChatInterface.tsx
#    FIXES:
#    - h-full en lugar de h-[650px] fijo → se adapta al padre
#    - Header glassmorphism: bg-itec-box/80 backdrop-blur-xl border-itec-border
#    - Elimina bg-green-500 → bg-itec-emerald para el dot de "en línea"
#    - Elimina bg-itec-sidebar → bg-itec-box/80
#    - Sugerencias tone-on-tone: border-itec-sky/20 bg-itec-sky/10 text-itec-sky
#    - Typing dots con itec-sky
#    - Glow sutil de fondo
#    - useChatbot ya no recibe userEmail (lo obtiene internamente)
#    - Props actualizadas: userPoints, isCheckingPoints en lugar de timeLeftAI
# =============================================================================
info "Patching: ChatInterface.tsx"
cat > src/features/faqs/components/organisms/ChatInterface.tsx << 'HEREDOC'
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
HEREDOC
ok "ChatInterface.tsx patched"


# =============================================================================
# 7. src/features/faqs/components/organisms/ImportantDatesWidget.tsx
#    FIXES:
#    - Emoji 📅 → Icons type="bell" (o calendar SVG inline)
#    - bg-orange-500/20 text-orange-500 → itec-amber tone-on-tone
#    - bg-gray-500 group-hover:bg-orange-400 → itec-muted / itec-amber
#    - bg-itec-gray → bg-itec-surface/60
#    - Botón Agregar: tone-on-tone itec-amber
#    - border-itec-gray → border-itec-border
#    - text-itec-text typos corregidos (queda sin espacio en original)
# =============================================================================
info "Patching: ImportantDatesWidget.tsx"
cat > src/features/faqs/components/organisms/ImportantDatesWidget.tsx << 'HEREDOC'
// src/features/faqs/components/organisms/ImportantDatesWidget.tsx
import React, { useState, Suspense, useMemo } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

const AddDateModal = React.lazy(() =>
  import("./AddDateModal").then((m) => ({ default: m.AddDateModal }))
);

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description: string;
  expiryDate?: string;
}

interface Props {
  isAdmin: boolean;
}

// SVG Calendar inline
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const ImportantDatesWidget: React.FC<Props> = ({ isAdmin }) => {
  const [dates, setDates] = useState<ImportantDate[]>([
    {
      id: "1",
      title: "Inscripción a Cursada",
      date: "15 al 20 de Marzo",
      description: "A través del sistema SIGA.",
      expiryDate: "2026-03-21T00:00:00",
    },
    {
      id: "2",
      title: "Inicio 1er Cuatrimestre",
      date: "25 de Marzo",
      description: "Comienzo oficial de clases.",
      expiryDate: "2026-03-26T00:00:00",
    },
    {
      id: "3",
      title: "Exámenes Finales",
      date: "10 de Julio",
      description: "Turno de julio. Anotarse 48hs antes.",
      expiryDate: "2026-07-15T00:00:00",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeDates = useMemo(() => {
    const now = new Date().getTime();
    return dates.filter((item) => {
      if (!item.expiryDate) return true;
      return new Date(item.expiryDate).getTime() > now;
    });
  }, [dates]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-itec-border bg-itec-box p-6 shadow-glass h-full animate-in fade-in duration-500">
      {/* Glow sutil */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-itec-amber/5 blur-3xl" />

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-itec-amber/20 bg-itec-amber/10 text-itec-amber">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Académico
            </p>
            <h2 className="text-sm font-bold tracking-tight text-itec-text">
              Calendario
            </h2>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            title="Agregar fecha"
            className={cn(
              "flex items-center gap-1.5 rounded-xl border border-itec-amber/20 bg-itec-amber/10 px-3 py-1.5",
              "text-xs font-bold text-itec-amber transition-all",
              "hover:bg-itec-amber/20 hover:border-itec-amber/40 active:scale-95"
            )}
          >
            <Icons type="plus" className="h-3.5 w-3.5" />
            Agregar
          </button>
        )}
      </div>

      {activeDates.length > 0 ? (
        <div className="relative z-10 ml-3 space-y-6 border-l border-itec-border/50 pb-2">
          {activeDates.map((item, index) => (
            <div key={item.id} className="group relative pl-5">
              {/* Dot en la línea de tiempo */}
              <span
                className={cn(
                  "absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-itec-box transition-all",
                  index === 0
                    ? "bg-itec-amber shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    : "bg-itec-muted/40 group-hover:bg-itec-amber/60"
                )}
              />

              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-amber">
                {item.date}
              </p>
              <h3 className="mb-1.5 text-sm font-bold leading-snug text-itec-text">
                {item.title}
              </h3>
              {item.description && (
                <p className="rounded-xl border border-itec-border/40 bg-itec-surface/50 p-2.5 text-xs leading-relaxed text-itec-muted">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-10 rounded-2xl border border-dashed border-itec-border bg-itec-surface/30 py-10 text-center">
          <p className="text-sm text-itec-muted">No hay fechas próximas vigentes.</p>
        </div>
      )}

      {isAdmin && isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />}>
          <AddDateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={(newDate) => setDates((prev) => [...prev, newDate])}
          />
        </Suspense>
      )}
    </section>
  );
};
HEREDOC
ok "ImportantDatesWidget.tsx patched"


# =============================================================================
# 8. src/features/faqs/components/organisms/AddDateModal.tsx
#    FIXES:
#    - bg-black/90 → bg-black/70 backdrop-blur-md (glassmorphism)
#    - rounded-2xl → rounded-t-4xl sm:rounded-3xl (bottom-sheet en mobile)
#    - animate-in slide-in-from-bottom (bottom-sheet)
#    - border-itec-gray → border-itec-border
#    - text-gray-500 → text-itec-muted
#    - Glow sutil de fondo
#    - Typos corregidos
# =============================================================================
info "Patching: AddDateModal.tsx"
cat > src/features/faqs/components/organisms/AddDateModal.tsx << 'HEREDOC'
// src/features/faqs/components/organisms/AddDateModal.tsx
import React, { useState } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@components/ui/Button";
import type { ImportantDate } from "./ImportantDatesWidget";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newDate: ImportantDate) => void;
}

export const AddDateModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle]             = useState("");
  const [date, setDate]               = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    // TODO: Reemplazar con llamado a API (ej: datesService.createDate(...))
    const newDate: ImportantDate = {
      id: Date.now().toString(),
      title,
      date,
      description,
    };
    onAdd(newDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    /* Backdrop con blur */
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4">

      {/* Panel — bottom-sheet en mobile, modal en sm+ */}
      <div className="relative w-full sm:max-w-md overflow-hidden rounded-t-4xl sm:rounded-3xl border border-itec-border bg-itec-box p-6 shadow-glass animate-in slide-in-from-bottom duration-300 sm:zoom-in-95">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-itec-amber/5 blur-3xl" />

        {/* Handle (solo mobile) */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-itec-border sm:hidden" />

        {/* Header */}
        <div className="relative z-10 mb-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Calendario
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-itec-text">
              Agregar Fecha
            </h2>
            <p className="mt-1 text-xs text-itec-muted">
              Será visible para todos los estudiantes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:bg-itec-box2 hover:text-itec-text active:scale-95"
          >
            <Icons type="close" className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Título del Evento
            </label>
            <Input
              fullWidth
              placeholder="Ej: Exámenes Finales"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Día / Rango
            </label>
            <Input
              fullWidth
              placeholder="Ej: 10 al 15 de Diciembre"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Descripción breve
            </label>
            <Input
              fullWidth
              placeholder="Anotarse por SIGA..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-itec-border pt-4">
            <Button type="button" variant="slate" hierarchy="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="warning" hierarchy="solid">
              Guardar Fecha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
HEREDOC
ok "AddDateModal.tsx patched"


# =============================================================================
# 9. BACKEND: src/modules/ais/ai.routes.js
#    FIXES:
#    - Agrega endpoint POST /api/ai/deduct-points para descontar puntos
#      con verifyToken (user propio puede hacerlo)
#    - El usuario puede descontarse sus propios puntos (no requiere admin)
# =============================================================================
info "Patching backend: ai.routes.js"
# Comprueba si existe el directorio backend
BACKEND_DIR=""
if   [ -d "../itecba-backend/src/modules/ais" ]; then BACKEND_DIR="../itecba-backend"
elif [ -d "../../itecba-backend/src/modules/ais" ]; then BACKEND_DIR="../../itecba-backend"
elif [ -d "./src/modules/ais" ]; then BACKEND_DIR="."
fi

if [ -n "$BACKEND_DIR" ]; then
  cat > "$BACKEND_DIR/src/modules/ais/ai.routes.js" << 'BACKENDEOF'
import { Router }      from "express";
import { body }        from "express-validator";
import { validate }    from "../../middlewares/validate.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import { generateAIResponse } from "./ai.service.js";
import { dbFirebase }  from "../../config/firebase-admin.js";

const router = Router();

/* ── POST /api/ai/chat ─────────────────────────────────────────────────────
   Genera respuesta de IA. Requiere token (verifyToken).
   El frontend ya descontó los puntos antes de llamar este endpoint.
─────────────────────────────────────────────────────────────────────────── */
router.post(
  "/chat",
  verifyToken,
  [
    body("message")
      .trim()
      .notEmpty().withMessage("El mensaje no puede estar vacío")
      .isLength({ max: 2000 }).withMessage("Mensaje demasiado largo (máx. 2000 caracteres)"),
    body("history")
      .optional()
      .isArray({ max: 20 }).withMessage("Historial inválido"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { message, history = [] } = req.body;
      const response = await generateAIResponse(message, history);
      res.json({ response });
    } catch (err) {
      next(err);
    }
  }
);

/* ── PATCH /api/ai/deduct-points ─────────────────────────────────────────
   El usuario autenticado descuenta AI_POINTS_COST puntos de su propio perfil.
   Valida que tenga puntos suficientes antes de descontar.
   Nota: el frontend también hace esto via Firestore directo como fallback,
   pero tener el endpoint permite centralizar la lógica en el futuro.
─────────────────────────────────────────────────────────────────────────── */
const AI_POINTS_COST = 5;

router.patch(
  "/deduct-points",
  verifyToken,
  async (req, res, next) => {
    try {
      const uid = req.user.uid;
      const ref = dbFirebase.collection("users").doc(uid);
      const snap = await ref.get();

      if (!snap.exists) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const current = snap.data().points ?? 0;

      if (current < AI_POINTS_COST) {
        return res.status(402).json({
          message: `Puntos insuficientes. Necesitás ${AI_POINTS_COST}, tenés ${current}.`,
          points: current,
        });
      }

      const newTotal = current - AI_POINTS_COST;
      await ref.set({ points: newTotal }, { merge: true });

      res.json({ points: newTotal, deducted: AI_POINTS_COST });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
BACKENDEOF
  ok "ai.routes.js patched (backend: $BACKEND_DIR)"
else
  echo -e "${YELLOW}[WARN]${RESET}   Backend no encontrado. Copiar manualmente ai.routes.js o parcharlo desde el .txt."
fi


# =============================================================================
# 10. Verificación de emojis residuales en features/faqs y FaqsPage
# =============================================================================
info "Verificando emojis residuales en features/faqs y FaqsPage..."
EMOJI_FOUND=$(grep -rn \
  --include="*.tsx" --include="*.ts" \
  $'[\U0001F4C5\U00002705\U000023F3\U00002728\U0001F4CB\U0001F447\U2139\U26A0\U0001F916]' \
  src/features/faqs/ src/pages/FaqsPage.tsx 2>/dev/null || true)

if [[ -z "$EMOJI_FOUND" ]]; then
  ok "Sin emojis residuales en features/faqs"
else
  echo -e "${YELLOW}[WARN]${RESET}  Emojis residuales encontrados (verificar manualmente):"
  echo "$EMOJI_FOUND"
fi

echo ""
echo -e "${GREEN}============================================================${RESET}"
echo -e "${GREEN} fix_faqs.sh completado exitosamente${RESET}"
echo -e "${GREEN}============================================================${RESET}"
echo ""
echo "  Archivos modificados:"
echo "    src/pages/FaqsPage.tsx"
echo "    src/features/faqs/services/chatbotService.ts"
echo "    src/features/faqs/hooks/useChatbot.ts"
echo "    src/features/faqs/components/molecules/ChatInput.tsx"
echo "    src/features/faqs/components/molecules/ChatMessage.tsx"
echo "    src/features/faqs/components/organisms/ChatInterface.tsx"
echo "    src/features/faqs/components/organisms/ImportantDatesWidget.tsx"
echo "    src/features/faqs/components/organisms/AddDateModal.tsx"
if [ -n "$BACKEND_DIR" ]; then
  echo "    $BACKEND_DIR/src/modules/ais/ai.routes.js"
fi
echo ""
echo "  Resumen de cambios funcionales:"
echo "    - IA ahora requiere y envia Firebase ID token (verifyToken OK)"
echo "    - Cada consulta IA descuenta 5 puntos en Firestore"
echo "    - Si puntos < 5, la IA queda bloqueada con mensaje claro"
echo "    - Respuestas IA mas precisas (contexto FAQ enriquecido + limite 250 palabras)"
echo "    - Mobile: solo ChatInterface visible (calendar hidden en mobile)"
echo "    - ChatInterface h-full (sin altura fija), se adapta al viewport"
echo "    - AddDateModal: bottom-sheet en mobile, modal en desktop"
echo "    - Sin emojis, solo icons SVG"
echo "    - Colores: itec-* tokens consistentes (sin gray-*, teal-*, purple-*)"
echo ""
echo "  Ejecuta 'npm run dev' para verificar en el navegador."