import React from "react";
interface Props { cost: number; active?: boolean }
export const AIBadge: React.FC<Props> = ({ cost, active = false }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider transition-colors ${
    active
      ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
      : "bg-white/5 border-white/10 text-white/40"
  }`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    IA · {cost} pts
  </span>
);
