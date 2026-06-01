import React from 'react';
import { ResourceCard } from '../molecules/ResourceCard';
import { ResourceRow } from '../molecules/ResourceRow';
import { ResourceCardSkeleton } from '../atoms/ResourceCardSkeleton';
import { EmptyResources } from '../atoms/EmptyResources';
import type { ResourceData } from '../../types/resource.types';

interface Props {
  resources: ResourceData[];
  isLoading: boolean;
  onAddClick: () => void;
}

const SKELETON_COUNT = 5;

export const ResourcesTable: React.FC<Props> = ({ resources, isLoading, onAddClick }) => {

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ResourceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return <EmptyResources onAddClick={onAddClick} />;
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* ── Vista CARD (móvil / tablet) ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 lg:hidden">
        {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
      </div>

      {/* ── Vista TABLA (desktop) ───────────────────────────────────────────── */}
      <div className="hidden lg:block rounded-xl border border-itec-gray/30 overflow-hidden shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-itec-bg border-b border-itec-gray/30">
              <tr>
                {['Archivo / Título', 'Materia & Nivel', 'Tipo', 'Acciones'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-[10px] font-bold text-itec-gray uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-gray/10">
              {resources.map(r => <ResourceRow key={r.id} resource={r} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
