import React from "react";
import { Button } from "@components/atoms/Button";
import { Icons } from "@/components/ui/icons/Icons";
import { Reward } from "../../types/rewards";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onSelect: (reward: Reward) => void;
}

export const RewardCardMedium: React.FC<RewardCardProps> = ({
  reward,
  userPoints,
  onSelect,
}) => {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <div className="relative group bg-itec-blue/20 rounded-xl p-4 flex flex-col h-fit overflow-hidden">
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="size-3 rounded-lg text-itec-rewards shadow-inner flex items-center justify-center">
          <Icons type={reward.icon} className="size-3" />
        </div>
        <h3 className="text-sm font-semibold text-itec-textleading-tight">
          {reward.title}
        </h3>
      </div>
      <p className="text-xs text-itec-text mb-4">
        {reward.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className={`font-semibold text-xs leading-none ${canAfford ? "text-white" : "text-itec-text"}`}
          >
            {reward.pointsCost} <span className="text-xs font-normal">pts</span>
          </span>
          {!canAfford && (
            <span className="text-[10px] text-gray-500 mt-1">
              Te faltan {reward.pointsCost - userPoints} pts
            </span>
          )}
        </div>
        <Button
          variant={canAfford ? "primary" : "secondary"}
          onClick={() => onSelect(reward)}
          disabled={!canAfford}
          className={`text-xs ${canAfford ? "shadow-[0_0_10px_rgba(2,42,94,0.4)]" : "opacity-60 cursor-not-allowed"}`}
          text={canAfford ? "Canjear" : "Bloqueado"}
        />
      </div>
    </div>
  );
};
