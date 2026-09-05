import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';

export const UpdatePWAToast: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !needRefresh) return null;

  return (
    <div 
      role="alert"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 px-4 py-3
                 bg-itec-bg/95 border border-itec-border rounded-xl shadow-2xl backdrop-blur-md
                 animate-in slide-in-from-top-4 fade-in duration-300 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[340px]"
    >
      <div className="shrink-0 w-10 h-10 rounded-xl bg-itec-blue-skye/10 flex items-center justify-center border border-itec-blue-skye/20">
        <RefreshCw className="w-5 h-5 text-itec-blue-skye" strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          Actualización disponible
        </p>
        <p className="text-xs text-itec-muted mt-0.5 truncate">
          Recargá para aplicar los cambios.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-3 py-2 rounded-xl text-xs font-medium text-itec-muted hover:text-white hover:bg-itec-surface transition-colors focus:outline-none focus:ring-2 focus:ring-itec-border cursor-pointer"
        >
          Después
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-4 py-2 rounded-xl bg-itec-blue-skye hover:bg-itec-blue-skye/90 text-white text-xs font-bold transition-all active:scale-95 focus:outline-none cursor-pointer"
        >
          Recargar
        </button>
      </div>
    </div>
  );
};
