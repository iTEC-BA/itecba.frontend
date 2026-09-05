import React, { useEffect, useState } from "react";
import { Bell, Database, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import { LayoutModal } from "@/components/templates/LayoutModal";

export const PermissionPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isSupported, permission, enable, isLoading } = usePushNotifications();

  useEffect(() => {
    // Si soporta notificaciones y nunca se le preguntó, mostramos el modal
    if (isSupported && permission === "default") {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleRequestPermissions = async () => {
    try {
      await enable();
      if (navigator.storage && navigator.storage.persist) {
        await navigator.storage.persist();
      }
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
    } finally {
      setIsVisible(false); 
    }
  };

  return (
    <LayoutModal
      isOpen={isVisible}
      onClose={() => setIsVisible(false)}
      title="¡No te pierdas nada!"
      description="Habilitá los permisos para que iTEC BA funcione al 100% en tu dispositivo."
      maxWidth="max-w-sm"
    >
      <div className="flex flex-col items-center p-6 text-center">
        {/* Mascota con la ruta correcta */}
        <img
          src="/mascot/TEC-Saludando.webp"
          alt="Mascota iTEC"
          className="w-28 h-28 object-contain mb-6 drop-shadow-xl"
          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/logo.png"; }}
        />

        <div className="flex flex-col gap-3 w-full mb-6 text-left">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="p-2 bg-itec-red-skye/10 text-itec-red-skye rounded-lg shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Notificaciones</p>
              <p className="text-[10px] text-itec-muted">Alertas de materias y avisos UTN.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Modo Offline</p>
              <p className="text-[10px] text-itec-muted">Guardado de datos para uso sin internet.</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleRequestPermissions} 
          isLoading={isLoading}
          variant="danger" 
          hierarchy="solid" 
          fullWidth 
          className="py-3"
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          Habilitar Permisos
        </Button>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="cursor-pointer mt-4 text-[10px] font-bold text-itec-muted hover:text-white uppercase tracking-widest transition-colors"
        >
          Quizás más tarde
        </button>
      </div>
    </LayoutModal>
  );
};
