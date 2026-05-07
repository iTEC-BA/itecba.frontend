import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';
import { PendingResourceRow } from '../molecules/PendingResourceRow';
import { usePendingResources, useApprovePendingResource, useRejectPendingResource } from '../../hooks/useResources';
import type { ResourceData } from '../../types/resource.types';

interface Props { isOpen: boolean; onClose: () => void }

export const AdminPendingResourcesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { data: pending = [], isLoading } = usePendingResources(true);
  const approve = useApprovePendingResource();
  const reject  = useRejectPendingResource();

  const handleApprove = (r: ResourceData) =>
    approve.mutate(r, { onError: () => alert('Error al aprobar.') });

  const handleReject = (id: string) => {
    if (!window.confirm('¿Rechazar este aporte?')) return;
    reject.mutate(id, { onError: () => alert('Error al rechazar.') });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-4xl bg-itec-box border border-itec-gray/30 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black/50 flex flex-col max-h-[92dvh] sm:max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-itec-gray/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 text-lg">
              🛡️
            </div>
            <div>
              <h2 className="text-base font-bold text-itec-text">Moderación de Aportes</h2>
              <p className="text-xs text-itec-gray mt-0.5">
                {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-itec-gray/40 text-itec-gray hover:text-itec-text transition-colors"
          >
            <div className="w-4 h-4"><Icons type="close" /></div>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 rounded-full border-2 border-itec-gray/30 border-t-orange-500 animate-spin" />
            </div>
          ) : pending.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-itec-bg border-b border-itec-gray/20 sticky top-0 z-10">
                  <tr>
                    {['Título / Materia', 'Carrera', 'Tipo', 'Acciones'].map((h, i) => (
                      <th key={h}
                        className={`px-4 py-3 text-[10px] font-bold text-itec-gray uppercase tracking-widest ${i === 0 ? '' : i === 1 ? 'hidden sm:table-cell' : i === 2 ? 'hidden md:table-cell' : 'text-right'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-itec-gray/10">
                  {pending.map(r => (
                    <PendingResourceRow
                      key={r.id} resource={r}
                      onApprove={handleApprove} onReject={handleReject}
                      isApproving={approve.isPending} isRejecting={reject.isPending}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <span className="text-5xl mb-4">✅</span>
              <p className="text-base font-semibold text-itec-text mb-1">Todo revisado</p>
              <p className="text-sm text-itec-gray">No hay aportes pendientes de moderación.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
