import React from "react";
import { Sun, Sunset, Moon, Sparkles } from "lucide-react";
import type { TurnoDeseado } from "../../types/trueketec.types";

interface Props { turno: TurnoDeseado; size?: "sm" | "md"; }

const CONFIG: Record<string, { icon: React.ElementType; cls: string; label: string }> = {
  "Mañana":     { icon: Sun,      cls: "bg-itec-amber/10 text-itec-amber border-itec-amber/20",      label: "Mañana"     },
  "Tarde":      { icon: Sunset,   cls: "bg-itec-sky/10 text-itec-sky border-itec-sky/20",            label: "Tarde"      },
  "Noche":      { icon: Moon,     cls: "bg-white/5 text-white/60 border-white/10",                   label: "Noche"      },
  "Cualquiera": { icon: Sparkles, cls: "bg-itec-emerald/10 text-itec-emerald border-itec-emerald/20",label: "Cualquiera" },
};

export const TurnoBadge: React.FC<Props> = ({ turno, size = "sm" }) => {
  const { icon: Icon, cls, label } = CONFIG[turno] ?? CONFIG["Cualquiera"];
  const px = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  
  return (
    <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-widest rounded-lg border ${px} ${cls}`}>
      <Icon size={12} className="shrink-0" />
      {label}
    </span>
  );
};
