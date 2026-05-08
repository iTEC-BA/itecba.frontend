export interface FAQ {
  keywords: string[];
  answer: string;
}

export interface FAQResponse {
  text: string;
  suggestions?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestions?: string[];
  isTyping?: boolean;
}

export const FAQ_DATABASE: FAQ[] = [
  {
    keywords: ["apuntes", "parciales", "resumen"],
    answer: "📚 Podés encontrar apuntes y parciales en la sección Recursos.",
  },

  {
    keywords: ["grupos", "whatsapp"],
    answer: "👥 Los grupos de WhatsApp están disponibles en la sección Grupos.",
  },

  {
    keywords: ["siga"],
    answer:
      "🧾 El sistema SIGA sirve para inscripciones, notas y certificados.\n\nhttps://siga.frba.utn.edu.ar/",
  },

  {
    keywords: ["campus", "aula virtual"],
    answer: "💻 Aula Virtual:\nhttps://aulavirtual.frba.utn.edu.ar/",
  },

  {
    keywords: ["medrano", "lugano"],
    answer: "🏫 UTN FRBA tiene sede Medrano y Campus Lugano.",
  },
];

export const FALLBACK_ANSWER =
  "No encontré una respuesta exacta 😅\n\nPodés usar la IA avanzada.";
