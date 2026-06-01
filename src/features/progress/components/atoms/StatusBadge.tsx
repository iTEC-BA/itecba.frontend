import React from 'react';
import type { SubjectStatus } from '../../types/progress';

interface Props { status: SubjectStatus }

const cfg: Record<SubjectStatus, { label: string; cls: string }> = {
  aprobada:          { label: 'Final Aprobado',   cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
  promocionada:      { label: 'Promocionada ✦',   cls: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' },
  habilitada_rendir: { label: 'Regularizada',     cls: 'bg-orange-400/15 text-orange-300 border-itec-primary/40' },
  regular_bloqueada: { label: 'Reg. Sin Final',   cls: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  cursando:          { label: 'Cursando',         cls: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' },
  habilitada_cursar: { label: 'Habilitada Cursar',cls: 'bg-itec-gray/30 text-itec-text border-itec-gray/50' },
  bloqueada:         { label: 'Bloqueada',        cls: 'bg-transparent text-gray-500 border-dashed border-gray-700/50 opacity-50' },
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const { label, cls } = cfg[status] ?? cfg.bloqueada;
  return (
    <span className={`cursor-pointer inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${cls}`}>
      {label}
    </span>
  );
};
