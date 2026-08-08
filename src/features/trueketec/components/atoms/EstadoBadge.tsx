import React from "react";
import type { EstadoPost } from "../../types/trueketec.types";

interface Props { estado: EstadoPost; size?: "sm" | "md"; }

const CONFIG: Record<EstadoPost, { label: string; cls: string; dot: string }> = {
  "Activo": { 
    label: "Activo", 
    cls: "bg-itec-emerald/10 text-itec-emerald border-itec-emerald/20", 
    dot: "bg-itec-emerald" 
  },
  "En Negociación": { 
    label: "En Negociación", 
    cls: "bg-itec-amber/10 text-itec-amber border-itec-amber/20", 
    dot: "bg-itec-amber" 
  },
  "Trueque Realizado": { 
    label: "Realizado", 
    cls: "bg-white/5 text-white/40 border-white/10", 
    dot: "bg-white/20" 
  },
};

export const EstadoBadge: React.FC<Props> = ({ estado, size = "sm" }) => {
  const { label, cls, dot } = CONFIG[estado] ?? CONFIG["Activo"];
  const px = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-widest rounded-lg border ${px} ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${estado === 'Activo' ? 'animate-pulse shadow-[0_0_5px_#10b981]' : ''}`} />
      {label}
    </span>
  );
};
