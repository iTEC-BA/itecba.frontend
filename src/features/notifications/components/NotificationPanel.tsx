import React, { useCallback } from 'react';
import type { InAppNotification } from '../types/notification';
import type { usePushNotifications } from '../hooks/usePushNotifications';

interface Props {
  items:      InAppNotification[];
  push:       ReturnType<typeof usePushNotifications>;
  onMarkRead: (id: string) => void;
  onClose:    () => void;
}

const sourceLabel: Record<string, string> = {
  news:      'Aviso',
  calendar:  'Calendario',
  benefits:  'Beneficio',
  rewards:   'Recompensa',
  points:    'Puntos',
  forum:     'Foro',
  tutoring:  'Tutoría',
  jobs:      'Bolsa IT',
  auth:      'Seguridad',
  system:    'Sistema',
};

export const NotificationPanel: React.FC<Props> = ({ items, push, onMarkRead, onClose }) => {
  const handleItemClick = useCallback((item: InAppNotification) => {
    onMarkRead(item.id);
    if (item.url) window.location.href = item.url;
    onClose();
  }, [onMarkRead, onClose]);

  return (
    <div className="absolute right-0 w-80 sm:w-96 bg-itec-box border border-itec-box/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-100 animate-in slide-in-from-top-2 fade-in">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-itec-box/20">
        <h3 className="text-itec-text font-bold tracking-wide text-sm">Notificaciones</h3>

        {/* Botón activar push si no está suscrito */}
        {push.isSupported && !push.isSubscribed && push.permission !== 'denied' && (
          <button
            onClick={push.enable}
            disabled={push.isLoading}
            className="text-[10px] font-bold uppercase tracking-widest text-itec-accent hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {push.isLoading ? 'Activando…' : '🔔 Activar push'}
          </button>
        )}
        {push.isSubscribed && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
            ✓ Push activo
          </span>
        )}
        {push.permission === 'denied' && (
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">
            Push bloqueado
          </span>
        )}
      </div>

      {/* Lista */}
      <div className="max-h-[60vh] overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-3xl block mb-2">🎉</span>
            <p className="text-xs font-medium">Sin novedades por ahora.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${!item.read ? 'bg-itec-accent/5' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!item.read && (
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-itec-accent shrink-0" />
                  )}
                  <div className={!item.read ? '' : 'pl-3.5'}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted mb-0.5">
                      {sourceLabel[item.source] ?? item.source}
                    </p>
                    <p className="text-xs font-semibold text-itec-text leading-snug">{item.title}</p>
                    {item.body && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.body}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
