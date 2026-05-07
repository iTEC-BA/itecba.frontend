import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';
import { ResourceTypePill } from '../atoms/ResourceTypePill';
import { ResourceFormatBadge } from '../atoms/ResourceFormatBadge';
import type { ResourceData } from '../../types/resource.types';

interface Props { resource: ResourceData }

export const ResourceCard: React.FC<Props> = ({ resource: r }) => (
  <article className="group bg-itec-box border border-itec-gray/40 hover:border-orange-500/40 rounded-2xl p-4 flex gap-3 items-start transition-all hover:shadow-lg hover:shadow-orange-900/10">
    {/* Icono */}
    <div className="w-10 h-10 shrink-0 rounded-xl bg-itec-sidebar border border-itec-gray/50 flex items-center justify-center text-itec-gray group-hover:text-orange-400 transition-colors">
      <div className="w-5 h-5"><Icons type="documentFill" /></div>
    </div>

    {/* Contenido */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-itec-text truncate leading-snug mb-1">
        {r.title}
      </p>
      <p className="text-xs text-itec-gray truncate mb-2">
        {r.materia} · <span className="capitalize">{r.carrera}</span> · Año {r.nivel}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <ResourceTypePill tipo={r.tipo} size="xs" />
        <ResourceFormatBadge formato={r.formato} />
      </div>
    </div>

    {/* Acción */}
    <a
      href={r.link}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-itec-bg border border-itec-gray/40 hover:border-orange-500/60 hover:bg-orange-600 text-itec-gray hover:text-itec-text transition-all"
      aria-label="Abrir recurso"
    >
      <div className="w-4 h-4"><Icons type="externalLink" /></div>
    </a>
  </article>
);
