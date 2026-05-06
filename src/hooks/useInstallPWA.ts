// src/hooks/useInstallPWA.ts
// Hook para manejar el prompt de instalación de la PWA
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export const useInstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled]     = useState(false);
  const [isInstalling, setIsInstalling]   = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada (modo standalone)
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsInstalled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mq.addEventListener('change', onChange);

    // Capturar el evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detectar instalación completada
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return false;
    setIsInstalling(true);
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        return true;
      }
    } finally {
      setIsInstalling(false);
    }
    return false;
  };

  // canInstall: hay prompt disponible Y no está instalada
  const canInstall = !!installPrompt && !isInstalled;

  return { canInstall, isInstalled, isInstalling, install };
};
