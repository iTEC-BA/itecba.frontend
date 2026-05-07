import React, { useState } from 'react';
import { Icons } from '@components/ui/icons/Icons';
import { GroupBadge } from '../atoms/GroupBadge';
import { type GroupData } from '../../services/groupsService';
import { usePendingGroups, useReportedGroups, useApprovePendingGroup, useRejectPendingGroup, useUpdateGroupLink } from '../../hooks/useGroups';

interface Props { isOpen: boolean; onClose: () => void; }

type Tab = 'pending' | 'reported';

export const AdminPendingGroupsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<Tab>('pending');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editLinkValue, setEditLinkValue] = useState('');

  const { data: pendingGroups = [], isLoading: loadingPending } = usePendingGroups(true);
  const { data: reportedGroups = [], isLoading: loadingReported } = useReportedGroups(true);
  const approveMutation = useApprovePendingGroup();
  const rejectMutation = useRejectPendingGroup();
  const updateLinkMutation = useUpdateGroupLink();

  const handleApprove = (group: GroupData) => {
    approveMutation.mutate(group, { onError: () => alert('Error al aprobar.') });
  };
  const handleReject = (groupId: string) => {
    if (!window.confirm('¿Eliminar esta solicitud permanentemente?')) return;
    rejectMutation.mutate(groupId, { onError: () => alert('Error al rechazar.') });
  };
  const handleSaveLink = (groupId: string) => {
    if (!editLinkValue.startsWith('http')) { alert('Link inválido.'); return; }
    updateLinkMutation.mutate({ id: groupId, link: editLinkValue }, {
      onSuccess: () => { setEditingLinkId(null); setEditLinkValue(''); },
      onError: () => alert('Error al actualizar link.'),
    });
  };

  const groups = tab === 'pending' ? pendingGroups : reportedGroups;
  const isLoading = tab === 'pending' ? loadingPending : loadingReported;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-itec-box border border-white/[0.08] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-5xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-300">

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div>
            <h2 className="text-base font-bold text-itec-text">Panel de Moderación</h2>
            <p className="text-[11px] text-itec-gray mt-0.5">Revisá grupos antes de publicarlos.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-itec-gray hover:text-itec-text transition-colors">
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 shrink-0 border-b border-white/[0.06]">
          {([['pending', 'Pendientes', pendingGroups.length], ['reported', 'Reportados', reportedGroups.length]] as const).map(([t, label, count]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${tab === t ? 'border-itec-groups text-emerald-400' : 'border-transparent text-itec-gray hover:text-itec-text'}`}>
              {label}
              {count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === t ? 'bg-itec-groups/20 text-emerald-400' : 'bg-white/5 text-itec-gray'}`}>{count}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-6 h-6 border-2 border-white/10 border-t-itec-groups rounded-full animate-spin" />
              <p className="text-itec-gray text-sm">Cargando...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <Icons type="check" className="w-10 h-10 text-itec-gray opacity-30" />
              <p className="text-itec-gray text-sm">No hay grupos {tab === 'pending' ? 'pendientes' : 'reportados'}.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map(group => (
                <div key={group.id} className="bg-itec-bg border border-white/[0.07] rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-white/12 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <GroupBadge variant="nivel">Nivel {group.nivel}</GroupBadge>
                      <GroupBadge variant="carrera">{group.carrera}</GroupBadge>
                      {tab === 'reported' && group.reportCount && group.reportCount > 0 && <GroupBadge variant="count">{group.reportCount} reportes</GroupBadge>}
                    </div>
                    <p className="font-bold text-sm text-itec-text truncate">{group.materia}</p>
                    <p className="text-xs text-itec-gray mt-0.5">Comisión: <span className="font-mono text-emerald-400 font-bold">{group.comision}</span></p>

                    {/* Link editor */}
                    {editingLinkId === group.id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          value={editLinkValue}
                          onChange={e => setEditLinkValue(e.target.value)}
                          className="flex-1 bg-itec-box border border-white/10 text-itec-text text-xs px-3 py-1.5 rounded-lg outline-none focus:border-itec-blue-skye min-w-0"
                          placeholder="https://chat.whatsapp.com/..."
                        />
                        <button onClick={() => handleSaveLink(group.id!)} disabled={updateLinkMutation.isPending}
                          className="px-3 bg-itec-groups text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50">
                          Guardar
                        </button>
                        <button onClick={() => setEditingLinkId(null)} className="px-3 bg-white/5 text-itec-gray text-xs rounded-lg hover:bg-white/10 transition-colors">
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <a href={group.link} target="_blank" rel="noreferrer" className="text-itec-blue-skye hover:underline text-xs truncate max-w-[240px]">{group.link}</a>
                        <button onClick={() => { setEditingLinkId(group.id!); setEditLinkValue(group.link); }}
                          className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-itec-blue-skye/15 text-itec-gray hover:text-itec-blue-skye transition-colors"
                          title="Editar link">
                          <Icons type="edit" className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {group.submittedBy && <p className="text-[10px] text-itec-gray mt-1">Por: {group.submittedBy}</p>}
                  </div>

                  <div className="flex sm:flex-col gap-2 items-end sm:justify-start shrink-0">
                    {tab === 'pending' && (
                      <button onClick={() => handleApprove(group)} disabled={approveMutation.isPending}
                        className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-itec-groups hover:bg-emerald-500 text-white rounded-xl transition-all disabled:opacity-50 whitespace-nowrap">
                        Aprobar
                      </button>
                    )}
                    <button onClick={() => handleReject(group.id!)} disabled={rejectMutation.isPending}
                      className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-itec-red bg-itec-red/10 hover:bg-itec-red/20 border border-itec-red/20 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/[0.06] shrink-0 flex justify-end">
          <button onClick={onClose} className="text-xs font-semibold bg-itec-blue-skye hover:bg-itec-blue text-white px-5 py-2 rounded-xl transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
