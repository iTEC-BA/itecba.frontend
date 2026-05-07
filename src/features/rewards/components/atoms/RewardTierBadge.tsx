import React from "react";
import type { RewardTier } from "../../types/rewards";
import { REWARD_TIER_CONFIG } from "../../types/rewards";

interface Props {
  tier: RewardTier;
  size?: "sm" | "md";
}

const TIER_EMOJI: Record<RewardTier, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
};

export const RewardTierBadge: React.FC<Props> = ({ tier, size = "sm" }) => {
  const config = REWARD_TIER_CONFIG[tier];
  const sizeCls =
    size === "md"
      ? "gap-1.5 px-2.5 py-1 text-xs"
      : "gap-1 px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider border ${config.cls} ${sizeCls}`}
    >
      <span className="text-[10px]">{TIER_EMOJI[tier]}</span>
      {config.label}
    </span>
  );
};
