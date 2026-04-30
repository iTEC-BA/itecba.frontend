// src/features/rewards/components/organisms/RewardsWidget.tsx
import React, { useState } from "react";
import { useRewards } from "../../hooks/useRewards";
import { RewardCard } from "../molecules/RewardCard";
import { RedeemModal } from "./RedeemModal";
import { Reward, RedemptionPayload } from "../../types/rewards";

export const RewardsWidget: React.FC = () => {
  const { rewards, pointsBalance, isLoading, isRedeeming, handleRedeem } =
    useRewards();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const onConfirmRedeem = async (payload: RedemptionPayload) => {
    if (!selectedReward) return;
    const rewardId = (selectedReward as any)._id || selectedReward.id;

    const success = await handleRedeem(
      payload,
      rewardId,
      selectedReward.pointsCost,
    );
    if (success) {
      setSelectedReward(null);
      alert("¡Canje realizado con éxito!");
    }
  };

  if (isLoading)
    return <div className="animate-pulse h-64 bg-itect-bg rounded-xl"></div>;

  return (
    <section className="mb-4 relative">
      <div className="flex flex-col justify-between gap-4 mb-4">
        <h3 className="font-semibold text-itec-text/60 flex items-center gap-2">
          Beneficios Estudiantiles
        </h3>
        <p className="text-itec-text text-sm">
          Intercambia tus puntos académicos por mentorías, descuentos y accesos
          exclusivos.
        </p>
      </div>

      {rewards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-itec-text">
            Próximamente habrán nuevos beneficios disponibles.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {rewards.map((reward: any) => {
            const uniqueId = reward._id || reward.id;
            return (
              <RewardCard
                key={uniqueId}
                reward={{ ...reward, id: uniqueId }}
                userPoints={pointsBalance}
                onSelect={setSelectedReward}
              />
            );
          })}
        </div>
      )}

      {selectedReward && (
        <RedeemModal
          reward={selectedReward}
          isLoading={isRedeeming}
          onClose={() => setSelectedReward(null)}
          onConfirm={onConfirmRedeem}
        />
      )}
    </section>
  );
};
