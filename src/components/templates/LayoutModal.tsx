import React, { useEffect, useRef } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { Button } from "@/components/ui/Button";

interface LayoutModalProps {
  /** Determina si el modal está visible */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Título del modal */
  title: string;
  /** Descripción o subtítulo (opcional) */
  description?: string;
  /** Ancho máximo del modal en desktop (ej: 'max-w-2xl', 'max-w-lg') */
  maxWidth?: string;
  /** Contenido del modal */
  children: React.ReactNode;
}

export const LayoutModal: React.FC<LayoutModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  maxWidth = "max-w-2xl",
  children,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && onClose()}
      // p-0 en mobile para que pegue abajo, p-4 en desktop
      className="fixed inset-0 z-200 flex items-end sm:items-center justify-center bg-itec-bg  p-0 sm:p-3"
    >
      <div
        className={`w-full sm:${maxWidth} flex flex-col bg-itec-bg border border-itec-border rounded-t-4xl sm:rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-500`}
      >
        {/* Encabezado fijo (Sticky) */}
        <div className="shrink-0 flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {description && (
              <p className="text-xs text-itec-muted mt-1">{description}</p>
            )}
          </div>
          <Button
            onClick={onClose}
            aria-label="Cerrar"
            variant="slate"
            hierarchy="ghost"
            className="h-9 w-9 shrink-0 p-0"
            icon={<Icons type="close" className="w-4 h-4" />}
          >
          </Button>
        </div>

        {/* Cuerpo del modal (Scrollable) */}
        <div className="overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};