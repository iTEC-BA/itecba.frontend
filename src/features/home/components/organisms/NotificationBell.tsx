import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService} from '@/features/admin/services/adminService';

// Helper seguro
const safeParseJSON = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    return fallback;
  }
};

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: activeNews = [], isError } = useQuery({
    queryKey: ['announcements', 'active'],
    queryFn: () => adminService.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 5,
  });

  if(isError) console.error("❌ NotificationBell no pudo cargar datos.");

  useEffect(() => {
    try {
      if (Array.isArray(activeNews) && activeNews.length > 0) {
        const seenIds = safeParseJSON('itec_seen_notifications', []);
        const unread = activeNews.filter(news => news?.id && !seenIds.includes(news.id));
        setUnreadCount(unread.length);
      } else {
        setUnreadCount(0);
      }
    } catch(e) {
      console.error("❌ Error calculando notificaciones no leídas", e);
    }
  }, [activeNews]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    try {
      setIsOpen(!isOpen);
      if (!isOpen && unreadCount > 0) {
        const allIds = activeNews.map(n => n.id).filter(Boolean); // filtra undefined
        localStorage.setItem('itec_seen_notifications', JSON.stringify(allIds));
        setUnreadCount(0);
      }
    } catch(e) {
      console.error("❌ Error abriendo dropdown de notificaciones", e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2.5 bg-itec-surface/50 border border-white/5 rounded-xl hover:bg-white/5 transition-colors outline-none flex items-center justify-center cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-itec-bg shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-bounce-short">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-itec-surface/90 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100] animate-in slide-in-from-top-2 fade-in">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h3 className="text-white font-bold tracking-wide">Notificaciones</h3>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Activas</span>
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {(!Array.isArray(activeNews) || activeNews.length === 0) ? (
              <div className="p-8 text-center text-gray-500 opacity-80">
                <span className="text-3xl block mb-2">🎉</span>
                <p className="text-xs font-medium">No hay novedades por ahora.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-white/5">
                {activeNews.map(news => {
                  if (!news) return null; // Fallback
                  let dateObj = new Date();
                  try {
                    dateObj = news.createdAt?.toDate ? news.createdAt.toDate() : new Date(news.createdAt || Date.now());
                  } catch(e){}

                  return (
                    <div key={news.id} className="p-4 hover:bg-white/[0.03] transition-colors relative group cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {news.isCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,1)]"></span>}
                          <h4 className={`text-sm font-bold truncate ${news.isCritical ? 'text-white' : 'text-gray-200'}`}>
                            {news.title || 'Aviso'}
                          </h4>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium shrink-0">
                          {dateObj.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {news.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};