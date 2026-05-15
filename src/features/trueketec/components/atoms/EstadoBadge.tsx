// src/features/trueketec/components/atoms/EstadoBadge.tsx
import React from "react";
import type { EstadoPost } from "../../types/trueketec.types";

interface Props { estado: EstadoPost; size?: "sm" | "md"; }

const CONFIG: Record<EstadoPost, { label: string; cls: string }> = {
  "Activo":           { label: "Activo",            cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  "En Negociación":   { label: "En Negociación",    cls: "bg-amber-500/15  text-amber-400  border-amber-500/25"    },
  "Trueque Realizado":{ label: "Trueque Realizado", cls: "bg-slate-500/15  text-slate-400  border-slate-500/25"    },
};

export const EstadoBadge: React.FC<Props> = ({ estado, size = "sm" }) => {
  const { label, cls } = CONFIG[estado] ?? CONFIG["Activo"];
  const px = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border ${px} ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      {label}
    </span>
  );
};
