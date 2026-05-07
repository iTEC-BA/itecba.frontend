import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useRewards } from "../../hooks/useRewards";
import { Icons } from "@components/ui/icons/Icons";
import { RewardCardCompact } from "../molecules/RewardCardCompact";
import { RedeemModal } from "./RedeemModal";
import { RewardSuccessModal } from "./RewardSuccessModal";
import type { Reward, RedemptionPayload } from "../../types/rewards";

const RewardsWidgetInner: React.FC = () => {
  const { rewards, pointsBalance, isLoading, isRedeeming, handleRedeem } = useRewards();
  const [selected, setSelected] = useState<Reward | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    cost: number;
    newBalance: number;
  } | null>(null);

  const onConfirm = async (payload: RedemptionPayload) => {
    if (!selected) return;
    const id = (selected as any)._id || selected.id;
    const ok = await handleRedeem(payload, id, selected.pointsCost);
    if (ok) {
      setSuccessInfo({
        title: selected.title,
        cost: selected.pointsCost,
        newBalance: pointsBalance - selected.pointsCost,
      });
      setSelected(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 bg-white/4 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-1.5">
      <div className="flex items-center justify-between px-1 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-itec-text/40">
          Recompensas
        </p>
        <div className="flex items-center gap-1 text-xs font-bold text-itec-rewards">
          <Icons type="star" className="size-3" />
          <span className="tabular-nums">{pointsBalance.toLocaleString()} pts</span>
        </div>
      </div>

      {rewards.length === 0 ? (
        <p className="text-xs text-itec-text/40 text-center py-4">
          Sin beneficios disponibles aún
        </p>
      ) : (
        rewards.slice(0, 5).map((r: any) => {
          const id = r._id || r.id;
          return (
            <RewardCardCompact
              key={id}
              reward={{ ...r, id }}
              userPoints={pointsBalance}
              onSelect={setSelected}
            />
          );
        })
      )}

      {selected && (
        <RedeemModal
          reward={selected}
          userPoints={pointsBalance}
          isLoading={isRedeeming}
          onClose={() => setSelected(null)}
          onConfirm={onConfirm}
        />
      )}

      {successInfo && (
        <RewardSuccessModal
          rewardTitle={successInfo.title}
          pointsCost={successInfo.cost}
          newBalance={successInfo.newBalance}
          onClose={() => setSuccessInfo(null)}
        />
      )}
    </section>
  );
};

export const RewardsWidget: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <RewardsWidgetInner />;
};
