// src/components/molecules/UpdatePWAToast.tsx
// Notificación de nueva versión disponible
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3
                    bg-[#1A1A1A] border border-[#D41313]/40 rounded-xl shadow-xl
                    animate-fade-in max-w-[calc(100vw-2rem)]">
      {/* Ícono */}
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#D41313]/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#D41313]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-white">Nueva versión disponible</p>
        <p className="text-[10px] text-[#9aa3b0]">Recargá para actualizar iTEC BA</p>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setNeedRefresh(false)}
          className="px-2 py-1 rounded text-[11px] text-[#5a6475] hover:text-white transition-colors"
        >
          Más tarde
        </button>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-3 py-1.5 rounded-lg bg-[#D41313] hover:bg-[#b30f0f] text-white text-[11px] font-semibold transition-all active:scale-95"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};
