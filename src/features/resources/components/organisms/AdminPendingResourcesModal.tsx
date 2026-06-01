import React from 'react';
import { PendingResourceRow } from '../molecules/PendingResourceRow';
import { usePendingResources, useApprovePendingResource, useRejectPendingResource } from '../../hooks/useResources';
import type { ResourceData } from '../../types/resource.types';
import { LayoutModal } from '@/components/templates/LayoutModal';

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
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title="Moderación de Aportes"
      description={`${pending.length} pendiente${pending.length !== 1 ? 's' : ''}`}
      maxWidth="max-w-4xl"
    >
      <div className="overflow-y-scroll flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 rounded-full border-2 border-itec-gray/30 border-t-orange-500 animate-spin" />
            </div>
          ) : pending.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-itec-bg border-b border-itec-border sticky top-0 z-10">
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
    </LayoutModal>
  );
};
