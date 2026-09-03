import React from "react";
import type { EstadoPost } from "../../types/trueketec.types";
import { ESTADO_CONFIG } from "../../data";

export const EstadoBadge: React.FC<{ estado: EstadoPost }> = ({ estado }) => {
  const { label, cls } = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG["Activo"];
  return (
    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border bg-itec-box ${cls}`}>
      {label}
    </span>
  );
};
