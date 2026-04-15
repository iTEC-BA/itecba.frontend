import React from 'react';
import { Icons } from '@/components/atoms/Icons';

interface Props {
  onAddClick: () => void;
}

export const EmptyGroupState: React.FC<Props> = ({ onAddClick }) => {
  return (
    <div className="bg-gradient-to-b from-itec-surface to-itec-sidebar border border-itec-gray border-dashed rounded-3xl p-10 md:p-16 text-center shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Brillo de fondo */}
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-green-500/20"></div>
      
      <div className="w-20 h-20 bg-itec-bg border border-itec-gray rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-500">
        🚀
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 relative z-10 tracking-tight">¡Sé el primero en aportar!</h3>
      <p className="text-sm text-gray-400 max-w-md mx-auto mb-8 relative z-10 leading-relaxed">
        No hay registros en nuestra base para esta materia y comisión específica. Ayudá a tus compañeros compartiendo el enlace de WhatsApp.
      </p>
      
      <button 
        onClick={onAddClick} 
        className="cursor-pointer bg-green-600 hover:bg-green-500 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center gap-3 relative z-10 active:scale-95"
      >
        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
          <Icons type="plus" className="w-3 h-3 text-white" />
        </div>
        Aportar Link del Grupo
      </button>
    </div>
  );
};