// src/features/notifications/components/atoms/Toast.tsx
// Sistema de toasts global: "Agregado", "Eliminado", "Error", etc.
// Uso:  const { toast } = useToast();
//       toast.success("Materia creada");
//       toast.error("Error al eliminar");

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id:        string;
  type:      ToastType;
  message:   string;
  duration?: number;
}

interface ToastContextValue {
  toast: {
    success: (message: string, duration?: number) => void;
    error:   (message: string, duration?: number) => void;
    info:    (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
};

const TOAST_CONFIG: Record<
  ToastType,
  { icon: React.ReactNode; containerCls: string; iconCls: string }
> = {
  success: {
    icon:         <CheckCircle className="size-4 shrink-0" />,
    containerCls: "border-emerald-500/30 bg-emerald-500/10",
    iconCls:      "text-emerald-400",
  },
  error: {
    icon:         <XCircle className="size-4 shrink-0" />,
    containerCls: "border-red-500/30 bg-red-500/10",
    iconCls:      "text-red-400",
  },
  info: {
    icon:         <Info className="size-4 shrink-0" />,
    containerCls: "border-blue-500/30 bg-blue-500/10",
    iconCls:      "text-blue-400",
  },
  warning: {
    icon:         <Info className="size-4 shrink-0" />,
    containerCls: "border-amber-500/30 bg-amber-500/10",
    iconCls:      "text-amber-400",
  },
};

const ToastCard: React.FC<{ item: ToastItem; onDismiss: (id: string) => void }> = ({
  item,
  onDismiss,
}) => {
  const cfg = TOAST_CONFIG[item.type];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(item.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl border
        shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl
        text-itec-text text-sm font-medium
        transition-all duration-300 ease-out
        ${cfg.containerCls}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
      `}
    >
      <span className={cfg.iconCls}>{cfg.icon}</span>
      <span className="flex-1 leading-snug">{item.message}</span>
      <button
        onClick={dismiss}
        className="text-itec-text/40 hover:text-itec-text/80 transition-colors shrink-0"
        aria-label="Cerrar"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const push = useCallback((type: ToastType, message: string, duration = 3200) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (m: string, d?: number) => push("success", m, d),
    error:   (m: string, d?: number) => push("error",   m, d),
    info:    (m: string, d?: number) => push("info",    m, d),
    warning: (m: string, d?: number) => push("warning", m, d),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-label="Notificaciones"
        className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastCard item={item} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
