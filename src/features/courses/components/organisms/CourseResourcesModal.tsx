import React from 'react';
import { Icons } from '@/components/ui/Icons';

interface Resource {
  id: string;
  title: string;
  materia: string;
  driveUrl: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
}

export const CourseResourcesModal: React.FC<Props> = ({ isOpen, onClose, resources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-itec-surface/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center shadow-inner">
              <span className="text-2xl drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]">📚</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Archivos de la Clase</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Recursos Disponibles</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-full p-2 transition-all outline-none">
            <div className="w-5 h-5"><Icons type="close" /></div>
          </button>
        </div>
        
        {/* Lista de Recursos Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          {resources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 opacity-60">
               <span className="text-5xl mb-4">📭</span>
               <p className="text-xs font-bold uppercase tracking-widest">Sin archivos vinculados</p>
               <p className="text-sm font-medium mt-2 text-center max-w-[250px]">El profesor aún no ha subido material complementario para este curso.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {resources.map((res) => (
                <a key={res.id} href={res.driveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl transition-all group outline-none shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20 group-hover:scale-110 transition-transform">
                    <span className="text-xl">📄</span>
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">{res.title}</h4>
                    <p className="text-[10px] text-gray-500 truncate mt-1">{res.materia}</p>
                  </div>
                  <div className="text-gray-600 group-hover:text-white transition-colors w-5 h-5 shrink-0 bg-white/5 p-1 rounded-full group-hover:bg-white/10">
                    <Icons type="external-link" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* Botón Acción Inferior */}
        <div className="p-6 md:px-8 border-t border-white/5 bg-black/20 shrink-0">
           <button onClick={onClose} className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 rounded-xl transition-transform hover:scale-[0.98] text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.15)] outline-none">
             Entendido, Volver al curso
           </button>
        </div>
      </div>
    </div>
  );
};