import React from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AnnouncementData } from '@/services/adminService';
import { Icons } from '@/components/ui/Icons';

interface Props {
  announcements: AnnouncementData[];
  isLoading: boolean;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}

export const NewsFeed: React.FC<Props> = ({ announcements, isLoading, deleteMutation }) => {
  if (isLoading) return <div className="text-gray-500 text-sm animate-pulse p-4">Cargando...</div>;
  
  if (announcements.length === 0) return (
    <div className="h-full border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-10 text-gray-500 opacity-70">
      <span className="text-3xl mb-2">📭</span>
      <p className="text-xs uppercase tracking-widest font-bold">Bandeja Vacía</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {announcements.map(a => (
        <div key={a.id} className="bg-itec-surface/40 border border-white/5 p-5 rounded-3xl relative group hover:border-orange-500/30 transition-all shadow-lg">
          <button 
            onClick={() => deleteMutation.mutate(a.id)} 
            disabled={deleteMutation.isPending}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors bg-white/5 rounded-full p-1.5 opacity-0 group-hover:opacity-100"
            title="Quitar Aviso"
          >
            <div className="w-3.5 h-3.5"><Icons type="close" /></div>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
            <h4 className="text-white font-bold text-sm pr-8">{a.title}</h4>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">{a.message}</p>
          <div className="flex items-center">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
              Vence: {a.expiresAt.toDate().toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};