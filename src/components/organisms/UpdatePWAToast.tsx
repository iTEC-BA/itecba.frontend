import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const UpdatePWAToast: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) { console.log('[iTEC PWA] SW registrado:', r); },
    onRegisterError(error) { console.error('[iTEC PWA] Error SW:', error); },
  });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !needRefresh) return null;

  return (
    <div 
      role="alert"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 px-4 py-3 bg-itec-card border border-white/10 rounded-xl animate-in slide-in-from-top-4 fade-in duration-300 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[340px]"
    >
      <div className="shrink-0 w-10 h-10 rounded-xl bg-itec-red-skye/10 flex items-center justify-center border border-itec-red-skye/20">
        <RefreshCw className="w-5 h-5 text-itec-red-skye" strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">Actualización disponible</p>
        <p className="text-xs text-itec-muted mt-0.5 truncate">Recargá para aplicar los cambios.</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="slate" hierarchy="ghost" onClick={() => setNeedRefresh(false)} text="Después" className="px-3 py-2 text-xs" />
        <Button variant="danger" hierarchy="solid" onClick={() => updateServiceWorker(true)} text="Recargar" className="px-4 py-2 text-xs" />
      </div>
    </div>
  );
};
