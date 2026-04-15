import React from 'react';
import { GroupCard } from '../molecules/GroupCard';
import { EmptyGroupState } from '../molecules/EmptyGroupState';
import type { GroupData } from '../../services/groupsService';

interface Props {
  results: GroupData[];
  onClear: () => void;
  onAddClick: () => void;
}

export const GroupResults: React.FC<Props> = ({ results, onClear, onAddClick }) => {
  const safeResults = results || []; // 🛡️ Defensive Programming

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 px-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
            <h3 className="text-xl font-bold text-white tracking-tight">Resultados de la Búsqueda</h3>
          </div>
          <p className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-widest">
            Encontramos <span className="text-emerald-400 font-bold">{safeResults.length}</span> comunidade{safeResults.length === 1 ? '' : 's'}
          </p>
        </div>

        <button 
          onClick={onClear} 
          className="cursor-pointer text-xs font-bold text-slate-400 hover:text-emerald-400 bg-slate-900/50 hover:bg-slate-800 px-5 py-2.5 rounded-xl transition-all duration-300 border border-white/10 hover:border-emerald-500/30 self-start md:self-auto shadow-sm active:scale-95 flex items-center gap-2"
        >
          <span>←</span> Volver al Panel
        </button>
      </div>
      
      {safeResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {safeResults.map((g) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <GroupCard key={g.id || (g as any)._id} group={g} />
          ))}
        </div>
      ) : (
        <EmptyGroupState onAddClick={onAddClick} />
      )}
    </div>
  );
};