import React from 'react';
import { ResourceTypePill } from '../atoms/ResourceTypePill';
import type { ResourceData } from '../../types/resource.types';

interface Props {
  resource: ResourceData;
  onApprove: (r: ResourceData) => void;
  onReject: (id: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export const PendingResourceRow: React.FC<Props> = ({
  resource: r, onApprove, onReject, isApproving, isRejecting,
}) => (
  <tr className="border-b border-itec-border hover:bg-itec-box/60 transition-colors">
    <td className="p-3 md:p-4">
      <p className="text-sm font-semibold text-itec-text truncate max-w-[180px] md:max-w-xs">{r.title}</p>
      <p className="text-xs text-itec-gray mt-0.5 truncate">{r.materia}</p>
    </td>
    <td className="p-3 md:p-4 hidden sm:table-cell">
      <span className="text-xs text-itec-text capitalize">{r.carrera} · Año {r.nivel}</span>
    </td>
    <td className="p-3 md:p-4 hidden md:table-cell">
      <ResourceTypePill tipo={r.tipo} size="xs" />
    </td>
    <td className="p-3 md:p-4">
      <div className="flex items-center justify-end gap-2 flex-wrap">
        <a
          href={r.link} target="_blank" rel="noreferrer"
          className="px-2.5 py-1.5 text-xs rounded-lg bg-itec-gray/20 text-itec-text hover:bg-itec-gray/40 transition-colors"
        >
          Ver
        </a>
        <button
          onClick={() => onReject(r.id as string)}
          disabled={isRejecting}
          className="px-2.5 py-1.5 text-xs rounded-lg bg-itec-red/10 text-itec-red-skye hover:bg-itec-red hover:text-itec-text disabled:opacity-40 transition-colors"
        >
          Rechazar
        </button>
        <button
          onClick={() => onApprove(r)}
          disabled={isApproving}
          className="px-2.5 py-1.5 text-xs rounded-lg bg-orange-600 text-itec-text hover:bg-orange-500 disabled:opacity-40 transition-colors font-semibold"
        >
          Aprobar
        </button>
      </div>
    </td>
  </tr>
);
