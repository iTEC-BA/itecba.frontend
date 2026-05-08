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
