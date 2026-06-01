// src/features/notifications/components/molecules/NotificationDetailModal.tsx
// Modal de detalle de una notificación in-app.
// Usa Icons del proyecto (no lucide-react directamente) para consistencia.
import React, { useEffect } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { MarkdownContent } from "@components/ui/MarkdownContent";
import type { InAppNotification } from "../../types/notification";

const SOURCE_LABELS: Record<string, string> = {
  news: "Aviso",
  rewards: "Recompensa",
  points: "Puntos",
  system: "Sistema",
  calendar: "Calendario",
  forum: "Foro",
  benefits: "Beneficio",
  tutoring: "Tutoría",
  jobs: "Bolsa IT",
  auth: "Seguridad",
};

const SOURCE_CLS: Record<string, string> = {
  news: "bg-blue-500/10 text-blue-400 border-blue-500/15",
  rewards: "bg-itec-rewards/10 text-itec-rewards border-itec-rewards/15",
  points: "bg-green-500/10 text-green-400 border-green-500/15",
  system: "bg-white/5 text-itec-text/50 border-white/8",
  calendar: "bg-purple-500/10 text-purple-400 border-purple-500/15",
};

interface Props {
  item: InAppNotification;
  onClose: () => void;
}

/** Formatea la fecha de la notificación en español. */
const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const NotificationDetailModal: React.FC<Props> = ({ item, onClose }) => {
  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const labelCls = SOURCE_CLS[item.source] ?? SOURCE_CLS.system;
  const labelText = SOURCE_LABELS[item.source] ?? item.source;
  const dateStr = formatDate(item.createdAt);

  return (
    <div
      className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center bg-black/60 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-itec-card border border-white/8 rounded-t-3xl sm:rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-white/6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0 mt-0.5">
              <Icons type="bell" className="w-4 h-4 text-itec-text/50" />
            </div>
            <div>
              <span
                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1.5 ${labelCls}`}
              >
                {labelText}
              </span>
              <h2 className="text-sm font-bold text-itec-text leading-snug">
                {item.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/8 text-itec-text/40 hover:text-itec-text hover:border-white/16 transition-colors shrink-0 ml-2"
          >
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/6">
          <Icons type="calendar" className="w-3.5 h-3.5 text-itec-text/30" />
          <span className="text-[11px] text-itec-text/40 capitalize">
            {dateStr}
          </span>
        </div>

        {/* Contenido markdown */}
        <div className="px-5 py-4 max-h-[50vh] overflow-y-auto">
          <MarkdownContent content={item.body} />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-white/8 text-xs font-bold text-itec-text/60 hover:text-itec-text hover:border-white/16 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
