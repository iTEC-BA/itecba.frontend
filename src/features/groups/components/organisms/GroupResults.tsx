import React from 'react';
import { GroupCard } from '../molecules/GroupCard';
import { EmptyGroupState } from '../molecules/EmptyGroupState';
import { GroupCardSkeleton } from '../molecules/GroupCardSkeleton';
import type { GroupData } from '../../services/groupsService';

interface Props { results: GroupData[]; onClear: () => void; onAddClick: () => void; isLoading?: boolean; }

export const GroupResults: React.FC<Props> = ({ results, onClear, onAddClick, isLoading }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-itec-groups rounded-full shadow-[0_0_12px_rgba(0,136,84,0.5)]" />
        <div>
          <h3 className="text-base font-bold text-itec-text">Resultados</h3>
          <p className="text-[11px] text-itec-gray">
            <span className="text-emerald-400 font-bold">{results.length}</span> comunidad{results.length !== 1 ? 'es' : ''} encontrada{results.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <button onClick={onClear} className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-itec-gray hover:text-itec-text bg-itec-box border border-white/8 hover:border-white/20 px-4 py-2 rounded-xl transition-all active:scale-95">
        ← Volver
      </button>
    </div>

    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => <GroupCardSkeleton key={i} />)}
      </div>
    ) : results.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {results.map((g) => <GroupCard key={g.id || (g as any)._id} group={g} />)}
      </div>
    ) : (
      <EmptyGroupState onAddClick={onAddClick} />
    )}
  </div>
);
