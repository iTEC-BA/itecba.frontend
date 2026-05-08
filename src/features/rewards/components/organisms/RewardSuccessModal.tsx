import React, { useEffect } from "react";
import { Icons } from "@components/ui/icons/Icons";

interface Props {
  rewardTitle: string;
  pointsCost: number;
  newBalance: number;
  onClose: () => void;
}

export const RewardSuccessModal: React.FC<Props> = ({
  rewardTitle,
  pointsCost,
  newBalance,
  onClose,
}) => {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 px-4">
      <div className="w-full max-w-sm bg-itec-card border border-green-500/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-90 duration-300 text-center">
        <div className="relative p-8">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(74,222,128,0.2)]">
              <Icons type="check" className="size-10 text-green-400" />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-green-400/70 mb-2">
              ¡Canje exitoso!
            </p>
            <h2 className="text-xl font-bold text-itec-text mb-1">{rewardTitle}</h2>
            <p className="text-sm text-itec-text/60 mb-6 leading-relaxed">
              Se descontaron{" "}
              <strong className="text-itec-text">{pointsCost.toLocaleString()} pts</strong>.
              Nuevo saldo:{" "}
              <strong className="text-itec-rewards">{newBalance.toLocaleString()} pts</strong>.
            </p>

            <div className="bg-itec-bg border border-white/8 rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs text-itec-text/60 leading-relaxed">
                📩 El equipo de ITEC se pondrá en contacto con vos a la brevedad para coordinar el beneficio.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full h-11 rounded-2xl bg-green-500/15 border border-green-500/25 text-green-400 font-bold text-sm hover:bg-green-500/25 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
