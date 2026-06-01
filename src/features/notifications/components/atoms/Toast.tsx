// src/features/notifications/components/atoms/Toast.tsx
// Toast global: Provider + hook. Envolver la app (o la página) con <ToastProvider>.
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

// ── Tipos ─────────────────────────────────────────────────────────────────
type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id:      string;
  message: string;
  variant: ToastVariant;
}

interface ToastAPI {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  warning: (msg: string) => void;
  info:    (msg: string) => void;
}

interface ToastContextValue {
  toast: ToastAPI;
}

// ── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ── Íconos por variante ────────────────────────────────────────────────────
const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle  className="size-4 shrink-0 text-emerald-400" />,
  error:   <XCircle      className="size-4 shrink-0 text-red-400"     />,
  warning: <AlertCircle  className="size-4 shrink-0 text-yellow-400"  />,
  info:    <AlertCircle  className="size-4 shrink-0 text-blue-400"    />,
};

const BORDER: Record<ToastVariant, string> = {
  success: "border-emerald-500/30",
  error:   "border-red-500/30",
  warning: "border-yellow-500/30",
  info:    "border-blue-500/30",
};

// ── Componente individual ──────────────────────────────────────────────────
const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast, onDismiss,
}) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-itec-box border ${BORDER[toast.variant]} shadow-2xl max-w-sm text-sm text-itec-text animate-in slide-in-from-bottom-2 fade-in duration-300`}>
    {ICONS[toast.variant]}
    <p className="flex-1 font-medium">{toast.message}</p>
    <button
      onClick={() => onDismiss(toast.id)}
      className="text-itec-gray hover:text-itec-text transition-colors"
      aria-label="Cerrar notificación"
    >
      <X className="size-3.5" />
    </button>
  </div>
);

// ── Provider ───────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message: string, variant: ToastVariant) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, variant }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const toast: ToastAPI = {
    success: (msg) => show(msg, "success"),
    error:   (msg) => show(msg, "error"),
    warning: (msg) => show(msg, "warning"),
    info:    (msg) => show(msg, "info"),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Portal de toasts — fijo en la esquina */}
      <div className="fixed bottom-20 right-4 z-500 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
};
