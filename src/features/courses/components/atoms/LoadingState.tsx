import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-700">
    <div className="relative w-20 h-20 flex items-center justify-center mb-8">
       <div className="absolute inset-0 border-4 border-slate-800/50 rounded-full"></div>
       <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
    </div>
    <h3 className="text-white font-bold text-xl mb-2 tracking-wide">Desplegando Clases...</h3>
    <p className="text-sky-500/70 text-sm font-medium">Sincronizando con el servidor</p>
  </div>
);