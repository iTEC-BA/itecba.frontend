import React from 'react';

interface Props { tipo: string; size?: 'sm' | 'xs' }

export const ResourceTypePill: React.FC<Props> = ({ tipo, size = 'sm' }) => (
  <span
    className={`
      inline-flex items-center rounded-md border border-orange-500/20
      bg-orange-500/10 text-orange-400 font-semibold uppercase tracking-wider
      ${size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'}
    `}
  >
    {tipo}
  </span>
);
