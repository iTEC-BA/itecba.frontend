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
