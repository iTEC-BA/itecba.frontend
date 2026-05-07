import React from "react";
import type { Benefit } from "@features/profile/services/profileService";
import { cn } from "@/lib/utils";
const CAT: Record<string, { border: string; badge: string; icon: string }> = {
  medrano: { border: "border-itec-sky/20 hover:border-itec-sky/40",   badge: "bg-itec-sky/10 text-itec-sky",     icon: "🏙️" },
  campus:  { border: "border-itec-amber/20 hover:border-itec-amber/40", badge: "bg-itec-amber/10 text-itec-amber",  icon: "🌿" },
  digital: { border: "border-itec-purple/20 hover:border-itec-purple/40", badge: "bg-itec-purple/10 text-itec-purple", icon: "💻" },
};
export const BenefitCard: React.FC<{ benefit: Benefit }> = ({ benefit }) => {
  const cat = CAT[benefit.category] ?? CAT.medrano;
  return (
    <div className={cn(
      "relative group rounded-2xl p-4 flex flex-col gap-3",
      "bg-itec-box border transition-all duration-200",
      "hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
      cat.border
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0",
          "bg-itec-surface border border-itec-border"
        )}>
          {benefit.logoUrl ? (
            <img src={benefit.logoUrl} alt="" className="w-full h-full object-contain rounded-xl" />
          ) : (
            cat.icon
          )}
        </div>
        <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-lg shrink-0 mt-0.5", cat.badge)}>
          {benefit.category.toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-itec-text font-bold text-sm leading-snug line-clamp-2">
          {benefit.title}
        </p>
        <p className={cn("text-xs font-black mt-1", benefit.category === "medrano" ? "text-itec-sky" : benefit.category === "campus" ? "text-itec-amber" : "text-itec-purple")}>
          {benefit.discount}
        </p>
      </div>
      {benefit.location && benefit.location !== "-" && (
        <p className="text-[10px] text-itec-muted flex items-center gap-1 truncate">
          <span>📍</span>
          <span className="truncate">{benefit.location}</span>
        </p>
      )}
    </div>
  );
};
