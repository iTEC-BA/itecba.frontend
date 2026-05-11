import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import type { Reward } from "../../types/rewards";

interface Props {
  reward: Reward;
  userPoints: number;
  onSelect: (r: Reward) => void;
}

export const RewardCardCompact: React.FC<Props> = ({ reward, userPoints, onSelect }) => {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <button
      disabled={!canAfford}
      onClick={() => canAfford && onSelect(reward)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-200 active:scale-[0.98] ${
        canAfford
          ? "bg-itec-rewards/8 border border-itec-rewards/15 hover:bg-itec-rewards/14 hover:border-itec-rewards/30 text-itec-text"
          : "bg-white/2 border border-white/5 text-itec-text/30 cursor-not-allowed"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
          canAfford ? "bg-itec-rewards/12 text-itec-rewards" : "bg-white/5 text-itec-text/25"
        }`}
      >
        <Icons type={reward.icon} className="size-3.5" />
      </div>
      <span className="flex-1 text-left truncate font-medium">{reward.title}</span>
      <span
        className={`font-bold tabular-nums shrink-0 ${
          canAfford ? "text-itec-rewards" : "text-itec-text/25"
        }`}
      >
        {reward.pointsCost.toLocaleString()}
      </span>
    </button>
  );
};
