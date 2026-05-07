// src/components/molecules/InstallPWABanner.tsx
// Banner de instalación PWA — estilo iTEC (rojo/negro)
import React, { useState } from 'react';
import { useInstallPWA } from '@hooks/useInstallPWA';

export const InstallPWABanner: React.FC = () => {
  const { canInstall, isInstalling, install } = useInstallPWA();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center gap-3 px-4 py-3
                 bg-[#1A1A1A] border-t border-[#D41313]/40 shadow-[0_-4px_24px_rgba(212,19,19,0.15)]
                 sm:bottom-4 sm:left-4 sm:right-auto sm:rounded-xl sm:max-w-sm sm:border sm:border-[#D41313]/40"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      {/* Ícono */}
      <div className="shrink-0 w-10 h-10 rounded-lg bg-[#D41313]/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#D41313]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v13M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-white leading-tight">
          Instalá iTEC BA
        </p>
        <p className="text-[11px] text-[#9aa3b0] mt-0.5">
          Accedé como una app, sin navegador
        </p>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar"
          className="p-1.5 rounded-lg text-[#5a6475] hover:text-white hover:bg-[#333] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </button>

        <button
          onClick={install}
          disabled={isInstalling}
          className="px-3 py-1.5 rounded-lg bg-[#D41313] hover:bg-[#b30f0f] active:scale-95
                     text-white text-[12px] font-semibold transition-all disabled:opacity-60
                     disabled:cursor-not-allowed"
        >
          {isInstalling ? 'Instalando...' : 'Instalar'}
        </button>
      </div>
    </div>
  );
};