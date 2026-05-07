// src/features/admin/components/atoms/AdminKPICard.tsx
import React from "react";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { cn }        from "@/lib/utils";

interface AdminKPICardProps {
  label:      string;
  value:      string | number;
  emoji?:     string;
  accent?:    string;
  trend?:     "up" | "down" | "neutral";
  trendLabel?: string;
  loading?:   boolean;
  onClick?:   () => void;
}

const TREND_MAP = {
  up:      { icon: "↑", cls: "text-itec-emerald" },
  down:    { icon: "↓", cls: "text-itec-accent"  },
  neutral: { icon: "→", cls: "text-itec-muted"   },
};

export const AdminKPICard: React.FC<AdminKPICardProps> = ({
  label, value, emoji, accent = "text-itec-sky", trend, trendLabel, loading, onClick,
}) => {
  const t = trend ? TREND_MAP[trend] : null;
  return (
    <GlassCard
      hover={!!onClick}
      onClick={onClick}
      className="p-5 flex flex-col gap-3 group cursor-default"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        {emoji && (
          <span className="text-2xl group-hover:scale-110 transition-transform">
            {emoji}
          </span>
        )}
        {t && (
          <span className={cn("text-xs font-black", t.cls)}>
            {t.icon} {trendLabel}
          </span>
        )}
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-9 w-20 bg-itec-border/50 rounded-xl animate-pulse" />
      ) : (
        <span className={cn("text-4xl font-black leading-none", accent)}>
          {value}
        </span>
      )}

      {/* Label */}
      <span className="text-[11px] font-bold text-itec-muted">{label}</span>
    </GlassCard>
  );
};
