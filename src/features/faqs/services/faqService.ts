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

  // ── Admin — FAQs ──────────────────────────────────────────────────────────
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

  // ── Admin — Contexto IA ───────────────────────────────────────────────────
  getAIContext: async (): Promise<AIContext> => {
    const res = await fetch(`${API}/ai/context`);
    if (!res.ok) return { personality: "", institutionalContext: "", rules: [], aiCost: 2 };
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

  /** Limpia el cache del system prompt (aplica cambios inmediatamente) */
  clearPromptCache: async (): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API}/ai/clear-cache`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al limpiar el cache");
  },

  // ── Admin — Créditos (puntos) de usuarios ─────────────────────────────────
  searchUserByEmail: async (email: string): Promise<{ uid: string; email: string; points: number } | null> => {
    const token = await getToken();
    const res = await fetch(`${API}/users/search?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  },

  updateUserPoints: async (uid: string, points: number): Promise<{ points: number }> => {
    const token = await getToken();
    const res = await fetch(`${API}/users/${uid}/points`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ points }),
    });
    if (!res.ok) throw new Error("Error al actualizar puntos");
    return res.json();
  },
};
