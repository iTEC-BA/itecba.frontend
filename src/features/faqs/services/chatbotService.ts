import { FAQ_DATABASE, FALLBACK_ANSWER } from "../types/faqs";

import type { FAQResponse, ChatMessage } from "../types/faqs";

import { auth, db } from "@lib/firebase";

import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const AI_POINTS_COST = 5;

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const chatbotService = {
  searchFaqAnswer(query: string): FAQResponse {
    const normalizedQuery = normalize(query);

    let bestMatch = null;
    let bestScore = 0;

    for (const faq of FAQ_DATABASE) {
      let score = 0;

      for (const keyword of faq.keywords) {
        const normalizedKeyword = normalize(keyword);

        if (normalizedQuery.includes(normalizedKeyword)) {
          score++;
        }
      }

      if (score > bestScore) {
        bestMatch = faq;
        bestScore = score;
      }
    }

    if (!bestMatch) {
      return {
        text: FALLBACK_ANSWER,
        suggestions: [
          "¿Cómo entro a SIGA?",
          "¿Dónde están los grupos?",
          "¿Cómo veo apuntes?",
        ],
      };
    }

    return {
      text: bestMatch.answer,
      suggestions: ["Más información", "Otra consulta"],
    };
  },

  async askAdvancedAI(
    query: string,
    rawHistory: ChatMessage[],
  ): Promise<string> {
    try {
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        return "Necesitás iniciar sesión.";
      }

      const history = rawHistory.slice(-10).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error("API Error");
      }

      const data = await response.json();

      return data.response || "No pude responder eso.";
    } catch (err) {
      console.error(err);

      return "⚠️ Error conectando con la IA.";
    }
  },

  async getUserPoints(uid: string) {
    const snap = await getDoc(doc(db, "users", uid));

    return snap.exists() ? (snap.data().points ?? 0) : 0;
  },

  async deductAIPoints(uid: string) {
    const current = await chatbotService.getUserPoints(uid);

    if (current < AI_POINTS_COST) {
      return false;
    }

    await updateDoc(doc(db, "users", uid), {
      points: increment(-AI_POINTS_COST),
    });

    return true;
  },
};
