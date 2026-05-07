import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@components/ui/Button";
import type { Reward } from "../../types/rewards";

interface Props {
  reward: Reward;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteRewardModal: React.FC<Props> = ({
  reward,
  isLoading,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-200 px-4">
      <div className="w-full max-w-sm bg-itec-card border border-red-500/15 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-7 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <Icons type="trash" className="size-7 text-red-400" />
          </div>
          <h2 className="text-lg font-black text-itec-text mb-2">
            ¿Eliminar beneficio?
          </h2>
          <p className="text-sm text-itec-text/60 leading-relaxed mb-1">
            Estás por eliminar{" "}
            <strong className="text-itec-text">"{reward.title}"</strong>.
          </p>
          <p className="text-xs text-itec-text/40 mb-7">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
              className="h-11 rounded-2xl text-sm font-bold"
            >
              Cancelar
            </Button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-11 rounded-2xl bg-red-500/15 border border-red-500/25 text-red-400 font-bold text-sm hover:bg-red-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <Icons type="trash" className="size-4" />
              )}
              {isLoading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
