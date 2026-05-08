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
