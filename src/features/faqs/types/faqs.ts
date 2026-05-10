export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: string;
  popularity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQSearchResult extends FAQ {
  score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  isAI?: boolean;
  isLoading?: boolean;
  suggestions?: string[];
  timestamp: number;
}

export interface AIContext {
  _id?: string;
  personality: string;
  institutionalContext: string;
  rules: string[];
  /** Costo en puntos por consulta IA avanzada (configurable desde el admin) */
  aiCost?: number;
  updatedAt?: string;
}

export interface ChatResponse {
  response: string;
  isAI: boolean;
  faqUsed?: FAQ;
  suggestions?: string[];
}

export type ChatMode = "faq" | "ai";
