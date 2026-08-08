import React from "react";
import { X, IdCard, MapPin, Tag } from "lucide-react";
import type { Benefit } from "@features/benefits/types/benefits";
import { CATEGORY_CONFIG } from "@features/benefits/types/benefits";
import { cn } from "@/lib/utils";

interface Props {
  benefit: Benefit;
  onClose: () => void;
}

export const BenefitInfoModal: React.FC<Props> = ({ benefit, onClose }) => {
  const cat = CATEGORY_CONFIG[benefit.category];

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-itec-bg sm:max-w-md sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
              {benefit.img ? <img src={benefit.img} alt="" className="h-6 w-6 object-contain" /> : <Tag className="h-5 w-5 text-white/50" />}
            </div>
            <div>
              <p className={cn("text-[10px] font-bold uppercase tracking-widest", cat.color)}>{cat.label}</p>
              <h2 className="text-base font-bold text-white truncate max-w-[200px]">{benefit.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Instrucciones pase digital */}
        <div className="flex flex-col items-center gap-6 px-6 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-itec-emerald/10 border border-itec-emerald/20">
            <IdCard className="h-10 w-10 text-itec-emerald" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-black tracking-tight text-white">Mostrá tu TarjeTEC</h3>
            <p className="text-sm text-white/60 leading-relaxed px-4">
              Para acceder a este descuento de <strong className="text-white">{benefit.title}</strong>, presentá tu credencial digital desde tu perfil de iTEC al momento de pagar.
            </p>
          </div>

          {benefit.location && benefit.location !== "-" && (
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2">
              <MapPin className="h-4 w-4 text-white/40" />
              <span className="text-xs font-medium text-white/70">{benefit.location}</span>
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <div className="border-t border-white/10 p-4">
          <button onClick={onClose} className="w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
