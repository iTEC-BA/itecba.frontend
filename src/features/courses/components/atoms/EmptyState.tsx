import React from 'react';
import { Icons } from '@/components/atoms/Icons';

export const EmptyState: React.FC = () => (
  <div className="bg-slate-900/30 border border-white/5 border-dashed rounded-[2.5rem] p-16 text-center shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4">
    <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <div className="w-24 h-24 bg-slate-950/50 border border-white/5 rounded-3xl flex items-center justify-center text-sky-400 mb-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
      <Icons type="search" className="w-10 h-10 opacity-60 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
    </div>
    
    <h3 className="text-3xl font-extrabold text-white mb-3 relative z-10 tracking-tight">Cinta vacía</h3>
    <p className="text-sm text-slate-400 max-w-sm mx-auto relative z-10 leading-relaxed">
      No encontramos cursos que coincidan con tus filtros. Probá ajustando la búsqueda o cambiando de materia en el panel superior.
    </p>
  </div>
);