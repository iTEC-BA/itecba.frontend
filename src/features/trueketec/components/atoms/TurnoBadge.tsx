import React from "react";
import type { TurnoDeseado } from "../../types/trueketec.types";

export const TurnoBadge: React.FC<{ turno: TurnoDeseado }> = ({ turno }) => {
  return (
    <span className="inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-widest rounded border border-itec-border bg-itec-box text-itec-muted mt-1 w-max">
      {turno}
    </span>
  );
};
