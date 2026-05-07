import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';
import { ResourceTypePill } from '../atoms/ResourceTypePill';
import { ResourceFormatBadge } from '../atoms/ResourceFormatBadge';
import type { ResourceData } from '../../types/resource.types';

interface Props { resource: ResourceData }

export const ResourceRow: React.FC<Props> = ({ resource: r }) => (
  <tr className="group border-b border-itec-gray/20 hover:bg-orange-500/5 transition-colors">
    {/* Título + Formato */}
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-itec-sidebar border border-itec-gray/40 flex items-center justify-center text-itec-gray group-hover:text-orange-400 transition-colors">
          <div className="w-4 h-4"><Icons type="documentFill" /></div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-itec-text truncate max-w-[220px] xl:max-w-sm">
            {r.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-itec-gray">Formato:</span>
            <ResourceFormatBadge formato={r.formato} />
          </div>
        </div>
      </div>
    </td>

    {/* Materia */}
    <td className="p-4">
      <p className="text-sm text-itec-text font-medium truncate max-w-[160px]">{r.materia}</p>
      <p className="text-[10px] text-itec-gray uppercase tracking-wider mt-0.5">
        <span className="capitalize text-orange-400/80">{r.carrera}</span>
        {' · '}Año {r.nivel}
      </p>
    </td>

    {/* Tipo */}
    <td className="p-4">
      <ResourceTypePill tipo={r.tipo} />
    </td>

    {/* Acciones */}
    <td className="p-4 text-right">
      <div className="flex items-center justify-end gap-2">
        <a
          href={r.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-itec-bg border border-itec-gray/40 hover:border-orange-500/50 hover:bg-orange-600/10 text-itec-gray hover:text-orange-400 text-xs font-medium transition-all"
        >
          <div className="w-3.5 h-3.5"><Icons type="externalLink" /></div>
          <span className="hidden xl:inline">Ver</span>
        </a>
        <a
          href={r.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-itec-text text-xs font-semibold transition-all shadow-sm shadow-orange-900/30"
        >
          <div className="w-3.5 h-3.5"><Icons type="download" /></div>
          Descargar
        </a>
      </div>
    </td>
  </tr>
);
