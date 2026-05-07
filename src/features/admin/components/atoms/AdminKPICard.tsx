import React from "react";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { cn } from "@/lib/utils";

interface AdminKPICardProps {
  label: string;
  value: string | number;
  emoji?: string;
  accent?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  loading?: boolean;
  onClick?: () => void;
}

const TREND_MAP = {
  up: { icon: "↑", cls: "text-itec-emerald" },
  down: { icon: "↓", cls: "text-itec-accent" },
  neutral: { icon: "→", cls: "text-itec-muted" },
};

export const AdminKPICard: React.FC<AdminKPICardProps> = ({
  label,
  value,
  emoji,
  accent = "text-itec-sky",
  trend,
  trendLabel,
  loading,
  onClick,
}) => {
  const t = trend ? TREND_MAP[trend] : null;

  return (
    <GlassCard
      hover={!!onClick}
      onClick={onClick}
      variant="elevated"
      glow={accent.includes("amber") ? "amber" : accent.includes("emerald") ? "emerald" : accent.includes("purple") ? "purple" : accent.includes("accent") ? "accent" : "sky"}
      className="group flex cursor-default flex-col gap-3 p-5"
    >
      <div className="flex items-start justify-between">
        {emoji && <span className="text-2xl transition-transform group-hover:scale-110">{emoji}</span>}
        {t && <span className={cn("text-xs font-black", t.cls)}>{t.icon} {trendLabel}</span>}
      </div>

      {loading ? (
        <div className="h-10 w-24 animate-pulse rounded-2xl bg-itec-border/50" />
      ) : (
        <span className={cn("text-4xl font-black leading-none", accent)}>{value}</span>
      )}

      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-itec-muted">{label}</span>
    </GlassCard>
  );
};
