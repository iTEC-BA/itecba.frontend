import React from "react";
import { Button } from "@components/atoms/Button";
import { Icons } from "@/components/ui/icons/Icons";
import { Reward } from "../../types/rewards";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onSelect: (reward: Reward) => void;
}

export const RewardCardSmall: React.FC<RewardCardProps> = ({
  reward,
  userPoints,
  onSelect,
}) => {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <Button
      variant={canAfford ? "primary" : "secondary"}
      onClick={() => onSelect(reward)}
      disabled={!canAfford}
      text=""
      className={`relative group bg-itec-blue/20 rounded-xl p-4 flex h-fit overflow-hidden items-center text-xs gap-1 ${canAfford ? "" : "opacity-10 cursor-not-allowed"}`}
    >
      <div className="size-4 text-itec-rewards shadow-inner flex items-center">
        <Icons type={reward.icon} className="size-3" />
      </div>
      <p className="leading-tight line-clamp-1">{reward.title}</p>
      <span
        className={`ml-auto ${canAfford ? "text-itec-rewards" : "text-itec-text"}`}
      >
        {reward.pointsCost} pts
      </span>
    </Button>
  );
};
