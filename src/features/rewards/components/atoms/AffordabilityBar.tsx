import React from "react";

interface Props {
  cost: number;
  balance: number;
  showLabel?: boolean;
}

export const AffordabilityBar: React.FC<Props> = ({ cost, balance, showLabel = true }) => {
  const pct = Math.min(100, Math.round((balance / cost) * 100));
  const canAfford = balance >= cost;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className={`text-[10px] font-semibold ${canAfford ? "text-green-400" : "text-itec-text/50"}`}>
            {canAfford ? "✓ Podés canjear" : `Faltan ${(cost - balance).toLocaleString()} pts`}
          </span>
          <span className="text-[10px] text-itec-text/40 tabular-nums">{pct}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            canAfford
              ? "bg-gradient-to-r from-itec-rewards to-amber-300"
              : "bg-white/15"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
