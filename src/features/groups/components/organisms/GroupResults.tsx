import React from 'react';
import { GroupCard } from '../molecules/GroupCard';
import { EmptyGroupState } from '../molecules/EmptyGroupState';
import { GroupCardSkeleton } from '../molecules/GroupCardSkeleton';
import type { GroupData } from '../../services/groupsService';

interface PaginationInfo {
  currentPage: number;
  totalPages:  number;
  total:       number;
}

interface Props {
  results:       GroupData[];
  onClear:       () => void;
  onAddClick:    () => void;
  isLoading?:    boolean;
  searchError?:  string | null;
  pagination?:   PaginationInfo;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<{ info: PaginationInfo; onPageChange: (p: number) => void }> = ({
  info, onPageChange,
}) => {
  const { currentPage, totalPages } = info;
  if (totalPages <= 1) return null;

  // Genera array de páginas con ellipsis: [1, ..., 4, 5, 6, ..., 12]
  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 text-xs font-bold text-itec-gray hover:text-itec-text hover:bg-white/5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Anterior
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-xs text-itec-gray">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${
              p === currentPage
                ? 'bg-itec-groups text-white shadow-[0_0_10px_rgba(0,136,84,0.3)]'
                : 'text-itec-gray hover:text-itec-text hover:bg-white/5'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 text-xs font-bold text-itec-gray hover:text-itec-text hover:bg-white/5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Siguiente →
      </button>
    </div>
  );
};

export const GroupResults: React.FC<Props> = ({
  results, onClear, onAddClick, isLoading, searchError, pagination, onPageChange,
}) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-itec-groups rounded-full shadow-[0_0_12px_rgba(0,136,84,0.5)]" />
        <div>
          <h3 className="text-base font-bold text-itec-text">Resultados</h3>
          <p className="text-[11px] text-itec-gray">
            <span className="text-emerald-400 font-bold">{pagination?.total ?? results.length}</span>
            {' '}comunidad{(pagination?.total ?? results.length) !== 1 ? 'es' : ''} encontrada
            {(pagination?.total ?? results.length) !== 1 ? 's' : ''}
            {pagination && pagination.totalPages > 1 && (
              <span className="ml-1 text-itec-gray/60">
                · página {pagination.currentPage} de {pagination.totalPages}
              </span>
            )}
          </p>
        </div>
      </div>
      <button
        onClick={onClear}
        className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-itec-gray hover:text-itec-text bg-itec-box border border-white/8 hover:border-white/20 px-4 py-2 rounded-xl transition-all active:scale-95"
      >
        ← Volver
      </button>
    </div>

    {/* Error de búsqueda */}
    {searchError && (
      <div className="mb-4 p-4 bg-itec-red/10 border border-itec-red/25 rounded-xl text-xs text-itec-red font-medium">
        {searchError}
      </div>
    )}

    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => <GroupCardSkeleton key={i} />)}
      </div>
    ) : results.length > 0 ? (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {results.map((g) => (
            <GroupCard key={g.id ?? (g as GroupData & { _id?: string })._id} group={g} />
          ))}
        </div>
        {pagination && onPageChange && (
          <Pagination info={pagination} onPageChange={onPageChange} />
        )}
      </>
    ) : (
      <EmptyGroupState onAddClick={onAddClick} />
    )}
  </div>
);
