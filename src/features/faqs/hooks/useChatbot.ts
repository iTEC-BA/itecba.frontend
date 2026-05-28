import { useState, useCallback, useRef, useEffect } from "react";
import { chatbotService, AI_COST_DEFAULT } from "../services/chatbotService";
import { faqService } from "../services/faqService";
import { useAuth } from "@context/AuthContext";
import type { ChatMessage, ChatMode } from "../types/faqs";

const makeWelcome = (suggestions: string[] = []): ChatMessage => ({
  id: "welcome",
  role: "assistant",
  text: "Hola, soy el asistente de **ITEC BA**. Puedo ayudarte con dudas sobre trámites, inscripciones, grupos, materias y más.\n\nTambién podés activar la **IA avanzada** para preguntas más complejas.",
  suggestions,
  timestamp: Date.now(),
});

export const useChatbot = () => {
  const { user, addPoints } = useAuth();
  const [messages, setMessages]   = useState<ChatMessage[]>([makeWelcome()]);
  const [loading, setLoading]     = useState(false);
  const [mode, setMode]           = useState<ChatMode>("faq");
  const [error, setError]         = useState<string | null>(null);
  const [AI_COST, setAICost]      = useState<number>(AI_COST_DEFAULT);
  const historyRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);

  // Cargar costo de IA y top 4 FAQs para el mensaje de bienvenida
  useEffect(() => {
    chatbotService.getAICost()
      .then(cost => setAICost(cost))
      .catch(() => setAICost(AI_COST_DEFAULT));

    faqService.getTop()
      .then(faqs => {
        const top4 = faqs.slice(0, 4).map(f => f.question);
        if (top4.length > 0) {
          setMessages([makeWelcome(top4)]);
        }
      })
      .catch(() => {/* Silencioso — welcome sin sugerencias */});
  }, []);

  const canUseAI = (user?.points ?? 0) >= AI_COST;

  const addMsg = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const full: ChatMessage = { ...msg, id: crypto.randomUUID(), timestamp: Date.now() };
    setMessages(p => [...p, full]);
    return full;
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    addMsg({ role: "user", text });
    historyRef.current.push({ role: "user", parts: [{ text }] });

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
        addPoints(-AI_COST);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      setMessages(p => p.filter(m => m.id !== loadingId));
    } finally {
      setLoading(false);
    }
  }, [loading, mode, canUseAI, addPoints, AI_COST]);

  const toggleMode = useCallback(() => {
    setMode(p => p === "faq" ? "ai" : "faq");
    setError(null);
  }, []);

  const clearChat = useCallback(() => {
    // Al limpiar, re-fetch las top 4 para el nuevo welcome
    faqService.getTop()
      .then(faqs => {
        const top4 = faqs.slice(0, 4).map(f => f.question);
        setMessages([makeWelcome(top4)]);
      })
      .catch(() => setMessages([makeWelcome()]));
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
