import React from "react";
import type { FAQ } from "../../types/faqs";
import Raccoon from "@/components/ui/icons/Raccoon";

interface Props {
  topFaqs: FAQ[];
  loading: boolean;
  onSelect: (text: string) => void;
}

const STATIC_SUGGESTIONS = [
  { category: "Académico", questions: ["¿Cómo me inscribo a materias?", "¿Cuándo son las fechas de finales?"] },
  { category: "Trámites", questions: ["¿Cómo pido un certificado?", "¿Cómo accedo al SIU Guaraní?"] },
  { category: "Campus", questions: ["¿Dónde están las aulas?", "¿Cómo entro a las aulas virtuales?"] },
];

export const FAQSuggestions: React.FC<Props> = ({ topFaqs, loading, onSelect }) => {
  const suggestions = topFaqs.length > 0
    ? topFaqs.slice(0, 6).map(f => f.question)
    : STATIC_SUGGESTIONS.flatMap(s => s.questions).slice(0, 6);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 pb-4 pt-8 animate-in fade-in duration-300">
      {/* Logo / Avatar IA */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          <Raccoon size={96} fill1="#888888" fill2="#ffffff" fill3="#0C1014" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#111113] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight mb-1">Asistente ITEC</h2>
      <p className="text-sm text-white/40 text-center max-w-xs mb-8">
        Preguntas sobre UTN FRBA, trámites, grupos y más.
      </p>

      {/* Sugerencias */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelect(q)}
              className="group flex items-center gap-3 text-left bg-white/[0.05] hover:bg-white/[0.09] border border-white/8 hover:border-white/15 rounded-2xl px-4 py-3 transition-all active:scale-[0.98] duration-150"
            >
              <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors leading-snug line-clamp-2">{q}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
