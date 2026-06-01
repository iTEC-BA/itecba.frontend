// src/components/molecules/InstallPWABanner.tsx
import React, { useState } from "react";
import { useInstallPWA } from "@hooks/useInstallPWA";
import { Download, Sparkles, X } from "lucide-react";

export const BannerInstallPWA: React.FC = () => {
  const { canInstall, isInstalling, install } = useInstallPWA();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 z-[9999] mx-auto overflow-hidden border border-white/10 bg-slate-950/85 px-4 py-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-fade-in-up sm:bottom-6 sm:left-6 sm:right-6 sm:max-w-md sm:rounded-3xl sm:px-5 sm:py-5"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-itec-accent/20 via-transparent to-cyan-400/10" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-30 rounded-full bg-itec-accent/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-itec-accent/25 bg-itec-accent/15 shadow-[0_0_28px_rgba(var(--itec-accent-rgb),0.22)]">
            <Download className="h-6 w-6 text-itec-accent" strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
              <Sparkles className="h-3 w-3 text-itec-accent" />
              App recomendada
            </div>
            <p className="text-base font-semibold tracking-tight text-white sm:text-lg">
              Instalá iTEC BA
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">
              Accedé más rápido, usalo offline y recibí notificaciones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <button
            onClick={() => setDismissed(true)}
            aria-label="Cerrar banner de instalación"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-itec-accent/50"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <button
            onClick={install}
            disabled={isInstalling}
            className="inline-flex min-w-28 items-center justify-center rounded-full bg-gradient-to-r from-itec-accent to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(var(--itec-accent-rgb),0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(var(--itec-accent-rgb),0.45)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-itec-accent/60"
          >
            {isInstalling ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Instalar ahora"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
