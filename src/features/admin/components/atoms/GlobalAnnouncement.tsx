import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService, type AnnouncementData } from '../../services/adminService';

// Helper seguro para JSON
const safeParseJSON = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`❌ Error parseando localStorage key "${key}":`, error);
    return fallback;
  }
};

export const GlobalAnnouncement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const { data: activeNews = [], isSuccess, isError } = useQuery({
    queryKey: ['announcements', 'active'],
    queryFn: () => adminService.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  if (isError) console.error("❌ GlobalAnnouncement falló al cargar noticias.");

  useEffect(() => {
    if (isSuccess && Array.isArray(activeNews) && activeNews.length > 0) {
      try {
        const dismissedIds = safeParseJSON('itec_dismissed_news', []);
        const newNews = activeNews.filter(news => news?.isCritical && !dismissedIds.includes(news.id));
        
        if (newNews.length > 0) {
          setAnnouncements(newNews);
          const timer = setTimeout(() => setIsVisible(true), 1500); 
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("❌ Error crítico en el useEffect de GlobalAnnouncement:", error);
      }
    }
  }, [activeNews, isSuccess]);

  const handleDismissCurrent = () => {
    try {
      const currentId = announcements[currentIndex]?.id;
      if (!currentId) return;

      const dismissedIds = safeParseJSON('itec_dismissed_news', []);
      localStorage.setItem('itec_dismissed_news', JSON.stringify([...new Set([...dismissedIds, currentId])]));

      if (currentIndex >= announcements.length - 1) {
        closeWidget();
      } else {
        setIsExiting(true);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsExiting(false);
        }, 300);
      }
    } catch (error) {
      console.error("❌ Error en handleDismissCurrent:", error);
      closeWidget(); // Si falla, cerramos por seguridad
    }
  };

  const handleDismissAll = () => {
    try {
      const dismissedIds = safeParseJSON('itec_dismissed_news', []);
      const newDismissed = [...new Set([...dismissedIds, ...announcements.map(a => a.id)])];
      localStorage.setItem('itec_dismissed_news', JSON.stringify(newDismissed));
    } catch (error) {
      console.error("❌ Error en handleDismissAll:", error);
    }
    closeWidget();
  };

  const closeWidget = () => {
    setIsVisible(false);
    setTimeout(() => {
      setAnnouncements([]);
      setCurrentIndex(0); // Reset index
    }, 400); 
  };

  // 🛡️ PROTECCIÓN DE RENDER: Si algo es undefined, retornamos null
  if (!isVisible || announcements.length === 0) return null;
  const currentAnnouncement = announcements[currentIndex];
  if (!currentAnnouncement) {
    console.warn("⚠️ currentAnnouncement es undefined en el índice:", currentIndex);
    return null;
  }

  // 🛡️ PROTECCIÓN DE FECHA
  let dateObj = new Date();
  try {
    dateObj = currentAnnouncement.createdAt?.toDate 
      ? currentAnnouncement.createdAt.toDate() 
      : new Date(currentAnnouncement.createdAt || Date.now());
  } catch(e) { console.error("Error leyendo fecha", e); }

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999] w-[calc(100%-3rem)] sm:w-[420px] flex flex-col gap-4 pointer-events-none drop-shadow-2xl">
      <div className={`bg-itec-box/95 border border-itec-gray/50 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto transform transition-all duration-300 ease-out ${isExiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0 animate-fade-in'}`}>
        <div className="h-[3px] w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500"></div>
        <button onClick={handleDismissAll} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all outline-none" title="Descartar todos">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5 pr-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>
              <div>
                <h3 className="text-gray-300 text-xs font-bold uppercase tracking-widest">Comunicado Crítico</h3>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                  {dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
                </p>
              </div>
            </div>
            {announcements.length > 1 && (
              <span className="bg-black/40 border border-itec-gray/40 text-itec-text text-[10px] font-bold px-2.5 py-1 rounded-md">
                {currentIndex + 1} / {announcements.length}
              </span>
            )}
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-black text-itec-textmb-2 leading-snug">
              {currentAnnouncement.title || 'Sin Título'}
            </h4>
            <p className="text-sm text-itec-text leading-relaxed font-medium">
              {currentAnnouncement.message || 'Sin Mensaje'}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={handleDismissCurrent} className="flex-1 bg-white hover:bg-gray-200 text-black text-xs font-bold py-3 rounded-xl transition-all outline-none shadow-lg shadow-white/5 active:scale-[0.98]">
              {currentIndex >= announcements.length - 1 ? 'Entendido' : 'Siguiente Aviso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};