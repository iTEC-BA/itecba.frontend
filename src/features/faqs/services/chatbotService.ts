import { auth } from "@lib/firebase";
import type { ChatResponse } from "../types/faqs";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}`;

/** Costo base por defecto (se sobreescribe con el valor de la DB) */
export const AI_COST_DEFAULT = 2;

const getToken = async (): Promise<string> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const chatbotService = {
  /** Obtiene el costo de IA configurado por el admin */
  getAICost: async (): Promise<number> => {
    try {
      const res = await fetch(`${API}/ai/context`);
      if (!res.ok) return AI_COST_DEFAULT;
      const ctx = await res.json();
      return typeof ctx.aiCost === "number" ? ctx.aiCost : AI_COST_DEFAULT;
    } catch {
      return AI_COST_DEFAULT;
    }
  },

  /** Búsqueda FAQ local (modo gratis) */
  searchFAQ: async (query: string): Promise<ChatResponse> => {
    const res = await fetch(
      `${API}/faqs/search?q=${encodeURIComponent(query)}`
    );
    const faqs = res.ok ? await res.json() : [];
    if (faqs.length === 0) {
      return {
        response:
          "No encontré una respuesta exacta. Podés activar la **IA avanzada** para una respuesta más detallada, o reformular tu pregunta.",
        isAI: false,
        suggestions: [
          "¿Cómo me inscribo a materias?",
          "¿Dónde están los grupos?",
          "¿Qué es el SIU Guaraní?",
        ],
      };
    }
    const top = faqs[0];
    // Track en background (sin bloquear)
    fetch(`${API}/faqs/${top._id}/use`, { method: "PATCH" }).catch(() => {});
    return { response: top.answer, isAI: false, faqUsed: top };
  },

  /** Consulta IA avanzada — consume puntos */
  askAI: async (
    message: string,
    history: { role: string; parts: { text: string }[] }[]
  ): Promise<ChatResponse> => {
    const token = await getToken();
    // Enviamos chat y deducción en paralelo para minimizar latencia
    const [chatRes] = await Promise.allSettled([
      fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, history }),
      }),
      fetch(`${API}/ai/deduct-points`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // el backend usa el costo de la DB
      }),
    ]);

    if (chatRes.status === "rejected")
      throw new Error("Error al conectar con la IA");

    const chatResponse = chatRes.value;
    if (!chatResponse.ok) {
      const err = await chatResponse.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || "Error en la IA");
    }
    const data = await chatResponse.json();
    return { response: data.response, isAI: true };
  },
};
