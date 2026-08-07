// src/features/notifications/components/molecules/NotificationDetailModal.tsx
// Modal de detalle de una notificación in-app.
// Usa LayoutModal + Icons del proyecto para consistencia global.
import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import { MarkdownContent } from "@components/ui/MarkdownContent";
import { LayoutModal } from "@components/templates/LayoutModal";
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
  const labelCls = SOURCE_CLS[item.source] ?? SOURCE_CLS.system;
  const labelText = SOURCE_LABELS[item.source] ?? item.source;
  const dateStr = formatDate(item.createdAt);

  return (
    <LayoutModal isOpen onClose={onClose} title={item.title} maxWidth="max-w-lg">
      {/* Meta: fuente + fecha */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/6">
        <span
          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${labelCls}`}
        >
          {labelText}
        </span>
        <div className="flex items-center gap-1.5">
          <Icons type="calendar" className="w-3.5 h-3.5 text-itec-text/30" />
          <span className="text-[11px] text-itec-text/40 capitalize">
            {dateStr}
          </span>
        </div>
      </div>

      {/* Contenido markdown */}
      <div className="px-5 py-4 max-h-[50vh] overflow-y-auto">
        <MarkdownContent content={item.body} />
      </div>
    </LayoutModal>
  );
};
