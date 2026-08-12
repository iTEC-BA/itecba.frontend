import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle, X } from 'lucide-react';
import { useNotificationBanner } from '@/features/notifications/hooks/useNotificationBanner';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  message: string;
  isCritical?: boolean;
}

export const NotificationBanner: React.FC = () => {
  const { announcements: initialAnnouncements, isLoading } = useNotificationBanner();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Inicializar los avisos (tomamos máximo 5 para el slider)
  useEffect(() => {
    if (initialAnnouncements && initialAnnouncements.length > 0) {
      setAnnouncements(initialAnnouncements.slice(0, 10));
    }
  }, [initialAnnouncements]);

  // Lógica del Slider Automático (Cambia cada 6 segundos)
  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  if (isLoading || announcements.length === 0) return null;

  // Manejar el cierre de un aviso
  const handleDismiss = (id: string) => {
    const filtered = announcements.filter((a) => a.id !== id);
    setAnnouncements(filtered);
    if (currentIndex >= filtered.length) {
      setCurrentIndex(0); // Volver al inicio si borramos el último
    }
  };

  const currentAnn = announcements[currentIndex];
  if (!currentAnn) return null;

  return (
    <div className="relative w-full mb-8">
      {/* Contenedor del Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/5">
        <AnnouncementBanner
          key={currentAnn.id} // El key fuerza el re-render y la animación al cambiar
          title={currentAnn.title}
          message={currentAnn.message}
          isCritical={currentAnn.isCritical}
          onDismiss={() => handleDismiss(currentAnn.id)}
        />
      </div>

      {/* Indicadores del Slider (Puntitos) - Solo si hay más de 1 aviso */}
      {announcements.length > 1 && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {announcements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir al aviso ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-4 bg-itec-text opacity-100'
                  : 'w-1.5 bg-itec-muted opacity-40 hover:opacity-80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── COMPONENTE INTERNO DEL BANNER ──────────────────────────────────────────

interface BannerProps {
  title: string;
  message: string;
  isCritical?: boolean;
  onDismiss: () => void;
}

const AnnouncementBanner: React.FC<BannerProps> = ({ title, message, isCritical, onDismiss }) => {
  const Icon = isCritical ? AlertTriangle : Info;
  
  const iconColorClass = isCritical 
    ? 'bg-itec-red/20 text-itec-red ring-itec-red/30' 
    : 'bg-itec-blue-skye/20 text-itec-blue-skye ring-itec-blue-skye/30';

  return (
    <div className={cn("relative isolate flex items-center justify-between gap-x-6 bg-itec-box px-6 py-3.5 sm:px-4 animate-in fade-in zoom-in-[0.98] duration-500",isCritical ? "bg-itec-red/33" :"bg-itec-blue/33")}>

      {/* ── Contenido del Banner ── */}
      <div className="flex items-center gap-x-3 gap-y-1.5 pr-8">
        {/* Icono Dinámico */}
        <span className={`inline-flex items-center justify-center p-1 rounded-lg ring-1 ${iconColorClass}`}>
          <Icon size={16} strokeWidth={2.5} />
        </span>

        <p className="text-sm text-itec-text flex items-center flex-wrap">
          {/* Título */}
          <strong className="font-bold tracking-wide mr-2 text-md">
            {title}
          </strong>
          {/* Mensaje */}
          <span className="text-itec-text/85 text-xs">
            {message}
          </span>
        </p>
      </div>

      {/* ── Botón de Cerrar ── */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={onDismiss}
          className="p-2 rounded-full text-itec-muted hover:text-white hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
        >
          <span className="sr-only">Cerrar aviso</span>
          <X className="size-4" />
        </button>
      </div>
      
    </div>
  );
};