import React from "react";
import type { EstadoPost } from "../../types/trueketec.types";

const CONFIG: Record<EstadoPost, { label: string; cls: string }> = {
  "Activo": { label: "Activo", cls: "text-itec-blue-skye border-itec-blue-skye/40" },
  "En Negociación": { label: "En Trámite", cls: "text-itec-text border-itec-border" },
  "Trueque Realizado": { label: "Cerrado", cls: "text-itec-muted border-itec-border" },
};

export const EstadoBadge: React.FC<{ estado: EstadoPost }> = ({ estado }) => {
  const { label, cls } = CONFIG[estado] ?? CONFIG["Activo"];
  return (
    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border bg-itec-box ${cls}`}>
      {label}
    </span>
  );
};
