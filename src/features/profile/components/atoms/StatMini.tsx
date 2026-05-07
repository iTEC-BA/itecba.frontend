import React from "react";
import { cn } from "@/lib/utils";
interface StatMiniProps {
  label: string;
  value: string | number;
  accent?: string;
  icon?: string;
  loading?: boolean;
  sublabel?: string;
  onClick?: () => void;
}
export const StatMini: React.FC<StatMiniProps> = ({
  label, value, accent = "text-itec-sky", icon, loading = false, sublabel, onClick,
}) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={cn(
      "bg-itec-surface/60 border border-itec-border rounded-2xl p-4",
      "flex flex-col gap-1.5 backdrop-blur-sm",
      "transition-all duration-200 hover:border-itec-gray/50",
      onClick && "cursor-pointer hover:scale-[1.02]"
    )}
  >
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-itec-muted font-bold uppercase tracking-widest">
        {label}
      </span>
      {icon && <span className="text-base opacity-50">{icon}</span>}
    </div>
    {loading ? (
      <div className="h-7 w-16 bg-itec-border/50 rounded-lg animate-pulse" />
    ) : (
      <span className={cn("text-xl font-black leading-none", accent)}>
        {value}
      </span>
    )}
    {sublabel && (
      <span className="text-[10px] text-itec-muted">{sublabel}</span>
    )}
  </div>
);
