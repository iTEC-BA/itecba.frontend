import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import { PointsBadge } from "../atoms/PointsBadge";
import { RewardTypeBadge } from "../atoms/RewardTypeBadge";
import { AffordabilityBar } from "../atoms/AffordabilityBar";
import type { Reward } from "../../types/rewards";

interface Props {
  reward: Reward;
  userPoints: number;
  onSelect: (r: Reward) => void;
  onEdit?: (r: Reward) => void;
  onDelete?: (r: Reward) => void;
  isAdmin?: boolean;
}

export const RewardCardFeatured: React.FC<Props> = ({
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
      className={`group relative rounded-3xl border overflow-hidden transition-all duration-300 ${
        canAfford
          ? "bg-gradient-to-br from-itec-rewards/10 via-itec-card to-itec-card border-itec-rewards/20 hover:border-itec-rewards/40 hover:shadow-[0_0_40px_rgba(240,177,0,0.12)]"
          : "bg-itec-card border-white/6 hover:border-white/12"
      }`}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-itec-rewards/8 blur-[40px] rounded-full pointer-events-none" />

      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(reward); }}
              className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-itec-blue/20 border border-itec-blue-skye/30 text-itec-blue-skye text-xs font-bold hover:bg-itec-blue-skye/20 transition-colors"
            >
              <Icons type="edit" className="size-3" />
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(reward); }}
              className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
            >
              <Icons type="trash" className="size-3" />
              Borrar
            </button>
          )}
        </div>
      )}

      <div className="relative z-10 p-6 sm:p-7">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              canAfford
                ? "bg-itec-rewards/12 border-itec-rewards/25 text-itec-rewards shadow-[0_0_20px_rgba(240,177,0,0.15)]"
                : "bg-white/5 border-white/8 text-itec-text/30"
            }`}
          >
            <Icons type={reward.icon} className="size-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-itec-rewards/60">
                ★ Destacado
              </span>
              <RewardTypeBadge type={reward.type} size="md" />
            </div>
            <h3
              className={`text-lg font-black leading-snug ${
                canAfford ? "text-itec-text" : "text-itec-text/50"
              }`}
            >
              {reward.title}
            </h3>
          </div>
          <PointsBadge points={reward.pointsCost} size="md" showLabel variant={canAfford ? "glow" : "default"} />
        </div>

        <p
          className={`text-sm leading-relaxed mb-5 ${
            canAfford ? "text-itec-text/70" : "text-itec-text/35"
          }`}
        >
          {reward.description}
        </p>

        <AffordabilityBar cost={reward.pointsCost} balance={userPoints} />

        <button
          onClick={() => canAfford && onSelect(reward)}
          disabled={!canAfford}
          className={`mt-5 w-full h-12 rounded-2xl text-base font-black transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${
            canAfford
              ? "bg-itec-rewards text-itec-bg hover:bg-amber-400 shadow-[0_4px_24px_rgba(240,177,0,0.3)]"
              : "bg-white/4 border border-white/5 text-itec-text/25 cursor-not-allowed"
          }`}
        >
          {canAfford ? (
            <>
              <Icons type="star" className="size-5" />
              ¡Canjear este beneficio!
            </>
          ) : (
            <>
              <Icons type="lock" className="size-5" />
              Necesitás {(reward.pointsCost - userPoints).toLocaleString()} pts más
            </>
          )}
        </button>
      </div>
    </div>
  );
};
