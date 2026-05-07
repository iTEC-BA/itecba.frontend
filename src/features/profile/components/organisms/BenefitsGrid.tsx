import React from "react";
import { useProfileBenefits } from "@features/profile/hooks/useProfileBenefits";
import { BenefitCard } from "@features/profile/components/molecules/BenefitCard";
import { cn } from "@/lib/utils";
type Tab = { id: "medrano" | "campus" | "digital"; label: string; emoji: string; color: string; active: string };
const TABS: Tab[] = [
  { id: "medrano", label: "Medrano",  emoji: "🏙️", color: "text-itec-muted hover:text-itec-sky",    active: "bg-itec-sky/10 text-itec-sky border-itec-sky/25"    },
  { id: "campus",  label: "Campus",   emoji: "🌿", color: "text-itec-muted hover:text-itec-amber",  active: "bg-itec-amber/10 text-itec-amber border-itec-amber/25" },
  { id: "digital", label: "Digital",  emoji: "💻", color: "text-itec-muted hover:text-itec-purple", active: "bg-itec-purple/10 text-itec-purple border-itec-purple/25" },
];
export const BenefitsGrid: React.FC = () => {
  const { benefits, loading, error, activeTab, setActiveTab, refetch } = useProfileBenefits();
  return (
    <div className="bg-itec-box/80 backdrop-blur-md border border-white/8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-itec-border">
        <div>
          <h2 className="text-sm font-black text-itec-text">Beneficios TarjeTEC</h2>
          <p className="text-[10px] text-itec-muted mt-0.5">Descuentos exclusivos para estudiantes UTN</p>
        </div>
        <button
          onClick={refetch}
          aria-label="Actualizar"
          className="w-7 h-7 flex items-center justify-center rounded-xl text-itec-muted hover:text-itec-text hover:bg-itec-surface transition-all text-sm"
        >
          🔄
        </button>
      </div>
      <div className="flex gap-1 p-3 border-b border-itec-border bg-itec-sidebar/50">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                "border",
                isActive ? tab.active : cn("border-transparent", tab.color)
              )}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-itec-surface/50 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-itec-accent text-sm font-bold mb-2">⚠️ Error al cargar beneficios</p>
            <p className="text-itec-muted text-xs mb-4">{error}</p>
            <button onClick={refetch} className="text-xs text-itec-sky hover:underline font-bold">
              Reintentar
            </button>
          </div>
        ) : benefits.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🎁</p>
            <p className="text-itec-muted text-sm font-bold">Sin beneficios en esta categoría</p>
            <p className="text-itec-muted text-xs mt-1">Próximamente se agregarán más descuentos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {benefits.map((b) => (
              <BenefitCard key={b._id} benefit={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
