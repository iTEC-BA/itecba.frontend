import React, { useState } from "react";
import { X, Star, Gift, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Benefit, RedemptionPayload } from "@features/benefits/types/benefits";

interface Props {
  benefit: Benefit;
  userPoints: number;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (payload: RedemptionPayload) => Promise<void>;
}

export const RedeemBenefitModal: React.FC<Props> = ({ benefit, userPoints, isLoading, onClose, onConfirm }) => {
  const [step, setStep] = useState<"info" | "form">("info");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const newBalance = userPoints - benefit.pointsCost;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onConfirm({ contact, notes });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-itec-bg sm:max-w-md sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-itec-amber/10 border border-itec-amber/20">
              <Gift className="h-5 w-5 text-itec-amber" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-itec-amber">Recompensa Premium</p>
              <h2 className="text-base font-bold text-white truncate max-w-[200px]">{benefit.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "info" ? (
          <div className="flex flex-col px-6 py-6">
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1 block">Costo del canje</span>
              <div className="flex items-center justify-center gap-2 text-3xl font-black text-itec-amber">
                <Star className="h-6 w-6" fill="currentColor" />
                {benefit.pointsCost} <span className="text-lg text-itec-amber/60">pts</span>
              </div>
            </div>
            
            <div className="mb-6 flex justify-between items-center px-2">
               <span className="text-sm font-medium text-white/60">Saldo actual</span>
               <span className="text-sm font-bold text-white">{userPoints} pts</span>
            </div>
            <div className="mb-8 flex justify-between items-center px-2">
               <span className="text-sm font-medium text-white/60">Saldo restante</span>
               <span className={cn("text-sm font-bold", newBalance >= 0 ? "text-itec-emerald" : "text-itec-red")}>{newBalance} pts</span>
            </div>

            <button onClick={() => setStep("form")} className="w-full flex items-center justify-center gap-2 rounded-xl bg-itec-amber py-3.5 text-sm font-bold text-black transition-colors hover:bg-yellow-500">
              Siguiente paso <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col px-6 py-6">
            <p className="text-xs text-white/60 mb-5 leading-relaxed">
              Dejanos una forma de contacto para que la administración coordine la entrega de tu recompensa.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Email o Teléfono *</label>
                <input required type="text" placeholder="tucorreo@frba.utn.edu.ar" value={contact} onChange={e => setContact(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-itec-amber/50 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Notas (opcional)</label>
                <textarea rows={2} placeholder="Algo que quieras aclarar..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-itec-amber/50 transition-colors" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("info")} className="w-1/3 rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20">
                Atrás
              </button>
              <button type="submit" disabled={isLoading || !contact} className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-itec-emerald py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Confirmar canje"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
