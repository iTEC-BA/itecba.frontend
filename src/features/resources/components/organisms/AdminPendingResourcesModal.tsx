import React from 'react';
import type { ResourceData } from '../../services/resourcesService';

// Importamos los hooks de pendiente, aceptar y rechazar
import { usePendingResources, useApprovePendingResource, useRejectPendingResource } from '../../hooks/useResources';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPendingResourcesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  // Traemos la data del caché (cargará al instante)
  const { data: pending = [], isLoading } = usePendingResources(true);
  
  const approveMutation = useApprovePendingResource();
  const rejectMutation = useRejectPendingResource();

  const handleApprove = (res: ResourceData) => {
    approveMutation.mutate(res, {
      onError: () => alert("Error al aprobar.")
    });
  };

  const handleReject = (id: string) => {
    if (!window.confirm("¿Rechazar este aporte?")) return;
    rejectMutation.mutate(id, {
      onError: () => alert("Error al rechazar.")
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-2xl w-full max-w-5xl shadow-2xl p-6 relative flex flex-col max-h-[85vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">✖</button>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center text-sm">🛡️</span>
            Moderación de Aportes
          </h2>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar border border-itec-gray rounded-xl bg-itec-bg">
          {isLoading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-t-orange-500 rounded-full animate-spin"></div></div>
          ) : pending.length > 0 ? (
            <table className="w-full text-left whitespace-nowrap text-sm">
              <thead className="bg-itec-surface sticky top-0 border-b border-itec-gray">
                <tr>
                  <th className="p-3 text-[10px] text-gray-500 uppercase">Título / Materia</th>
                  <th className="p-3 text-[10px] text-gray-500 uppercase">Carrera</th>
                  <th className="p-3 text-[10px] text-gray-500 uppercase">Tipo</th>
                  <th className="p-3 text-[10px] text-gray-500 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((res) => (
                  <tr key={res.id} className="border-b border-itec-gray/50 hover:bg-itec-surface/50">
                    <td className="p-3">
                      <p className="text-white font-medium">{res.title}</p>
                      <p className="text-xs text-gray-400">{res.materia}</p>
                    </td>
                    <td className="p-3 text-gray-400 text-xs capitalize">{res.carrera}</td>
                    <td className="p-3"><span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">{res.tipo} • {res.formato}</span></td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <a href={res.link} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-xs bg-itec-gray text-white rounded-lg">Ver Archivo</a>
                        <button onClick={() => handleReject(res.id as string)} disabled={rejectMutation.isPending} className="px-3 py-1.5 text-xs bg-itec-red/10 text-itec-red-skye rounded-lg disabled:opacity-50">Rechazar</button>
                        <button onClick={() => handleApprove(res)} disabled={approveMutation.isPending} className="px-3 py-1.5 text-xs bg-orange-600 text-white rounded-lg disabled:opacity-50">Aprobar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 text-gray-400">No hay aportes pendientes.</div>
          )}
        </div>
      </div>
    </div>
  );
};