import React from "react";
import { useProfileBenefits } from "@features/profile/hooks/useProfileBenefits";
import { BenefitCard } from "@features/profile/components/molecules/BenefitCard";
import { cn } from "@/lib/utils";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { Button } from "@components/ui/Button";

type Tab = {
  id: "medrano" | "campus" | "digital";
  label: string;
  emoji: string;
  color: string;
  active: string;
};

const TABS: Tab[] = [
  { id: "medrano", label: "Medrano", emoji: "🏙️", color: "text-itec-muted hover:text-itec-sky", active: "bg-itec-sky/10 text-itec-sky border-itec-sky/25" },
  { id: "campus", label: "Campus", emoji: "🌿", color: "text-itec-muted hover:text-itec-amber", active: "bg-itec-amber/10 text-itec-amber border-itec-amber/25" },
  { id: "digital", label: "Digital", emoji: "💻", color: "text-itec-muted hover:text-itec-purple", active: "bg-itec-purple/10 text-itec-purple border-itec-purple/25" },
];

export const BenefitsGrid: React.FC = () => {
  const { benefits, loading, error, activeTab, setActiveTab, refetch } = useProfileBenefits();

  return (
    <GlassCard className="p-5 sm:p-6 lg:p-7" variant="elevated" glow="sky">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-itec-muted">Beneficios TarjeTEC</h2>
          <p className="mt-1 text-sm text-itec-muted">Descuentos exclusivos para estudiantes UTN.</p>
        </div>
        <Button variant="secondary" hierarchy="outline" icon="↻" onClick={refetch}>
          Actualizar
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all",
              activeTab === tab.id
                ? tab.active
                : "border-itec-border bg-itec-surface/70 text-itec-muted hover:bg-itec-box2 hover:text-itec-text"
            )}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-itec-accent/20 bg-itec-accent/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-[1.5rem] border border-itec-border bg-itec-surface/60" />
          ))}
        </div>
      ) : benefits.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-itec-border bg-itec-surface/40 p-8 text-center">
          <p className="text-sm font-bold text-itec-text">No hay beneficios para esta categoría.</p>
          <p className="mt-1 text-xs text-itec-muted">Probá otra pestaña o recargá la sección.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit._id} benefit={benefit} />
          ))}
        </div>
      )}
    </GlassCard>
  );
};
