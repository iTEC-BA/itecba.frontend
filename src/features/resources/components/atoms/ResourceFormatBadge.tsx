import React from 'react';
import { FORMATO_META } from '../../types/resource.types';

interface Props { formato: string }

export const ResourceFormatBadge: React.FC<Props> = ({ formato }) => {
  const meta = FORMATO_META[formato] ?? { color: 'text-itec-gray', short: 'WEB' };
  return (
    <span className={`text-[10px] font-bold tracking-widest ${meta.color}`}>
      {meta.short}
    </span>
  );
};
