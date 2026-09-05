import React from 'react';
import type { SubjectStatus } from '../../types/progress';

interface Props { status: SubjectStatus }

const cfg: Record<SubjectStatus, { label: string; cls: string }> = {
  aprobada:          { label: 'Promocionado',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  promocionada:      { label: 'Promocionado',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  habilitada_rendir: { label: 'Regularizada',     cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  regular_bloqueada: { label: 'Regularizada',     cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  cursando:          { label: 'Cursando',         cls: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' },
  habilitada_cursar: { label: 'Para Cursar',      cls: 'bg-white/10 text-itec-text border-white/20' },
  bloqueada:         { label: 'Sin Cursar',       cls: 'bg-transparent text-gray-500 border-dashed border-white/10' },
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const { label, cls } = cfg[status] ?? cfg.bloqueada;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold border ${cls}`}>
      {label}
    </span>
  );
};
