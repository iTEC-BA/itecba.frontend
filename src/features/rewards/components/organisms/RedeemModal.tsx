import React, { useState } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import { PointsBadge } from "../atoms/PointsBadge";
import { RewardTypeBadge } from "../atoms/RewardTypeBadge";
import { IconBadge } from "../atoms/IconBadge";
import { RedeemFormFields } from "../molecules/RedeemFormFields";
import type { Reward, RedemptionPayload } from "../../types/rewards";

interface Props {
  reward: Reward;
  userPoints: number;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (payload: RedemptionPayload) => Promise<void>;
}

export const RedeemModal: React.FC<Props> = ({
  reward,
  userPoints,
  isLoading,
  onClose,
  onConfirm,
}) => {
  const [form, setForm] = useState<Partial<RedemptionPayload>>({
    rewardId: reward.id,
    contact: "",
  });
  const [step, setStep] = useState<"info" | "form">("info");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(form as RedemptionPayload);
  };

  const newBalance = userPoints - reward.pointsCost;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-itec-card border border-white/8 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <IconBadge icon={reward.icon} canAfford size="sm" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-text/40 mb-0.5">
                Confirmar canje
              </p>
              <h2 className="text-base font-bold text-itec-text leading-snug">
                {reward.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-itec-text/60 hover:text-itec-text transition-colors shrink-0"
          >
            <Icons type="close" className="size-4" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 flex-wrap">
          <RewardTypeBadge type={reward.type} />
          <PointsBadge points={reward.pointsCost} size="sm" showLabel variant="glow" />
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] text-itec-text/40">Saldo tras canje:</span>
            <span className={`text-xs font-bold ${newBalance >= 0 ? "text-green-400" : "text-red-400"}`}>
              {newBalance.toLocaleString()} pts
            </span>
          </div>
        </div>

        {step === "info" ? (
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-itec-text/70 leading-relaxed">
              {reward.description}
            </p>
            <div className="bg-itec-blue/8 border border-itec-blue/15 rounded-2xl p-4">
              <p className="text-xs text-itec-text/70 leading-relaxed">
                Al confirmar, se descontarán{" "}
                <strong className="text-itec-text">
                  {reward.pointsCost.toLocaleString()} puntos
                </strong>{" "}
                de tu saldo. El equipo de ITEC se pondrá en contacto a la brevedad.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="slate" hierarchy="ghost"
                onClick={onClose}
                fullWidth
                className="h-11 rounded-2xl text-sm font-bold"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setStep("form")}
                fullWidth
                className="h-11 rounded-2xl text-sm font-bold"
              >
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            <button
              type="button"
              onClick={() => setStep("info")}
              className="flex items-center gap-1.5 text-xs text-itec-text/50 hover:text-itec-text transition-colors"
            >
              <Icons type="chevron-left" className="size-3.5" />
              Volver
            </button>

            <RedeemFormFields
              type={reward.type}
              value={form}
              onChange={setForm}
            />

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="slate" hierarchy="ghost"
                onClick={onClose}
                fullWidth
                className="h-11 rounded-2xl text-sm font-bold"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={isLoading}>Confirmar canje</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
