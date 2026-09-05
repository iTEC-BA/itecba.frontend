import React from "react";
import type { FAQ } from "../../types/faqs";

interface Props {
  topFaqs: FAQ[];
  loading: boolean;
  onSelect: (text: string) => void;
}

export const FAQSuggestions: React.FC<Props> = ({ topFaqs, loading, onSelect }) => {
  // Top 4 por popularidad (ranking de la DB) — sin preguntas hardcodeadas
  const suggestions = topFaqs.slice(0, 4).map(f => f.question);
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 pb-4 pt-8 animate-in fade-in duration-300">
      {/* Logo / Avatar IA */}
      <div className="relative mb-8">
        <div className="relative w-30 h-30 rounded-xl flex items-center justify-center">
          <img src="mascot/TEC-Notebook.webp" alt="" className="absolute inset-0 z-10 w-full h-full object-contain"/>
        </div>
        <div className="absolute z-20 -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#111113] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
      </div>

      <h2 className="text-xl font-bold text-white tracking-tight mb-1">Asistente ITEC</h2>
      <p className="text-sm text-white/40 text-center max-w-xs mb-8">
        Preguntas sobre UTN FRBA, trámites, grupos y más.
      </p>

      {/* Sugerencias */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelect(q)}
              className="group flex items-center gap-3 text-left bg-white/[0.05] hover:bg-white/[0.09] border border-white/8 hover:border-white/15 rounded-xl px-4 py-3 transition-all active:scale-[0.98] duration-150"
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
      ) : null}
    </div>
  );
};
