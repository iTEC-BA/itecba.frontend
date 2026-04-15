import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/atoms/Icons';
import { SearchResultItem } from '@/components/molecules/SearchResultItem'; 
import type { ResourceData } from '@features/resources/services/resourcesService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  relatedResources: ResourceData[];
}

export const CourseMaterialModal: React.FC<Props> = ({ isOpen, onClose, relatedResources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-3xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-itec-bg border border-itec-gray flex items-center justify-center text-gray-500 hover:text-white transition-colors z-10">
          <div className="w-4 h-4"><Icons type="close" /></div>
        </button>
        
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-orange-500">📚</span> Material de Apoyo
        </h2>
        <p className="text-xs text-gray-400 mb-6">Archivos, resúmenes y parciales de esta materia.</p>

        {relatedResources.length > 0 ? (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
            {relatedResources.map(res => (
              // 🔴 RECICLAMOS EL COMPONENTE DEL BUSCADOR
              <SearchResultItem 
                key={res.id || (res as any)._id}
                type="aporte"
                title={res.title}
                subtitle={`${res.tipo} • Subido por ${res.autor}`}
                link={res.link}
                isExternal
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-itec-bg rounded-2xl border border-itec-gray border-dashed">
            <span className="text-4xl block mb-3 opacity-50">📂</span>
            <p className="text-gray-400 text-sm font-medium">Aún no hay apuntes para esta materia.</p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-itec-gray text-center">
          <Link to="/explore" className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors flex items-center justify-center gap-2">
            Buscar más en Aportes <div className="w-4 h-4"><Icons type="arrowRight" /></div>
          </Link>
        </div>
      </div>
    </div>
  );
};