// src/components/molecules/InstallPWABanner.tsx
import React, { useState } from "react";
import { useInstallPWA } from "@hooks/useInstallPWA";
import { Download, X } from "lucide-react"; // Asumo que usas lucide-react por el contexto previo, si no, puedes mantener los SVG.

export const BannerInstallPWA: React.FC = () => {
  const { canInstall, isInstalling, install } = useInstallPWA();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-row items-center justify-between gap-4 px-5 py-4
                 bg-itec-bg border-t border-itec-border shadow-glass-lg backdrop-blur-md
                 sm:bottom-6 sm:left-auto sm:right-6 sm:rounded-2xl sm:max-w-md sm:border sm:border-itec-border sm:shadow-glass-lg
                 animate-fade-in-up"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Ícono usando la paleta itec-accent (asumiendo que es tu rojo) */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-itec-accent/10 flex items-center justify-center border border-itec-accent/20">
          <Download className="w-6 h-6 text-itec-accent" strokeWidth={2.5} />
        </div>

        {/* Texto mejorado y truncado para móviles */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">
            Instalá iTEC BA
          </p>
          <p className="text-xs text-itec-muted mt-0.5 truncate hidden sm:block">
            Accedé más rápido, usalo offline y recibí notificaciones.
          </p>
          <p className="text-xs text-itec-muted mt-0.5 truncate sm:hidden">
            Experiencia app nativa.
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar banner de instalación"
          className="p-2 rounded-full text-itec-muted hover:text-white hover:bg-itec-surface transition-colors focus:outline-none focus:ring-2 focus:ring-itec-border"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <button
          onClick={install}
          disabled={isInstalling}
          className="px-4 py-2 rounded-xl bg-itec-accent hover:bg-itec-accent/90 active:scale-95
                     text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-wait
                     shadow-[0_0_15px_rgba(var(--itec-accent-rgb),0.3)] focus:outline-none focus:ring-2 focus:ring-itec-accent/50
                     flex items-center justify-center min-w-[80px]"
        >
          {isInstalling ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Instalar"
          )}
        </button>
      </div>
    </div>
  );
};
