import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import { PointsBadge } from "../atoms/PointsBadge";
import { RewardTypeBadge } from "../atoms/RewardTypeBadge";
import { AffordabilityBar } from "../atoms/AffordabilityBar";
import { IconBadge } from "../atoms/IconBadge";
import type { Reward } from "../../types/rewards";

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
          ? "bg-itec-card border-itec-rewards/15 hover:border-itec-rewards/35 hover:shadow-[0_0_30px_rgba(240,177,0,0.07)]"
          : "bg-itec-card border-white/5 hover:border-itec-border"
      }`}
    >
      {!canAfford && (
        <div className="absolute inset-0 rounded-2xl bg-itec-bg/20 pointer-events-none z-0" />
      )}

      {canAfford && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-itec-rewards/50 to-transparent" />
      )}

      {isAdmin && (
        <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(reward); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-itec-blue/20 border border-itec-blue-skye/30 text-itec-blue-skye hover:bg-itec-blue-skye/20 transition-colors"
              title="Editar"
            >
              <Icons type="edit" className="size-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(reward); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Eliminar"
            >
              <Icons type="trash" className="size-3.5" />
            </button>
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
                  <Icons type="lock" className="size-2.5" />
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

        <button
          onClick={() => canAfford && onSelect(reward)}
          disabled={!canAfford}
          className={`mt-4 w-full h-10 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] ${
            canAfford
              ? "bg-itec-rewards/15 border border-itec-rewards/30 text-itec-rewards hover:bg-itec-rewards/25 hover:border-itec-rewards/50 hover:shadow-[0_0_16px_rgba(240,177,0,0.2)]"
              : "bg-white/3 border border-white/5 text-itec-text/25 cursor-not-allowed"
          }`}
        >
          {canAfford ? (
            <>
              <Icons type="star" className="size-3.5" />
              Canjear ahora
            </>
          ) : (
            <>
              <Icons type="lock" className="size-3.5" />
              Puntos insuficientes
            </>
          )}
        </button>
      </div>
    </div>
  );
};
