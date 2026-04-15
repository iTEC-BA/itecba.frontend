import { FAQ_DATABASE, FALLBACK_ANSWER } from '../types/faqs';
import type { Message } from '../components/organisms/ChatInterface';

const normalizeText = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,]/g, "").trim();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'; 

export const chatbotService = {
  
  // 🟢 AHORA DEVUELVE UN OBJETO CON TEXTO Y SUGERENCIAS
  searchFaqAnswer: (query: string): { text: string, suggestions?: string[] } => {
    const cleanQuery = normalizeText(query);
    const queryWords = cleanQuery.split(' ');

    if (['hola', 'buenas', 'holis', 'que tal', 'saludos'].includes(cleanQuery)) {
      return { text: "¡Hola! ¿En qué te puedo ayudar hoy? Podes escribirme tu consulta o elegir una de las opciones rápidas." };
    }

    let bestMatch = null;
    let maxScore = 0;

    // Búsqueda Exacta
    for (const faq of FAQ_DATABASE) {
      let score = 0;
      for (const kw of faq.keywords) {
        const cleanKw = normalizeText(kw);
        if (cleanKw.includes(' ')) {
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

    // 🟢 SI FALLA: Búsqueda de Coincidencias Parciales
    const looseWords = queryWords.filter(w => w.length >= 4); // Palabras clave largas
    let relatedSuggestions: string[] = [];

    if (looseWords.length > 0) {
      const relatedFaqs = FAQ_DATABASE.filter(faq =>
        looseWords.some(lw =>
          normalizeText(faq.answer).includes(lw) || faq.keywords.some(kw => normalizeText(kw).includes(lw))
        )
      );

      // Convertimos las keywords encontradas en botones de pregunta
      relatedSuggestions = relatedFaqs.slice(0, 3).map(faq => {
          const keyword = faq.keywords[0];
          return `¿Información sobre ${keyword}?`;
      });
    }

    // Si no encontró nada ni parcialmente, damos 3 por defecto
    if (relatedSuggestions.length === 0) {
      relatedSuggestions = ["¿Trámites de Bedelía?", "¿Fechas de exámenes?", "¿Grupos de WhatsApp?"];
    }

    return {
      text: "No encontré una respuesta exacta en mi base rápida para eso. ¿Quizás te referías a alguna de estas opciones? 👇\n\n*(Tip: También podés usar el botón **✨ Buscar con IA Avanzada** para analizar tu pregunta a fondo).* ",
      suggestions: relatedSuggestions
    };
  },

  askAdvancedAI: async (query: string, rawHistory: Message[]): Promise<string> => {
    try {
      const formattedHistory = rawHistory.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user', 
        parts: [{ text: msg.text }]
      }));

      const cleanQuery = normalizeText(query);
      const queryWords = cleanQuery.split(' ');

      const scoredFaqs = FAQ_DATABASE.map(faq => {
        let score = 0;
        for (const kw of faq.keywords) {
          const cleanKw = normalizeText(kw);
          if (cleanKw.includes(' ')) {
            if (cleanQuery.includes(cleanKw)) score += 3;
          } else {
            if (queryWords.includes(cleanKw)) score += 1;
          }
        }
        return { ...faq, score };
      });

      const top5Faqs = scoredFaqs.sort((a, b) => b.score - a.score).slice(0, 5);
      const faqContextString = top5Faqs.map(faq => `- Tema: ${faq.keywords.join(", ")} | Respuesta Oficial: ${faq.answer}`).join("\n");
      
      const hiddenContextQuery = `
[CONTEXTO OFICIAL FILTRADO DE ITEC]:
${faqContextString}

[INSTRUCCIÓN AL MODELO]: Basándote en el contexto oficial de arriba y en tu conocimiento como ITEC Bot, responde de forma natural a la siguiente consulta del alumno. Si la respuesta no está clara en el contexto, guíalo con tus conocimientos generales sobre la UTN.

Consulta del Alumno: "${query}"
      `;

      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: hiddenContextQuery, history: formattedHistory })
      });

      if (!response.ok) throw new Error(`Error en servidor: ${response.statusText}`);

      const data = await response.json();
      return data.response; 

    } catch (error) {
      console.error("❌ Error comunicándose con la IA:", error);
      return "⚠️ Lo siento, no me pude conectar con el cerebro principal. Intenta de nuevo más tarde.";
    }
  },

canUseAI: (userEmail: string): boolean => {
    const lastUsed = localStorage.getItem(`itec_ai_last_${userEmail}`);
    if (!lastUsed) return true;
    const diff = Date.now() - parseInt(lastUsed, 10);
    
    // 🟢 CAMBIO AQUÍ: 1 hora = 60 mins * 60 segs * 1000 ms
    return diff > 60 * 60 * 1000; 
  },

  markAIUsed: (userEmail: string) => {
    localStorage.setItem(`itec_ai_last_${userEmail}`, Date.now().toString());
  },

  getTimeLeftToUseAI: (userEmail: string): string | null => {
    const lastUsed = localStorage.getItem(`itec_ai_last_${userEmail}`);
    if (!lastUsed) return null;
    const diff = Date.now() - parseInt(lastUsed, 10);
    
    // 🟢 CAMBIO AQUÍ: Restamos desde 1 hora (60 * 60 * 1000)
    const remaining = (60 * 60 * 1000) - diff;
    if (remaining <= 0) return null;
    
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    // Como ahora es máximo 1 hora, mostramos solo los minutos para que quede más limpio
    return `${minutes}m`; 
  }
};