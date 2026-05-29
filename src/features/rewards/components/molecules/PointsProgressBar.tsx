import React from "react";

interface Props {
  current: number;
  target: number;
  label?: string;
}

export const PointsProgressBar: React.FC<Props> = ({ current, target, label }) => {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-itec-text/50 uppercase tracking-wider">
          {label ?? "Progreso al siguiente nivel"}
        </span>
        <span className="text-[10px] text-itec-text/40 tabular-nums font-semibold">
          {remaining > 0 ? `Faltan ${remaining.toLocaleString()} pts` : "¡Nivel alcanzado!"}
        </span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-itec-rewards transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
