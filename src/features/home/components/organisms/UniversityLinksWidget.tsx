import React, { useState, useEffect, Suspense } from 'react';
import { Icons } from '../../../../components/atoms/Icons';
import { linksService, type CampusLink } from '../../services/linksService';

// 🔴 LAZY LOADING: El modal no se descarga hasta que sea estrictamente necesario
const EditLinksModal = React.lazy(() => 
  import('./EditLinksModal').then(module => ({ default: module.EditLinksModal }))
);

interface Props {
  isAdmin: boolean;
}

export const UniversityLinksWidget: React.FC<Props> = ({ isAdmin }) => {
  const [links, setLinks] = useState<CampusLink[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadLinks = async () => {
    setIsLoading(true);
    try {
      const data = await linksService.getLinks();
      setLinks(data);
    } catch (e) { 
      console.error("Error cargando links", e); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <section className="my-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          Links a la Vida Universitaria
        </h2>
        {isAdmin && (
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer"
            title="Editar Links"
          >
            <Icons type="settings" className="w-4 h-4" />
            <span className="text-xs">Agregar más links</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          <div className="w-full h-8 flex items-center">
            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : links.length === 0 ? (
          <p className="text-xs text-gray-600 italic">No hay links configurados aún.</p>
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith('/') ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="bg-itec-surface border border-itec-gray hover:border-gray-400 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-medium text-gray-300 hover:text-white transition-colors"
            >
              <span>{link.icon}</span> {link.title}
            </a>
          ))
        )}
      </div>

      {/* Renderizado perezoso del Modal */}
      {isEditModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
          <EditLinksModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            onLinksUpdated={loadLinks} 
          />
        </Suspense>
      )}
    </section>
  );
};