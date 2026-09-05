// src/components/molecules/InstallPWABanner.tsx
import React, { useState } from "react";
import { useInstallPWA } from "@hooks/useInstallPWA";
import { Download, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const BannerInstallPWA: React.FC = () => {
  const { canInstall, isInstalling, install } = useInstallPWA();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-20 left-0 right-0 z-9999 mx-auto overflow-hidden border border-white/10 bg-itec-card/85 px-4 py-4 text-white bg-itec-card border-white/10 animate-fade-in-up sm:bottom-6 sm:left-6 sm:right-6 sm:max-w-md sm:rounded-xl sm:px-5 sm:py-5"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-itec-red">
            <Download className="h-6 w-6 text-itec-accent" strokeWidth={2.5} />
          </div>

          <div className="flex-1">
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
          <Button
            onClick={() => setDismissed(true)}
            aria-label="Cerrar banner de instalación"
            variant="danger"
            hierarchy="ghost"
            text={""}
            icon={<X size={18} strokeWidth={2.5} />}
          />

          <Button
            onClick={install}
            isLoading={isInstalling}
            variant="danger"
            hierarchy="solid"
            text={isInstalling ? undefined : "Instalar"}
          />
        </div>
      </div>
    </div>
  );
};
