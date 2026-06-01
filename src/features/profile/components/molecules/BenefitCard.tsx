import React from "react";
import type { Benefit } from "@features/profile/services/profileService";
import { cn } from "@/lib/utils";

const CAT: Record<string, { border: string; badge: string; icon: string; glow: string }> = {
  medrano: {
    border: "border-itec-sky/20 hover:border-itec-sky/40",
    badge: "bg-itec-sky/10 text-itec-sky",
    icon: "🏙️",
    glow: "from-itec-sky/10",
  },
  campus: {
    border: "border-itec-amber/20 hover:border-itec-amber/40",
    badge: "bg-itec-amber/10 text-itec-amber",
    icon: "🌿",
    glow: "from-itec-amber/10",
  },
  digital: {
    border: "border-itec-purple/20 hover:border-itec-purple/40",
    badge: "bg-itec-purple/10 text-itec-purple",
    icon: "💻",
    glow: "from-itec-purple/10",
  },
};

export const BenefitCard: React.FC<{ benefit: Benefit }> = ({ benefit }) => {
  const cat = CAT[benefit.category] ?? CAT.medrano;
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.5rem] border",
        "bg-gradient-to-br from-itec-box/90 via-itec-box to-itec-box/80 p-4",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.3)]",
        cat.border
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", cat.glow, "to-transparent opacity-0 group-hover:opacity-100 transition-opacity")} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-base overflow-hidden">
          {benefit.logoUrl ? (
            <img src={benefit.logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
          ) : (
            cat.icon
          )}
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-[9px] font-bold tracking-[0.2em]", cat.badge)}>
          {benefit.category.toUpperCase()}
        </span>
      </div>

      <div className="relative mt-4 space-y-1">
        <h4 className="line-clamp-2 text-sm font-bold leading-snug text-itec-text">
          {benefit.title}
        </h4>
        <p className={cn("text-sm font-bold", benefit.category === "medrano" ? "text-itec-sky" : benefit.category === "campus" ? "text-itec-amber" : "text-itec-purple")}>
          {benefit.discount}
        </p>
      </div>

      {benefit.location && benefit.location !== "-" && (
        <p className="relative mt-4 flex items-center gap-2 truncate text-[10px] text-itec-muted">
          <span>📍</span>
          <span className="truncate">{benefit.location}</span>
        </p>
      )}
    </article>
  );
};
