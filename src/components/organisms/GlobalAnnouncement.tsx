import React, { useState, useEffect } from 'react';
import { adminService, type AnnouncementData } from '../../services/adminService';
import { Icons } from '../atoms/Icons';

export const GlobalAnnouncement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const activeNews = await adminService.getActiveAnnouncements();
        if (activeNews.length > 0) {
          // Filtrar noticias que el usuario ya cerró previamente
          const dismissedIds = JSON.parse(localStorage.getItem('itec_dismissed_news') || '[]');
          const newNews = activeNews.filter(news => !dismissedIds.includes(news.id));
          
          if (newNews.length > 0) {
            setAnnouncements(newNews);
            setIsVisible(true);
          }
        }
      } catch (error) {
        // Ahora sí te dirá el motivo real (ej: "Failed to fetch")
        console.error("Error buscando avisos globales:", error);
      }
    };
    
    // Pequeño delay de cortesía
    setTimeout(() => { fetchNews(); }, 1200);
  }, []);

  const handleClose = () => {
    // Guarda todos los IDs en el localStorage para no volver a mostrarlos
    const dismissedIds = JSON.parse(localStorage.getItem('itec_dismissed_news') || '[]');
    const newDismissed = [...new Set([...dismissedIds, ...announcements.map(a => a.id)])];
    localStorage.setItem('itec_dismissed_news', JSON.stringify(newDismissed));
    setIsVisible(false);
  };

  if (!isVisible || announcements.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#0C1014] border border-[#333] rounded-xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        
        {/* CABECERA INSTITUCIONAL */}
        <div className="p-5 border-b border-[#333] bg-[#151a21] rounded-t-xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-300 shrink-0">
              <div className="w-5 h-5"><Icons type="documentFill" /></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide uppercase">Cartelera de Avisos Oficiales</h2>
              <p className="text-xs text-gray-400">Novedades de la Facultad y el Centro de Estudiantes</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <div className="w-5 h-5"><Icons type="close" /></div>
          </button>
        </div>

        {/* LISTA DE NOTICIAS (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="space-y-6">
            {announcements.map((announcement) => {
              const date = announcement.createdAt?.toDate ? announcement.createdAt.toDate() : new Date();
              
              return (
                <div key={announcement.id} className="flex flex-col md:flex-row gap-5 pb-6 border-b border-[#222] last:border-0 last:pb-0">
                  
                  {/* Bloque de Fecha (Estilo Calendario Serio) */}
                  <div className="md:w-24 shrink-0 flex flex-col items-center justify-center bg-[#151a21] border border-[#333] rounded-lg p-3 h-max">
                    <span className="text-2xl font-black text-white leading-none">
                      {date.getDate().toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {date.toLocaleString('es-ES', { month: 'short' })} {date.getFullYear()}
                    </span>
                  </div>
                  
                  {/* Cuerpo del Mensaje */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {announcement.title}
                    </h3>
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {announcement.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER DE ACCIÓN */}
        <div className="p-4 border-t border-[#333] bg-[#151a21] rounded-b-xl shrink-0 flex justify-between items-center">
          <span className="text-xs text-gray-500 hidden sm:block font-medium">
            Mostrando {announcements.length} anuncio{announcements.length !== 1 ? 's' : ''} nuevo{announcements.length !== 1 ? 's' : ''}
          </span>
          <button 
            onClick={handleClose} 
            className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-6 rounded transition-colors text-sm uppercase tracking-wide shadow-lg"
          >
            Marcar como leídos y cerrar
          </button>
        </div>

      </div>
    </div>
  );
};