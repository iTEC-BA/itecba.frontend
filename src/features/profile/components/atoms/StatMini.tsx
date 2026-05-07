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
  label,
  value,
  accent = "text-itec-sky",
  icon,
  loading = false,
  sublabel,
  onClick,
}) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={cn(
      "group relative overflow-hidden rounded-[1.5rem] border border-itec-border",
      "bg-gradient-to-br from-itec-box/90 to-itec-box2/80 backdrop-blur-xl",
      "p-4 flex flex-col gap-2 transition-all duration-300",
      "hover:-translate-y-0.5 hover:border-itec-border/70 hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)]",
      onClick && "cursor-pointer"
    )}
  >
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">
        {label}
      </span>
      {icon && <span className="text-base opacity-60 transition-transform group-hover:scale-110">{icon}</span>}
    </div>
    {loading ? (
      <div className="h-8 w-20 rounded-xl bg-itec-border/50 animate-pulse" />
    ) : (
      <span className={cn("text-2xl font-black leading-none", accent)}>{value}</span>
    )}
    {sublabel && <span className="text-[10px] text-itec-muted">{sublabel}</span>}
  </div>
);
