import React from "react";
import { Star } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { cn } from "@/lib/utils";

export const PointsWidget = () => {
  const { user } = useAuth();
  const points = user?.points || 0;

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all select-none",
        "bg-itec-rewards/10 border-itec-rewards/20 text-itec-rewards"
      )}
      title="Puntos acumulados"
    >
      <Star className="w-3.5 h-3.5 fill-itec-rewards text-itec-rewards shrink-0" />
      <span className="text-[11px] font-bold font-mono tracking-wide mt-0.5">{points} pts</span>
    </div>
  );
};
