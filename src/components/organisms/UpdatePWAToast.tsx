// src/components/molecules/UpdatePWAToast.tsx
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';

export const UpdatePWAToast: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[iTEC PWA] Service Worker registrado:', r);
    },
    onRegisterError(error) {
      console.error('[iTEC PWA] Error al registrar SW:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div 
      role="alert"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-4 py-3
                 bg-itec-bg/95 border border-itec-border rounded-xl shadow-glass-lg backdrop-blur-md
                 animate-fade-in-down w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[340px]"
    >
      {/* Ícono */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-itec-accent/10 flex items-center justify-center border border-itec-accent/20">
        <RefreshCw className="w-5 h-5 text-itec-accent" strokeWidth={2.5} />
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          Actualización disponible
        </p>
        <p className="text-xs text-itec-muted mt-0.5 truncate">
          Recargá para aplicar los cambios.
        </p>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-3 py-2 rounded-xl text-xs font-medium text-itec-muted hover:text-white hover:bg-itec-surface transition-colors focus:outline-none focus:ring-2 focus:ring-itec-border"
        >
          Después
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-4 py-2 rounded-xl bg-itec-accent hover:bg-itec-accent/90 text-white text-xs font-bold transition-all active:scale-95 shadow-[0_0_15px_rgba(var(--itec-accent-rgb),0.3)] focus:outline-none focus:ring-2 focus:ring-itec-accent/50"
        >
          Recargar
        </button>
      </div>
    </div>
  );
};