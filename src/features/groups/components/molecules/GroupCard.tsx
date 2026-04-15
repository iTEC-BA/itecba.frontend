import React from 'react';
import type { GroupData } from '../../services/groupsService';

interface Props {
  group: GroupData;
}

export const GroupCard: React.FC<Props> = ({ group }) => {
  if (!group) return null; 

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/15 transition-colors duration-500 pointer-events-none"></div>

      <div className="absolute -right-7 top-4 bg-slate-950 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 px-8 py-1 rotate-45 shadow-sm">
        {group.tipo || 'General'}
      </div>
      
      <div className="relative z-10">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2 drop-shadow-sm">
          Nivel {group.nivel === '0' ? 'Ingreso' : group.nivel}
        </span>
        <h4 className="font-bold text-slate-200 text-sm mb-2 pr-6 leading-snug group-hover:text-white transition-colors">{group.materia}</h4>
        <p className="text-xs text-slate-400 flex items-center gap-2">
          Comisión: 
          <strong className="text-emerald-100 bg-slate-800 border border-white/5 px-2 py-0.5 rounded-md font-mono text-[11px]">
            {group.comision}
          </strong>
        </p>
      </div>
      
      <a 
        href={group.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-6 relative z-10 flex items-center justify-center gap-2 w-full bg-slate-800/80 hover:bg-emerald-600 border border-white/5 hover:border-emerald-500 text-slate-300 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 shadow-sm"
      >
        Unirme al Grupo
      </a>
    </div>
  );
};