import React from "react";
import { cn } from "@/lib/utils";

export interface RewardItem {
  icon: string; // clase ti ti-*
  label: string;
  cost: number;
  onRedeem?: () => void;
}

interface ProfileRewardsCardProps {
  points: number;
  rewards: RewardItem[];
  className?: string;
}

/**
 * Tarjeta de recompensas con lista canjeable.
 * Corresponde a .rewards-card del HTML de referencia.
 */
export const ProfileRewardsCard: React.FC<ProfileRewardsCardProps> = ({
  points,
  rewards,
  className,
}) => (
  <div
    className={cn(
      "rounded-2xl border border-itec-amber/20 bg-itec-box2 p-4 sm:p-5",
      className
    )}
  >
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-['Barlow_Condensed',sans-serif] text-base font-bold text-itec-text">
        Mis puntos acumulados
      </h3>
      <span className="font-['Barlow_Condensed',sans-serif] text-xl font-bold text-itec-amber">
        {points} pts
      </span>
    </div>

    <div className="space-y-2">
      {rewards.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl bg-itec-bg px-3 py-2.5"
        >
          <span className={cn(r.icon, "text-base text-itec-amber shrink-0")} />
          <span className="flex-1 text-[13px] text-itec-text">{r.label}</span>
          <span className="text-[12px] font-semibold text-itec-amber">{r.cost} pts</span>
          <button
            onClick={r.onRedeem}
            className="rounded-lg border border-itec-amber/25 bg-itec-amber/10 px-2.5 py-1 text-[11px] font-semibold text-itec-amber transition hover:bg-itec-amber/20 whitespace-nowrap"
          >
            Canjear
          </button>
        </div>
      ))}
    </div>
  </div>
);
