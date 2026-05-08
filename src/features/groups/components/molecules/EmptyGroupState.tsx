import React from 'react';
import { Icons } from '@components/ui/icons/Icons';

interface Props { onAddClick: () => void; }

export const EmptyGroupState: React.FC<Props> = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-dashed border-itec-border rounded-2xl bg-itec-box/40">
    <div className="w-14 h-14 rounded-2xl bg-itec-groups/10 border border-itec-groups/20 flex items-center justify-center text-2xl">
      🚀
    </div>
    <div>
      <h3 className="text-base font-bold text-itec-text">¡Sé el primero en aportar!</h3>
      <p className="text-sm text-itec-gray mt-1 max-w-xs mx-auto leading-relaxed">
        No hay grupos para esta búsqueda. Ayudá a tus compañeros compartiendo el link de WhatsApp.
      </p>
    </div>
    <button
      onClick={onAddClick}
      className="flex items-center gap-2 bg-itec-groups hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,136,84,0.3)] active:scale-95"
    >
      <Icons type="plus" className="w-3.5 h-3.5" />
      Aportar Link del Grupo
    </button>
  </div>
);
