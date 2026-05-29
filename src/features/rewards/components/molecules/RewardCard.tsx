import React from "react";
import { Button } from "@components/ui/Button";
import { PointsBadge } from "../atoms/PointsBadge";
import { RewardTypeBadge } from "../atoms/RewardTypeBadge";
import { AffordabilityBar } from "../atoms/AffordabilityBar";
import { IconBadge } from "../atoms/IconBadge";
import type { Reward } from "../../types/rewards";
import { Edit, Lock, Star, Trash } from "lucide-react";

interface Props {
  reward: Reward;
  userPoints: number;
  onSelect: (r: Reward) => void;
  onEdit?: (r: Reward) => void;
  onDelete?: (r: Reward) => void;
  isAdmin?: boolean;
}

export const RewardCard: React.FC<Props> = ({
  reward,
  userPoints,
  onSelect,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
        canAfford
          ? "bg-itec-card border-itec-rewards/15 hover:border-itec-rewards/35"
          : "bg-itec-card border-white/5 hover:border-itec-border"
      }`}
    >
      {!canAfford && (
        <div className="absolute inset-0 rounded-2xl bg-itec-bg/20 pointer-events-none z-0" />
      )}

      {canAfford && (
        <div className="absolute top-0 left-0 right-0 h-0.5" />
      )}

      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex gap-1">
          {onEdit && (
            <Button
              onClick={(e) => { e.stopPropagation(); onEdit(reward); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg px-0"
              variant="slate"
              hierarchy="solid"
              title="Editar"
            >
              <Edit className="size-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={(e) => { e.stopPropagation(); onDelete(reward); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg px-0"
              variant="danger"
              hierarchy="solid"
              title="Eliminar"
            >
              <Trash className="size-3.5" />
            </Button>
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1 p-5">
        <div className="flex items-start gap-3 mb-3">
          <IconBadge icon={reward.icon} canAfford={canAfford} size="sm" glow={canAfford} />
          <div className="flex-1 min-w-0 pr-1">
            <h3
              className={`text-sm font-bold leading-snug truncate mb-1 ${
                canAfford ? "text-itec-text" : "text-itec-text/50"
              }`}
            >
              {reward.title}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <RewardTypeBadge type={reward.type} />
              {!canAfford && (
                <span className="inline-flex items-center gap-1 text-[10px] text-itec-text/30">
                  <Lock className="size-2.5" />
                  Bloqueado
                </span>
              )}
            </div>
          </div>
          <PointsBadge points={reward.pointsCost} size="sm" showLabel variant={canAfford ? "glow" : "default"} />
        </div>

        <p
          className={`text-xs leading-relaxed line-clamp-2 flex-1 mb-4 ${
            canAfford ? "text-itec-text/60" : "text-itec-text/30"
          }`}
        >
          {reward.description}
        </p>

        <AffordabilityBar cost={reward.pointsCost} balance={userPoints} />

        <Button
          onClick={() => canAfford && onSelect(reward)}
          disabled={!canAfford}
          fullWidth
          className="mt-4 h-10 rounded-xl text-sm font-bold"
          variant={canAfford ? "primary" : "slate"}
          hierarchy={canAfford ? "solid" : "ghost"}
          icon={canAfford ? <Star className="size-4" /> : <Lock className="size-4" />}
          text={canAfford ? "Canjear ahora" : "Puntos insuficientes"}
        />
      </div>
    </div>
  );
};
