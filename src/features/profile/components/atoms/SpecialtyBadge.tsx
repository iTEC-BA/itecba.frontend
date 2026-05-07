import React from "react";
import { cn } from "@/lib/utils";
const COLORS: Record<string, string> = {
  Sistemas:    "bg-itec-sky/10   border-itec-sky/25   text-itec-sky",
  Industrial:  "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
  Civil:       "bg-orange-500/10 border-orange-500/25 text-orange-400",
  Electrónica: "bg-violet-500/10 border-violet-500/25 text-violet-400",
  Eléctrica:   "bg-amber-500/10  border-amber-500/25  text-amber-400",
  Química:     "bg-teal-500/10   border-teal-500/25   text-teal-400",
  Mecánica:    "bg-red-500/10    border-red-500/25    text-red-400",
  Naval:       "bg-cyan-500/10   border-cyan-500/25   text-cyan-400",
  Textil:      "bg-pink-500/10   border-pink-500/25   text-pink-400",
};
export const SpecialtyBadge: React.FC<{ specialty: string; sm?: boolean }> = ({
  specialty, sm = false,
}) => {
  const cls = COLORS[specialty] ?? "bg-itec-box2 border-itec-border text-itec-muted";
  return (
    <span className={cn(
      "inline-flex items-center border rounded-xl font-bold tracking-wide",
      cls,
      sm ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
    )}>
      Ing. {specialty}
    </span>
  );
};
