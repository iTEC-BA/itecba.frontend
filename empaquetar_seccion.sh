#!/usr/bin/env bash
# =============================================================================
# setup-faqs.sh — Refactor completo del módulo FAQs + Chat IA para ITEC.BA
# Ejecutar desde la raíz del FRONTEND: bash setup-faqs.sh
# =============================================================================
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${CYAN}→${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  ITEC.BA — FAQs + Chat IA — Setup Script      ${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ── Crear directorios ─────────────────────────────────────────────────────────
info "Creando estructura de carpetas..."
mkdir -p src/features/faqs/{types,services,hooks,components/{atoms,molecules,organisms}}
log "Carpetas creadas"

# =============================================================================
# TIPOS TypeScript
# =============================================================================
info "Escribiendo tipos TypeScript..."
cat > src/features/faqs/types/faqs.ts << 'TYPES_EOF'
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  popularity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQSearchResult extends FAQ {
  score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  isAI?: boolean;
  isLoading?: boolean;
  suggestions?: string[];
  timestamp: number;
}

export interface AIContext {
  _id?: string;
  personality: string;
  institutionalContext: string;
  rules: string[];
  updatedAt?: string;
}

export interface ChatResponse {
  response: string;
  isAI: boolean;
  faqUsed?: FAQ;
  suggestions?: string[];
}

export type ChatMode = "faq" | "ai";
TYPES_EOF
log "Tipos escritos"

# =============================================================================
# SERVICIO: FAQ
# =============================================================================
info "Escribiendo faqService.ts..."
cat > src/features/faqs/services/faqService.ts << 'FAQ_SVC_EOF'
import { auth } from "@lib/firebase";
import type { FAQ, AIContext } from "../types/faqs";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}`;

const getToken = async (): Promise<string | null> => {
  try {
    return (await auth.currentUser?.getIdToken()) ?? null;
  } catch {
    return null;
  }
};

export const faqService = {
  // ── Públicos ─────────────────────────────────────────────────────────────
  getAll: async (): Promise<FAQ[]> => {
    const res = await fetch(`${API}/faqs`);
    if (!res.ok) return [];
    return res.json();
  },

  search: async (query: string): Promise<FAQ[]> => {
    if (!query.trim()) return [];
    const res = await fetch(`${API}/faqs/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return res.json();
  },

  getTop: async (): Promise<FAQ[]> => {
    const res = await fetch(`${API}/faqs/top`);
    if (!res.ok) return [];
    return res.json();
  },

  trackUsage: async (faqId: string): Promise<void> => {
    await fetch(`${API}/faqs/${faqId}/use`, { method: "PATCH" }).catch(() => {});
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  create: async (data: Partial<FAQ>): Promise<FAQ> => {
    const token = await getToken();
    const res = await fetch(`${API}/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear FAQ");
    return res.json();
  },

  update: async (id: string, data: Partial<FAQ>): Promise<FAQ> => {
    const token = await getToken();
    const res = await fetch(`${API}/faqs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar FAQ");
    return res.json();
  },

  remove: async (id: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API}/faqs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al eliminar FAQ");
  },

  // ── Contexto IA ────────────────────────────────────────────────────────────
  getAIContext: async (): Promise<AIContext> => {
    const token = await getToken();
    const res = await fetch(`${API}/ai/context`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return { personality: "", institutionalContext: "", rules: [] };
    return res.json();
  },

  updateAIContext: async (data: Partial<AIContext>): Promise<AIContext> => {
    const token = await getToken();
    const res = await fetch(`${API}/ai/context`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar contexto");
    return res.json();
  },
};
FAQ_SVC_EOF
log "faqService.ts escrito"

# =============================================================================
# SERVICIO: Chatbot
# =============================================================================
info "Escribiendo chatbotService.ts..."
cat > src/features/faqs/services/chatbotService.ts << 'CHAT_SVC_EOF'
import { auth } from "@lib/firebase";
import type { ChatResponse } from "../types/faqs";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}`;

export const AI_COST = 2; // puntos por consulta IA

const getToken = async (): Promise<string> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const chatbotService = {
  // Búsqueda FAQ local (sin IA)
  searchFAQ: async (query: string): Promise<ChatResponse> => {
    const res = await fetch(
      `${API}/faqs/search?q=${encodeURIComponent(query)}`
    );
    const faqs = res.ok ? await res.json() : [];
    if (faqs.length === 0) {
      return {
        response: "No encontré una respuesta exacta para tu consulta. Podés activar la IA avanzada para obtener una respuesta más detallada.",
        isAI: false,
        suggestions: ["¿Cómo me inscribo?", "¿Dónde están los grupos?", "¿Qué es el SIU?"],
      };
    }
    const top = faqs[0];
    // Track de uso en background
    fetch(`${API}/faqs/${top._id}/use`, { method: "PATCH" }).catch(() => {});
    return { response: top.answer, isAI: false, faqUsed: top };
  },

  // Consulta IA avanzada (consume puntos)
  askAI: async (
    message: string,
    history: { role: string; parts: { text: string }[] }[]
  ): Promise<ChatResponse> => {
    const token = await getToken();
    const [chatRes, deductRes] = await Promise.allSettled([
      fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message, history }),
      }),
      fetch(`${API}/ai/deduct-points`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ points: AI_COST }),
      }),
    ]);
    if (chatRes.status === "rejected") throw new Error("Error al conectar con la IA");
    const chatResponse = chatRes.value;
    if (!chatResponse.ok) {
      const err = await chatResponse.json().catch(() => ({}));
      throw new Error((err as any).error || "Error en la IA");
    }
    const data = await chatResponse.json();
    return { response: data.response, isAI: true };
  },

  getUserPoints: async (): Promise<number> => {
    const token = await getToken();
    const res = await fetch(`${API}/users/me/points`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.points ?? 0;
  },
};
CHAT_SVC_EOF
log "chatbotService.ts escrito"

# =============================================================================
# HOOK: useChatbot
# =============================================================================
info "Escribiendo useChatbot.ts..."
cat > src/features/faqs/hooks/useChatbot.ts << 'HOOK_CHAT_EOF'
import { useState, useCallback, useRef } from "react";
import { chatbotService, AI_COST } from "../services/chatbotService";
import { useAuth } from "@context/AuthContext";
import type { ChatMessage, ChatMode } from "../types/faqs";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hola, soy el asistente de ITEC BA. Puedo ayudarte con dudas sobre trámites, inscripciones, grupos, materias y más. También podés activar la IA avanzada para preguntas más complejas.",
  suggestions: [
    "¿Cómo me inscribo a materias?",
    "¿Dónde están los grupos de WhatsApp?",
    "¿Qué es el SIU Guaraní?",
    "¿Cuándo son los finales?",
  ],
  timestamp: Date.now(),
};

export const useChatbot = () => {
  const { user, addPoints } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("faq");
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);

  const canUseAI = (user?.points ?? 0) >= AI_COST;

  const addMsg = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const full: ChatMessage = { ...msg, id: crypto.randomUUID(), timestamp: Date.now() };
    setMessages(p => [...p, full]);
    return full;
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    // Agregar mensaje del usuario
    addMsg({ role: "user", text });
    historyRef.current.push({ role: "user", parts: [{ text }] });

    // Placeholder de carga
    const loadingId = crypto.randomUUID();
    setMessages(p => [...p, { id: loadingId, role: "assistant", text: "", isLoading: true, timestamp: Date.now() }]);
    setLoading(true);

    try {
      let response;
      if (mode === "ai") {
        if (!canUseAI) {
          throw new Error(`Necesitás al menos ${AI_COST} puntos para usar la IA avanzada.`);
        }
        response = await chatbotService.askAI(text, historyRef.current.slice(-10));
        // Descontar puntos localmente
        await addPoints(-AI_COST);
      } else {
        response = await chatbotService.searchFAQ(text);
      }

      historyRef.current.push({ role: "model", parts: [{ text: response.response }] });

      setMessages(p =>
        p.map(m =>
          m.id === loadingId
            ? { ...m, text: response.response, isLoading: false, isAI: response.isAI, suggestions: response.suggestions }
            : m
        )
      );
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
      setMessages(p => p.filter(m => m.id !== loadingId));
    } finally {
      setLoading(false);
    }
  }, [loading, mode, canUseAI, addPoints]);

  const toggleMode = useCallback(() => {
    setMode(p => p === "faq" ? "ai" : "faq");
    setError(null);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([WELCOME]);
    historyRef.current = [];
    setError(null);
  }, []);

  return {
    messages, loading, mode, error, canUseAI,
    userPoints: user?.points ?? 0,
    sendMessage, toggleMode, clearChat,
    AI_COST,
  };
};
HOOK_CHAT_EOF
log "useChatbot.ts escrito"

# =============================================================================
# HOOK: useFAQs
# =============================================================================
info "Escribiendo useFAQs.ts..."
cat > src/features/faqs/hooks/useFAQs.ts << 'HOOK_FAQS_EOF'
import { useState, useEffect, useCallback } from "react";
import { faqService } from "../services/faqService";
import type { FAQ, AIContext } from "../types/faqs";

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [topFaqs, setTopFaqs] = useState<FAQ[]>([]);
  const [aiContext, setAIContext] = useState<AIContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [all, top] = await Promise.all([faqService.getAll(), faqService.getTop()]);
      setFaqs(all);
      setTopFaqs(top);
    } catch {
      setError("Error cargando FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadContext = useCallback(async () => {
    try {
      const ctx = await faqService.getAIContext();
      setAIContext(ctx);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (data: Partial<FAQ>) => {
    const faq = await faqService.create(data);
    setFaqs(p => [faq, ...p]);
    return faq;
  };

  const update = async (id: string, data: Partial<FAQ>) => {
    const updated = await faqService.update(id, data);
    setFaqs(p => p.map(f => f._id === id ? updated : f));
    return updated;
  };

  const remove = async (id: string) => {
    await faqService.remove(id);
    setFaqs(p => p.filter(f => f._id !== id));
  };

  const updateContext = async (data: Partial<AIContext>) => {
    const ctx = await faqService.updateAIContext(data);
    setAIContext(ctx);
    return ctx;
  };

  return { faqs, topFaqs, aiContext, loading, error, load, loadContext, create, update, remove, updateContext };
};
HOOK_FAQS_EOF
log "useFAQs.ts escrito"

# =============================================================================
# ÁTOMO: TypingDots
# =============================================================================
info "Escribiendo átomos..."
cat > src/features/faqs/components/atoms/TypingDots.tsx << 'TYPING_EOF'
import React from "react";
export const TypingDots: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-1">
    {[0,1,2].map(i => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }} />
    ))}
  </span>
);
TYPING_EOF

cat > src/features/faqs/components/atoms/AIBadge.tsx << 'BADGE_EOF'
import React from "react";
interface Props { cost: number; active?: boolean }
export const AIBadge: React.FC<Props> = ({ cost, active = false }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider transition-colors ${
    active
      ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
      : "bg-white/5 border-white/10 text-white/40"
  }`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    IA · {cost} pts
  </span>
);
BADGE_EOF
log "Átomos escritos"

# =============================================================================
# MOLÉCULA: ChatMessage
# =============================================================================
info "Escribiendo ChatMessage.tsx..."
cat > src/features/faqs/components/molecules/ChatMessage.tsx << 'MSG_EOF'
import React from "react";
import ReactMarkdown from "react-markdown";
import { TypingDots } from "../atoms/TypingDots";
import type { ChatMessage as Msg } from "../../types/faqs";

interface Props { msg: Msg }

export const ChatMessage: React.FC<Props> = ({ msg }) => {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-[78%] bg-[#1d4ed8] text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-lg">
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Avatar asistente */}
      <div className="w-8 h-8 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        {msg.isLoading ? (
          <div className="bg-white/[0.06] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
            <TypingDots />
          </div>
        ) : (
          <>
            <div className={`bg-white/[0.06] border rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-white/90 ${
              msg.isAI ? "border-violet-500/20" : "border-white/8"
            }`}>
              {msg.isAI && (
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/8">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">IA Avanzada</span>
                </div>
              )}
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                  li: ({ children }) => <li className="text-white/80">{children}</li>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{children}</a>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>

            {/* Sugerencias */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="text-[11px] text-white/50 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 px-3 py-1 rounded-full transition-all active:scale-95"
                    onClick={() => {
                      const input = document.getElementById("chat-input") as HTMLInputElement;
                      if (input) { input.value = s; input.focus(); }
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
MSG_EOF
log "ChatMessage.tsx escrito"

# =============================================================================
# MOLÉCULA: ChatInput
# =============================================================================
info "Escribiendo ChatInput.tsx..."
cat > src/features/faqs/components/molecules/ChatInput.tsx << 'INPUT_EOF'
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
    <div className="relative flex items-end gap-2 bg-white/[0.06] border border-white/10 rounded-3xl px-4 py-3 focus-within:border-white/20 transition-all shadow-lg">
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
        className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 resize-none outline-none leading-relaxed min-h-[22px] max-h-[120px]"
        disabled={loading}
      />
      <button
        onClick={submit}
        disabled={!value.trim() || loading}
        className="w-8 h-8 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/18 disabled:opacity-30 transition-all active:scale-90 shrink-0"
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
INPUT_EOF
log "ChatInput.tsx escrito"

# =============================================================================
# ORGANISMO: FAQSuggestions (pantalla inicial)
# =============================================================================
info "Escribiendo FAQSuggestions.tsx..."
cat > src/features/faqs/components/organisms/FAQSuggestions.tsx << 'SUGG_EOF'
import React from "react";
import type { FAQ } from "../../types/faqs";

interface Props {
  topFaqs: FAQ[];
  loading: boolean;
  onSelect: (text: string) => void;
}

const STATIC_SUGGESTIONS = [
  { category: "Académico", questions: ["¿Cómo me inscribo a materias?", "¿Cuándo son las fechas de finales?"] },
  { category: "Trámites", questions: ["¿Cómo pido un certificado?", "¿Cómo accedo al SIU Guaraní?"] },
  { category: "Campus", questions: ["¿Dónde están las aulas?", "¿Cómo entro a las aulas virtuales?"] },
];

export const FAQSuggestions: React.FC<Props> = ({ topFaqs, loading, onSelect }) => {
  const suggestions = topFaqs.length > 0
    ? topFaqs.slice(0, 6).map(f => f.question)
    : STATIC_SUGGESTIONS.flatMap(s => s.questions).slice(0, 6);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 pb-4 pt-8 animate-in fade-in duration-300">
      {/* Logo / Avatar IA */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-violet-300">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#111113] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight mb-1">Asistente ITEC</h2>
      <p className="text-sm text-white/40 text-center max-w-xs mb-8">
        Preguntas sobre UTN FRBA, trámites, grupos y más.
      </p>

      {/* Sugerencias */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelect(q)}
              className="group flex items-center gap-3 text-left bg-white/[0.05] hover:bg-white/[0.09] border border-white/8 hover:border-white/15 rounded-2xl px-4 py-3 transition-all active:scale-[0.98] duration-150"
            >
              <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors leading-snug line-clamp-2">{q}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
SUGG_EOF
log "FAQSuggestions.tsx escrito"

# =============================================================================
# ORGANISMO: FAQAdminPanel
# =============================================================================
info "Escribiendo FAQAdminPanel.tsx..."
cat > src/features/faqs/components/organisms/FAQAdminPanel.tsx << 'ADMIN_EOF'
import React, { useState, useEffect } from "react";
import { useFAQs } from "../../hooks/useFAQs";
import type { FAQ, AIContext } from "../../types/faqs";

interface Props { isOpen: boolean; onClose: () => void }

type Tab = "faqs" | "context";

const EMPTY_FAQ: Partial<FAQ> = { question: "", answer: "", keywords: [], category: "general", isActive: true };

export const FAQAdminPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { faqs, aiContext, loading, load, loadContext, create, update, remove, updateContext } = useFAQs();
  const [tab, setTab] = useState<Tab>("faqs");
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [form, setForm] = useState<Partial<FAQ>>(EMPTY_FAQ);
  const [ctxForm, setCtxForm] = useState<Partial<AIContext>>({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) { load(); loadContext(); }
  }, [isOpen]);

  useEffect(() => {
    if (aiContext) setCtxForm({ personality: aiContext.personality, institutionalContext: aiContext.institutionalContext, rules: aiContext.rules });
  }, [aiContext]);

  if (!isOpen) return null;

  const startEdit = (faq: FAQ) => { setEditing(faq); setForm(faq); };
  const cancelEdit = () => { setEditing(null); setForm(EMPTY_FAQ); };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?._id) await update(editing._id, form);
      else await create(form);
      cancelEdit();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("¿Eliminar esta FAQ?")) return;
    await remove(id).catch(e => alert(e.message));
  };

  const handleSaveContext = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await updateContext(ctxForm); }
    catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl outline-none focus:border-white/25 transition-colors placeholder:text-white/25";
  const labelCls = "block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full sm:max-w-3xl bg-[#111113] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] shrink-0">
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Admin</p>
            <h2 className="text-base font-bold text-white mt-0.5">Panel de FAQs</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 shrink-0">
          {(["faqs", "context"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                tab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}>
              {t === "faqs" ? `FAQs (${faqs.length})` : "Contexto IA"}
            </button>
          ))}
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === "faqs" ? (
            <>
              {/* Formulario */}
              <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">{editing ? "Editar FAQ" : "Nueva FAQ"}</h3>
                <form onSubmit={handleSaveFAQ} className="space-y-3">
                  <div>
                    <label className={labelCls}>Pregunta *</label>
                    <input required className={inputCls} placeholder="¿Cómo...?" value={form.question ?? ""} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Respuesta *</label>
                    <textarea required rows={3} className={`${inputCls} resize-none`} placeholder="La respuesta..." value={form.answer ?? ""} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Categoría</label>
                      <input className={inputCls} placeholder="general" value={form.category ?? ""} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelCls}>Keywords (coma)</label>
                      <input className={inputCls} placeholder="inscripcion, siu..." value={(form.keywords ?? []).join(", ")}
                        onChange={e => setForm(p => ({ ...p, keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) }))} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {editing && <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-white/50 hover:text-white transition-colors">Cancelar</button>}
                    <button type="submit" disabled={saving} className="flex-1 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50">
                      {saving ? "Guardando..." : editing ? "Actualizar" : "Agregar FAQ"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Buscador */}
              <input className={`${inputCls} !py-2`} placeholder="Buscar FAQ..." value={search} onChange={e => setSearch(e.target.value)} />

              {/* Lista */}
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(faq => (
                    <div key={faq._id} className="group bg-white/[0.03] border border-white/8 rounded-xl p-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{faq.question}</p>
                        <p className="text-xs text-white/40 truncate mt-0.5">{faq.answer}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">{faq.category}</span>
                          <span className="text-[10px] text-white/30">↑ {faq.popularity ?? 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => startEdit(faq)} className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center hover:bg-blue-500/25 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => handleDeleteFAQ(faq._id)} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <p className="text-center py-8 text-sm text-white/30">No hay FAQs.</p>}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSaveContext} className="space-y-4">
              <div>
                <label className={labelCls}>Personalidad del asistente</label>
                <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Soy el asistente de ITEC BA..."
                  value={ctxForm.personality ?? ""} onChange={e => setCtxForm(p => ({ ...p, personality: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Contexto institucional</label>
                <textarea rows={5} className={`${inputCls} resize-none`} placeholder="UTN FRBA es..."
                  value={ctxForm.institutionalContext ?? ""} onChange={e => setCtxForm(p => ({ ...p, institutionalContext: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Reglas (una por línea)</label>
                <textarea rows={4} className={`${inputCls} resize-none`} placeholder="Responde solo sobre temas de UTN..."
                  value={(ctxForm.rules ?? []).join("\n")} onChange={e => setCtxForm(p => ({ ...p, rules: e.target.value.split("\n").filter(Boolean) }))} />
              </div>
              <button type="submit" disabled={saving} className="w-full py-3 rounded-2xl text-sm font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar contexto"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
ADMIN_EOF
log "FAQAdminPanel.tsx escrito"

# =============================================================================
# ORGANISMO PRINCIPAL: ChatInterface
# =============================================================================
info "Escribiendo ChatInterface.tsx..."
cat > src/features/faqs/components/organisms/ChatInterface.tsx << 'CHAT_EOF'
import React, { useEffect, useRef, useState } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import { useFAQs } from "../../hooks/useFAQs";
import { ChatMessage } from "../molecules/ChatMessage";
import { ChatInput } from "../molecules/ChatInput";
import { FAQSuggestions } from "./FAQSuggestions";
import { FAQAdminPanel } from "./FAQAdminPanel";
import { AIBadge } from "../atoms/AIBadge";
import { useAuth } from "@context/AuthContext";

export const ChatInterface: React.FC = () => {
  const { messages, loading, mode, error, canUseAI, userPoints, sendMessage, toggleMode, clearChat, AI_COST } = useChatbot();
  const { topFaqs, loading: faqsLoading } = useFAQs();
  const { isAdmin } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasConversation = messages.length > 1;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-dvh bg-[#0c0c0e] overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0c0c0e]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-violet-600/40 to-indigo-600/30 border border-white/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-violet-300">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Asistente ITEC</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">En línea</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Puntos */}
          {userPoints > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-300/10 border border-amber-300/20 px-2.5 py-1 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
              {userPoints} pts
            </span>
          )}

          {/* Limpiar chat */}
          {hasConversation && (
            <button onClick={clearChat} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors" title="Nueva conversación">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.87"/></svg>
            </button>
          )}

          {/* Admin */}
          {isAdmin && (
            <button onClick={() => setAdminOpen(true)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors" title="Admin FAQs">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          )}
        </div>
      </header>

      {/* Cuerpo de mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasConversation ? (
          <FAQSuggestions topFaqs={topFaqs} loading={faqsLoading} onSelect={sendMessage} />
        ) : (
          <div className="px-4 py-4 max-w-2xl mx-auto w-full">
            {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
          </div>
        )}
      </div>

      {/* Barra inferior */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#0c0c0e]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] px-4 py-3">
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
              <span className={`w-2 h-2 rounded-full ${mode === "ai" ? "bg-violet-400 animate-pulse" : "bg-white/20"}`} />
              {mode === "ai" ? "IA Activa" : "Activar IA"}
              <AIBadge cost={AI_COST} active={mode === "ai"} />
            </button>
            {!canUseAI && (
              <p className="text-[10px] text-white/25">Necesitás {AI_COST} pts para usar la IA</p>
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
            placeholder={mode === "ai" ? "Preguntale a la IA..." : "Buscá entre las FAQs..."}
          />
        </div>
      </div>

      {/* Modal admin */}
      {isAdmin && <FAQAdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />}
    </div>
  );
};
CHAT_EOF
log "ChatInterface.tsx escrito"

# =============================================================================
# PAGE: FaqsPage.tsx
# =============================================================================
info "Actualizando FaqsPage.tsx..."
cat > src/pages/FaqsPage.tsx << 'PAGE_EOF'
import React from "react";
import { ChatInterface } from "@features/faqs/components/organisms/ChatInterface";
import { usePageTitle } from "@hooks/usePageTitle";

export const FaqsPage: React.FC = () => {
  usePageTitle("Asistente ITEC");
  return <ChatInterface />;
};
PAGE_EOF
log "FaqsPage.tsx actualizado"

# =============================================================================
# BACKEND — Schemas y módulos
# =============================================================================
BACKEND_DIR=""
for d in "../itecba-backend" "../backend" "../../itecba-backend"; do
  if [ -d "$d" ]; then BACKEND_DIR="$d"; break; fi
done

if [ -z "$BACKEND_DIR" ]; then
  warn "Backend no encontrado automáticamente. Generando código backend en ./backend-faqs-output/ para copiar manualmente."
  BACKEND_DIR="./backend-faqs-output"
fi

mkdir -p "${BACKEND_DIR}/modules/faq" "${BACKEND_DIR}/modules/ai"
info "Escribiendo archivos de backend en: ${BACKEND_DIR}"

# ── FAQ Model ──────────────────────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/faq/faq.model.js" << 'MODEL_EOF'
const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer:   { type: String, required: true },
    keywords: [{ type: String, lowercase: true, trim: true }],
    category: { type: String, default: "general", lowercase: true },
    popularity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String },
  },
  { timestamps: true }
);

// Índice de texto para búsqueda
faqSchema.index({ question: "text", answer: "text", keywords: "text" });

module.exports = mongoose.model("FAQ", faqSchema);
MODEL_EOF

# ── AI Context Model ───────────────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/ai/aiContext.model.js" << 'CTX_MODEL_EOF'
const mongoose = require("mongoose");

const aiContextSchema = new mongoose.Schema(
  {
    personality: { type: String, default: "Soy el asistente de ITEC BA, una plataforma estudiantil de la UTN Buenos Aires." },
    institutionalContext: { type: String, default: "UTN FRBA es la Facultad Regional Buenos Aires de la Universidad Tecnológica Nacional." },
    rules: [{ type: String }],
    singleton: { type: Boolean, default: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIContext", aiContextSchema);
CTX_MODEL_EOF

# ── FAQ Service ────────────────────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/faq/faq.service.js" << 'FAQ_SVC_JS_EOF'
const FAQ = require("./faq.model");

const faqService = {
  getAll: () => FAQ.find({ isActive: true }).sort({ popularity: -1, createdAt: -1 }),

  search: async (query) => {
    if (!query?.trim()) return [];
    const q = query.toLowerCase().trim();
    // Búsqueda por texto completo + fallback por keywords
    const byText = await FAQ.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(5);

    if (byText.length > 0) return byText;

    // Fallback: búsqueda parcial
    return FAQ.find({
      isActive: true,
      $or: [
        { question: { $regex: q, $options: "i" } },
        { answer:   { $regex: q, $options: "i" } },
        { keywords: { $in: [new RegExp(q, "i")] } },
      ],
    }).limit(5);
  },

  getTop: () => FAQ.find({ isActive: true }).sort({ popularity: -1 }).limit(8),

  create: (data, createdBy) =>
    FAQ.create({ ...data, keywords: data.keywords?.map(k => k.toLowerCase().trim()) ?? [], createdBy }),

  update: (id, data) =>
    FAQ.findByIdAndUpdate(id, { ...data }, { new: true, runValidators: true }),

  delete: (id) => FAQ.findByIdAndDelete(id),

  incrementPopularity: (id) => FAQ.findByIdAndUpdate(id, { $inc: { popularity: 1 } }),

  getUnanswered: async () => {
    // Placeholder: en producción se guardarían las búsquedas sin respuesta en una colección separada
    return [];
  },
};

module.exports = faqService;
FAQ_SVC_JS_EOF

# ── FAQ Controller ─────────────────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/faq/faq.controller.js" << 'FAQ_CTRL_EOF'
const faqService = require("./faq.service");

const faqController = {
  getAll: async (req, res) => {
    try {
      const faqs = await faqService.getAll();
      res.json(faqs);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  search: async (req, res) => {
    try {
      const results = await faqService.search(req.query.q);
      res.json(results);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  getTop: async (req, res) => {
    try { res.json(await faqService.getTop()); }
    catch (e) { res.status(500).json({ error: e.message }); }
  },

  create: async (req, res) => {
    try {
      const faq = await faqService.create(req.body, req.user?.uid);
      res.status(201).json(faq);
    } catch (e) { res.status(400).json({ error: e.message }); }
  },

  update: async (req, res) => {
    try {
      const faq = await faqService.update(req.params.id, req.body);
      if (!faq) return res.status(404).json({ error: "FAQ no encontrada" });
      res.json(faq);
    } catch (e) { res.status(400).json({ error: e.message }); }
  },

  delete: async (req, res) => {
    try {
      await faqService.delete(req.params.id);
      res.json({ message: "FAQ eliminada" });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  trackUse: async (req, res) => {
    try {
      await faqService.incrementPopularity(req.params.id);
      res.json({ ok: true });
    } catch { res.json({ ok: false }); }
  },
};

module.exports = faqController;
FAQ_CTRL_EOF

# ── FAQ Routes ─────────────────────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/faq/faq.routes.js" << 'FAQ_ROUTES_EOF'
const router = require("express").Router();
const ctrl = require("./faq.controller");
const { verifyFirebaseToken, requireAdmin } = require("../../middleware/auth");

// Públicas
router.get("/",        ctrl.getAll);
router.get("/search",  ctrl.search);
router.get("/top",     ctrl.getTop);
router.patch("/:id/use", ctrl.trackUse);

// Admin
router.post("/",       verifyFirebaseToken, requireAdmin, ctrl.create);
router.patch("/:id",   verifyFirebaseToken, requireAdmin, ctrl.update);
router.delete("/:id",  verifyFirebaseToken, requireAdmin, ctrl.delete);

module.exports = router;
FAQ_ROUTES_EOF

# ── AI Service (refactorizado) ─────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/ai/ai.service.js" << 'AI_SVC_EOF'
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIContext = require("./aiContext.model");
const FAQ = require("../faq/faq.model");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const aiService = {
  getContext: async () => {
    let ctx = await AIContext.findOne({ singleton: true });
    if (!ctx) ctx = await AIContext.create({ singleton: true });
    return ctx;
  },

  updateContext: async (data) => {
    const ctx = await AIContext.findOneAndUpdate(
      { singleton: true },
      { $set: data },
      { new: true, upsert: true }
    );
    return ctx;
  },

  buildSystemPrompt: async () => {
    const ctx = await aiService.getContext();
    const topFaqs = await FAQ.find({ isActive: true }).sort({ popularity: -1 }).limit(15);

    const faqSection = topFaqs.length > 0
      ? `\n\nPREGUNTAS FRECUENTES DE LA PLATAFORMA:\n${topFaqs.map(f => `P: ${f.question}\nR: ${f.answer}`).join("\n\n")}`
      : "";

    const rulesSection = ctx.rules?.length > 0
      ? `\n\nREGLAS:\n${ctx.rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}`
      : "";

    return `${ctx.personality}\n\n${ctx.institutionalContext}${faqSection}${rulesSection}\n\nIMPORTANTE: Respondé ÚNICAMENTE sobre temas relacionados con UTN FRBA, ITEC BA y la plataforma estudiantil. Si la pregunta no está relacionada, explicalo amablemente. No inventes información. Respondé en español.`;
  },

  chat: async (message, history = []) => {
    const systemPrompt = await aiService.buildSystemPrompt();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: history.slice(-8).map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: h.parts || [{ text: h.text || "" }],
      })),
      generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  },
};

module.exports = aiService;
AI_SVC_EOF

# ── AI Controller ──────────────────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/ai/ai.controller.js" << 'AI_CTRL_EOF'
const aiService = require("./ai.service");
const admin = require("firebase-admin");

const aiController = {
  chat: async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      if (!message?.trim()) return res.status(400).json({ error: "Mensaje requerido" });
      const response = await aiService.chat(message, history);
      res.json({ response });
    } catch (e) {
      console.error("[AI] Error:", e.message);
      res.status(500).json({ error: "Error al procesar la consulta", details: e.message });
    }
  },

  deductPoints: async (req, res) => {
    try {
      const { points = 2 } = req.body;
      const uid = req.user?.uid;
      if (!uid) return res.status(401).json({ error: "No autenticado" });

      const db = admin.firestore();
      const userRef = db.collection("users").doc(uid);
      const snap = await userRef.get();
      if (!snap.exists) return res.status(404).json({ error: "Usuario no encontrado" });

      const current = snap.data().points ?? 0;
      if (current < points) return res.status(400).json({ error: "Puntos insuficientes", current });

      await userRef.update({ points: admin.firestore.FieldValue.increment(-points) });
      res.json({ ok: true, newBalance: current - points });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getContext: async (req, res) => {
    try { res.json(await aiService.getContext()); }
    catch (e) { res.status(500).json({ error: e.message }); }
  },

  updateContext: async (req, res) => {
    try { res.json(await aiService.updateContext(req.body)); }
    catch (e) { res.status(400).json({ error: e.message }); }
  },
};

module.exports = aiController;
AI_CTRL_EOF

# ── AI Routes ──────────────────────────────────────────────────────────────────
cat > "${BACKEND_DIR}/modules/ai/ai.routes.js" << 'AI_ROUTES_EOF'
const router = require("express").Router();
const ctrl = require("./ai.controller");
const { verifyFirebaseToken, requireAdmin } = require("../../middleware/auth");

router.post("/chat",          verifyFirebaseToken, ctrl.chat);
router.patch("/deduct-points", verifyFirebaseToken, ctrl.deductPoints);
router.get("/context",        ctrl.getContext);
router.patch("/context",      verifyFirebaseToken, requireAdmin, ctrl.updateContext);

module.exports = router;
AI_ROUTES_EOF

log "Archivos de backend escritos en: ${BACKEND_DIR}"

# =============================================================================
# INSTRUCCIONES PARA REGISTRAR RUTAS EN EL BACKEND
# =============================================================================
cat > "${BACKEND_DIR}/FAQS_SETUP_README.md" << 'README_EOF'
# FAQs Setup — Instrucciones de integración

## 1. Registrar rutas en app.js / index.js

Agregá estas líneas donde registrás las rutas de la API:

```js
const faqRoutes = require("./modules/faq/faq.routes");
const aiRoutes  = require("./modules/ai/ai.routes");

app.use("/api/faqs", faqRoutes);
app.use("/api/ai",   aiRoutes);
```

## 2. Variables de entorno necesarias

```env
GEMINI_API_KEY=tu_api_key_de_google_ai
```

## 3. Instalar dependencias si no están

```bash
npm install @google/generative-ai
```

## 4. Poblar FAQs iniciales (opcional)

Podés usar el panel Admin de ITEC para crear FAQs desde la UI,
o insertar documentos directamente en MongoDB Atlas en la colección `faqs`.

## 5. Endpoints disponibles

- GET    /api/faqs              → Todas las FAQs activas
- GET    /api/faqs/search?q=... → Búsqueda inteligente
- GET    /api/faqs/top          → Las más consultadas
- PATCH  /api/faqs/:id/use      → Incrementar popularidad
- POST   /api/faqs              → Crear FAQ (admin)
- PATCH  /api/faqs/:id          → Editar FAQ (admin)
- DELETE /api/faqs/:id          → Eliminar FAQ (admin)
- POST   /api/ai/chat           → Chat con IA Gemini
- PATCH  /api/ai/deduct-points  → Descontar puntos IA
- GET    /api/ai/context        → Obtener contexto IA
- PATCH  /api/ai/context        → Editar contexto IA (admin)
README_EOF

log "README de integración backend creado"

# =============================================================================
# RESUMEN FINAL
# =============================================================================
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup completado exitosamente!               ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Archivos frontend creados/modificados:${NC}"
echo "  src/features/faqs/types/faqs.ts"
echo "  src/features/faqs/services/faqService.ts"
echo "  src/features/faqs/services/chatbotService.ts"
echo "  src/features/faqs/hooks/useChatbot.ts"
echo "  src/features/faqs/hooks/useFAQs.ts"
echo "  src/features/faqs/components/atoms/TypingDots.tsx"
echo "  src/features/faqs/components/atoms/AIBadge.tsx"
echo "  src/features/faqs/components/molecules/ChatMessage.tsx"
echo "  src/features/faqs/components/molecules/ChatInput.tsx"
echo "  src/features/faqs/components/organisms/FAQSuggestions.tsx"
echo "  src/features/faqs/components/organisms/FAQAdminPanel.tsx"
echo "  src/features/faqs/components/organisms/ChatInterface.tsx"
echo "  src/pages/FaqsPage.tsx"
echo ""
echo -e "${CYAN}Archivos backend creados en: ${BACKEND_DIR}${NC}"
echo "  modules/faq/faq.model.js"
echo "  modules/faq/faq.service.js"
echo "  modules/faq/faq.controller.js"
echo "  modules/faq/faq.routes.js"
echo "  modules/ai/aiContext.model.js"
echo "  modules/ai/ai.service.js"
echo "  modules/ai/ai.controller.js"
echo "  modules/ai/ai.routes.js"
echo "  FAQS_SETUP_README.md"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Revisá ${BACKEND_DIR}/FAQS_SETUP_README.md"
echo "  2. Registrá las rutas en tu app.js del backend"
echo "  3. Asegurate de tener GEMINI_API_KEY en tu .env del backend"
echo "  4. npm run dev para probar"
echo ""