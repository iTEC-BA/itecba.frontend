import { useState } from "react";

import type { ChatMessage } from "../types/faqs";

import { chatbotService } from "../services/chatbotService";

import { auth } from "@lib/firebase";

export const useChatbot = () => {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "👋 Hola, soy Meta ITEC AI.\n\n¿En qué puedo ayudarte?",
      suggestions: [
        "¿Cómo entro a SIGA?",
        "¿Dónde veo grupos?",
        "¿Hay apuntes?",
      ],
    },
  ]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const faq = chatbotService.searchFaqAnswer(text);

      const shouldUseAI = faq.text.includes("IA avanzada");

      if (!shouldUseAI) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: faq.text,
            suggestions: faq.suggestions,
          },
        ]);

        setLoading(false);
        return;
      }

      const uid = auth.currentUser?.uid;

      if (!uid) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: "Necesitás iniciar sesión.",
          },
        ]);

        setLoading(false);
        return;
      }

      const success = await chatbotService.deductAIPoints(uid);

      if (!success) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: "⚠️ No tenés suficientes puntos.",
          },
        ]);

        setLoading(false);
        return;
      }

      const ai = await chatbotService.askAdvancedAI(text, messages);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: ai,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    messages,
    sendMessage,
  };
};
