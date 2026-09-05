import React from "react";
import { MapPin, Ticket, Tag, ArrowRight, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Benefit } from "@features/benefits/types/benefits";
import { CATEGORY_CONFIG, isFreeBenefit } from "@features/benefits/types/benefits";

interface Props {
  benefit: Benefit;
  userPoints: number;
  onSelect: (b: Benefit) => void;
}

const ACCENT_MAP: Record<string, string> = {
  medrano: "bg-itec-sky",
  campus: "bg-itec-emerald",
  digital: "bg-itec-purple"
};

export const BenefitCard: React.FC<Props> = ({ benefit, userPoints, onSelect }) => {
  const free = isFreeBenefit(benefit);
  const canAfford = free || userPoints >= benefit.pointsCost;
  const cat = CATEGORY_CONFIG[benefit.category] ?? CATEGORY_CONFIG.medrano;
  const accentBg = ACCENT_MAP[benefit.category] || "bg-itec-muted";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-itec-rewards/25 border-dashed bg-itec-box transition-colors hover:bg-itec-rewards/25">
      {/* Línea de acento superior */}
      <div className={cn("absolute left-0 top-0 h-1 w-full", accentBg)} />

      <div className="flex flex-1 flex-col p-5">
        {/* Cabecera: Logo + Badge de Costo */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2">
            {benefit.img ? (
              <img src={benefit.img} alt="logo" className="h-full w-full object-contain" />
            ) : (
              <Tag className="h-6 w-6 text-itec-rewards" />
            )}
          </div>
          {free ? (
            <span className="flex items-center gap-1.5 rounded-lg border border-itec-emerald/20 bg-itec-emerald/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-itec-emerald">
              <Gift className="h-3 w-3" /> Gratis
            </span>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                canAfford
                  ? "border-itec-amber/20 bg-itec-amber/10 text-itec-amber"
                  : "border-white/10 bg-white/5 text-white/40"
              )}
            >
              <Ticket className="h-3 w-3" /> {benefit.pointsCost} pts
            </span>
          )}
        </div>

        {/* Cuerpo: Categoría, Título, Descuento, Descripción */}
        <div className="flex flex-1 flex-col gap-1">
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", cat.color)}>
            {cat.label}
          </span>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-white">
            {benefit.title}
          </h3>

          {benefit.discount && (
            <p className="mb-1 mt-2 text-3xl font-black tracking-tight text-white">
              {benefit.discount}
            </p>
          )}

          {benefit.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
              {benefit.description}
            </p>
          )}
        </div>
      </div>

      {/* Pie: Ubicación y Botón (Separados por línea punteada tipo ticket) */}
      <div className="mt-auto px-5 pb-5 pt-0">
        <div className="flex flex-col gap-4 border-t border-dashed border-white/10 pt-4">
          {benefit.location && benefit.location !== "-" && (
            <p className="flex items-center gap-1.5 truncate text-[11px] font-medium text-white/40">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{benefit.location}</span>
            </p>
          )}
          <button
            onClick={() => canAfford && onSelect(benefit)}
            disabled={!canAfford}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all cursor-pointer",
              free
                ? "bg-itec-rewards/10 text-white hover:bg-white/20 border border-transparent"
                : canAfford
                ? "bg-itec-rewards/10 text-white hover:bg-white/20 border border-transparent"
                : "cursor-not-allowed border border-white/10 bg-transparent text-white/30"
            )}
          >
            {free ? "Ver instrucciones" : canAfford ? "Canjear recompensa" : "Puntos insuficientes"}
            {(free || canAfford) && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
};
