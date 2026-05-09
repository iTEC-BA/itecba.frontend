import React, { useState } from 'react';
import { Icons } from '@components/ui/icons/Icons';
import { GroupBadge } from '../atoms/GroupBadge';
import { GroupGlowCard } from '../atoms/GroupGlowCard';
import { useAuth } from '@context/AuthContext';
import { useReportGroup, useUpdateGroupLink } from '../../hooks/useGroups';
import type { GroupData } from '../../services/groupsService';

interface Props {
  group: GroupData;
}

export const GroupCard: React.FC<Props> = ({ group }) => {
  const { isAdmin, user, isAuthenticated } = useAuth();
  const reportMutation = useReportGroup();
  const updateLinkMutation = useUpdateGroupLink();

  const [isEditingLink, setIsEditingLink] = useState(false);
  const [newLink, setNewLink] = useState(group.link);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('link-invalido');
  const [reported, setReported] = useState(false);
  const [linkSaved, setLinkSaved] = useState(false);

  if (!group) return null;

  const handleSaveLink = async () => {
    if (!newLink.startsWith('http') || newLink === group.link) { setIsEditingLink(false); return; }
    updateLinkMutation.mutate({ id: group.id!, link: newLink }, {
      onSuccess: () => { setLinkSaved(true); setIsEditingLink(false); setTimeout(() => setLinkSaved(false), 2000); },
    });
  };

  const handleReport = async () => {
    if (!isAuthenticated) { alert('Debes iniciar sesión para reportar.'); return; }
    reportMutation.mutate(
      { id: group.id!, reason: reportReason, email: user?.email || undefined },
      {
        onSuccess: () => { setReported(true); setShowReportForm(false); },
        onError: (e: any) => alert(e.message || 'Error al reportar.'),
      }
    );
  };

  return (
    <GroupGlowCard glowColor="green" className="flex flex-col overflow-hidden group relative">
      {/* Tipo ribbon */}
      {group.tipo === 'Oficial' && (
        <div className="absolute -right-6 top-4 bg-itec-blue-skye text-[8px] font-bold text-white px-8 py-1 rotate-45 shadow-sm uppercase tracking-widest z-10">
          Oficial
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <GroupBadge variant="nivel">Nivel {group.nivel === '0' ? 'Ingreso' : group.nivel}</GroupBadge>
          {group.carrera && <GroupBadge variant="carrera">{group.carrera === 'homogeneas' ? 'Básicas (Z)' : group.carrera}</GroupBadge>}
          {(group.reportCount ?? 0) > 0 && <GroupBadge variant="count">{group.reportCount} rep.</GroupBadge>}
        </div>

        {/* Materia */}
        <div>
          <h4 className="font-bold text-itec-text text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {group.materia}
          </h4>
          <p className="text-xs text-itec-gray mt-1 flex items-center gap-1.5">
            Comisión:
            <span className="font-mono font-bold text-emerald-400 bg-itec-groups/10 px-1.5 py-0.5 rounded border border-itec-groups/20 text-[10px]">
              {group.comision}
            </span>
          </p>
        </div>

        {/* Link editor (admin) */}
        {isAdmin && isEditingLink ? (
          <div className="flex gap-1.5 items-center">
            <input
              value={newLink}
              onChange={e => setNewLink(e.target.value)}
              className="flex-1 bg-itec-bg border border-itec-border text-itec-text text-[11px] px-2.5 py-1.5 rounded-lg outline-none focus:border-itec-blue-skye min-w-0"
              placeholder="https://chat.whatsapp.com/..."
            />
            <button
              onClick={handleSaveLink}
              disabled={updateLinkMutation.isPending}
              className="w-7 h-7 bg-itec-groups rounded-lg flex items-center justify-center shrink-0 hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              <Icons type="check" className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={() => setIsEditingLink(false)} className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors">
              <Icons type="close" className="w-3 h-3 text-itec-gray" />
            </button>
          </div>
        ) : null}

        {/* Saved feedback */}
        {linkSaved && <p className="text-[10px] text-emerald-400 font-bold">Link actualizado ✓</p>}

        {/* Report form */}
        {showReportForm && (
          <div className="bg-itec-bg border border-itec-red/25 rounded-xl p-3 flex flex-col gap-2 animate-in fade-in duration-200">
            <p className="text-[11px] font-bold text-itec-text">Motivo del reporte:</p>
            <select
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              className="bg-itec-box border border-itec-border text-itec-text text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-itec-red"
            >
              <option value="link-invalido">Link inválido / caído</option>
              <option value="link-incorrecto">Link incorrecto</option>
              <option value="grupo-lleno">Grupo lleno</option>
              <option value="otro">Otro</option>
            </select>
            <div className="flex gap-1.5">
              <button
                onClick={handleReport}
                disabled={reportMutation.isPending}
                className="flex-1 bg-itec-red hover:bg-red-600 text-white text-xs font-bold py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {reportMutation.isPending ? 'Enviando...' : 'Reportar'}
              </button>
              <button onClick={() => setShowReportForm(false)} className="px-3 bg-white/5 hover:bg-white/10 text-itec-gray text-xs rounded-lg transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Reported feedback */}
        {reported && (
          <p className="text-[10px] text-itec-red font-bold flex items-center gap-1">
            <Icons type="check" className="w-3 h-3" /> Reporte enviado — gracias
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex gap-1.5 p-3 pt-0">
        {/* Unirse */}
        <a
          href={group.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-itec-groups/12 hover:bg-itec-groups text-emerald-400 hover:text-white border border-itec-groups/25 hover:border-itec-groups py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
        >
          <Icons type="users" className="w-3.5 h-3.5" />
          Unirme
        </a>

        {/* Admin: editar link */}
        {isAdmin && !isEditingLink && (
          <button
            onClick={() => setIsEditingLink(true)}
            className="w-9 flex items-center justify-center bg-itec-blue-skye/10 hover:bg-itec-blue-skye/20 border border-itec-blue-skye/20 rounded-xl text-itec-blue-skye transition-colors"
            title="Cambiar link"
          >
            <Icons type="edit" className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Reportar link */}
        {!reported && !showReportForm && (
          <button
            onClick={() => setShowReportForm(true)}
            className="w-9 flex items-center justify-center bg-white/5 hover:bg-itec-red/10 border border-white/8 hover:border-itec-red/25 rounded-xl text-itec-gray hover:text-itec-red transition-colors"
            title="Reportar link caído"
          >
            <Icons type="info" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </GroupGlowCard>
  );
};
