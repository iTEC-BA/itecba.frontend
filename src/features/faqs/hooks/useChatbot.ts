import { useState, useEffect } from 'react';
import { chatbotService } from '../services/chatbotService';
import { ITEC_FOOTER } from '../types/faqs';
import type { Message } from '../components/organisms/ChatInterface'; 

const WELCOME_MESSAGE: Message = { 
  role: 'model', 
  text: '¡Hola! Soy **ITEC Bot**.\n\nEstoy aquí para resolver tus dudas rápidas sobre la UTN BA. Selecciona una opción o escríbeme tu consulta abajo.',
  timestamp: new Date()
};

export const useChatbot = (userEmail: string) => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [canUseAI, setCanUseAI] = useState(true);
  const [timeLeftAI, setTimeLeftAI] = useState<string | null>(null);

  const checkAILimits = () => {
    setCanUseAI(chatbotService.canUseAI(userEmail));
    setTimeLeftAI(chatbotService.getTimeLeftToUseAI(userEmail));
  };

  useEffect(() => {
    checkAILimits();
    const interval = setInterval(checkAILimits, 60000); 
    return () => clearInterval(interval);
  }, [userEmail]);

  const handleSendMessage = async (text: string, forceAI: boolean = false) => {
    if (!text.trim()) return;

    if (text.toLowerCase().trim() === "reset ai") {
      localStorage.removeItem(`itec_ai_last_${userEmail}`);
      checkAILimits();
      setMessages(prev => [...prev, { role: 'model', text: "✅ Truco dev activado: Has reseteado tu límite de IA.", timestamp: new Date() }]);
      return;
    }
    
    setMessages(prev => [...prev, { role: 'user', text, timestamp: new Date() }]);
    setIsTyping(true);

    if (forceAI && canUseAI) {
      const aiResponse = await chatbotService.askAdvancedAI(text, messages);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse, timestamp: new Date(), isAiGenerated: true }]);
      
      if (!aiResponse.includes("⚠️")) {
        chatbotService.markAIUsed(userEmail);
        checkAILimits(); 
      }
    } else {
      setTimeout(() => {
        const isGreeting = ['hola', 'buenas', 'holis'].includes(text.toLowerCase().trim());
        
        // 🟢 RECIBIMOS TEXTO Y SUGERENCIAS DEL SERVICIO
        const responseData = chatbotService.searchFaqAnswer(text);
        const finalAnswer = responseData.text + (isGreeting ? '' : '\n\n' + ITEC_FOOTER);
        
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: finalAnswer, 
          timestamp: new Date(),
          suggestions: responseData.suggestions // Guardamos los botones
        }]);
      }, Math.floor(Math.random() * 500) + 500);
    }
    
    setIsTyping(false);
  };

  const clearChat = () => {
    if (window.confirm("¿Deseas limpiar el historial de esta conversación?")) {
      setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    }
  };

  return { messages, isTyping, canUseAI, timeLeftAI, handleSendMessage, clearChat };
};