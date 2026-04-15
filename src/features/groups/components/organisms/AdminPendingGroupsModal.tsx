import React from 'react';
import { type GroupData } from '../../services/groupsService';
import { usePendingGroups, useApprovePendingGroup, useRejectPendingGroup } from '../../hooks/useGroups';
import { Icons } from '@/components/atoms/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPendingGroupsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { data: pendingGroups = [], isLoading } = usePendingGroups(true);
  const approveMutation = useApprovePendingGroup();
  const rejectMutation = useRejectPendingGroup();

  const handleApprove = (group: GroupData) => {
    approveMutation.mutate(group, {
      onSuccess: () => alert(`Grupo ${group.comision} aprobado correctamente.`),
      onError: () => alert("Error al aprobar.")
    });
  };

  const handleReject = (groupId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta solicitud de forma permanente?")) return;
    rejectMutation.mutate(groupId, {
      onError: () => alert("Error al rechazar.")
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header del Modal */}
        <div className="bg-gray-800/50 border-b border-gray-700 p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Icons type="users" className="w-5 h-5 text-blue-400" />
              Panel de Moderación
            </h2>
            <p className="text-xs text-gray-400 mt-1">Revisá la validez de los grupos aportados antes de hacerlos públicos.</p>
          </div>
          <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Icons type="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo / Tabla */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-gray-900/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">Cargando solicitudes...</p>
            </div>
          ) : pendingGroups.length > 0 ? (
            <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/30">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Materia & Comisión</th>
                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Especialidad</th>
                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aportado Por</th>
                    <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {pendingGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-800/50 transition-colors">
                      
                      {/* Materia y Comisión */}
                      <td className="p-4">
                        <p className="text-gray-100 font-bold mb-1 truncate max-w-[250px]">{group.materia}</p>
                        <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-gray-600">
                          {group.comision}
                        </span>
                      </td>

                      {/* Carrera / Nivel */}
                      <td className="p-4">
                        <span className="capitalize text-gray-300 font-medium text-xs bg-blue-900/20 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20">
                          {group.carrera === 'homogeneas' ? 'Básicas (Z)' : group.carrera}
                        </span>
                      </td>

                      {/* Link y Usuario */}
                      <td className="p-4">
                        <a href={group.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline text-xs block mb-1 truncate max-w-[180px]">
                          {group.link}
                        </a>
                        <p className="text-[10px] text-gray-500">Por: {group.submittedBy || 'Anónimo'}</p>
                      </td>

                      {/* Botonera */}
                      <td className="p-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleReject(group.id as string)} 
                            disabled={rejectMutation.isPending} 
                            className="cursor-pointer px-4 py-2 text-xs font-bold bg-gray-800 text-red-400 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 rounded-xl transition-all disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                          <button 
                            onClick={() => handleApprove(group)} 
                            disabled={approveMutation.isPending} 
                            className="cursor-pointer px-4 py-2 text-xs font-bold bg-green-600 text-white hover:bg-green-500 rounded-xl transition-all disabled:opacity-50 shadow-sm"
                          >
                            Aprobar
                          </button>
                        </div>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center">
              <Icons type="check" className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 text-sm">No hay grupos pendientes de revisión.</p>
              <p className="text-gray-500 text-xs mt-1">Todo está al día.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};