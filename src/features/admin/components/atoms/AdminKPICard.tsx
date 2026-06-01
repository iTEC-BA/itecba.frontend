import React from "react";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

type IconType = React.ComponentProps<typeof Icons>["type"];

interface AdminKPICardProps {
  label: string;
  value: string | number;
  icon?: IconType;
  accent?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  loading?: boolean;
  onClick?: () => void;
}

const TREND_MAP = {
  up:      { icon: "↑", cls: "text-itec-emerald" },
  down:    { icon: "↓", cls: "text-itec-accent" },
  neutral: { icon: "→", cls: "text-itec-muted" },
};

export const AdminKPICard: React.FC<AdminKPICardProps> = ({
  label,
  value,
  icon,
  accent = "text-itec-sky",
  trend,
  trendLabel,
  loading,
  onClick,
}) => {
  const t = trend ? TREND_MAP[trend] : null;

  const glowColor =
    accent.includes("amber")   ? "amber"   :
    accent.includes("emerald") ? "emerald" :
    accent.includes("purple")  ? "purple"  :
    accent.includes("accent")  ? "accent"  : "sky";

  return (
    <GlassCard
      hover={!!onClick}
      onClick={onClick}
      variant="elevated"
      glow={glowColor}
      className="group flex cursor-default flex-col gap-3 p-5"
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", accent)}>
            <Icons type={icon} />
          </div>
        )}
        {t && (
          <span className={cn("ml-auto text-xs font-bold", t.cls)}>
            {t.icon} {trendLabel}
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-10 w-24 animate-pulse rounded-xl bg-itec-border/50" />
      ) : (
        <span className={cn("text-4xl font-bold leading-none tracking-tight", accent)}>{value}</span>
      )}

      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-itec-muted">{label}</span>
    </GlassCard>
  );
};
