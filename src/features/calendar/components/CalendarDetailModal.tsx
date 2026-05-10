import React from "react";
import { LayoutModal } from "@components/templates/LayoutModal";
import { CalendarEvent, EventType } from "../hooks/useCalendarEvents";

interface TypeConfig {
  label: string;
  color: string;
  dot: string;
}

interface Props {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  typeConfig: Record<EventType, TypeConfig>;
}

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

export const CalendarDetailModal: React.FC<Props> = ({
  isOpen, event, onClose, typeConfig,
}) => {
  if (!event) return null;

  const cfg = typeConfig[event.type];
  const d   = new Date(event.date + "T00:00:00");

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={event.title}
      maxWidth="max-w-lg"
    >
      <div className="p-6 flex flex-col gap-4">
        {/* Badge de tipo */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold w-fit ${cfg.color}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2 text-[#9aa3b0] text-sm">
          {/* Calendar icon inline */}
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/>
          </svg>
          <span>
            {d.getDate()} de {MONTHS[d.getMonth()]} de {d.getFullYear()}
          </span>
        </div>

        {/* Subtítulo */}
        {event.subtitle && (
          <p className="text-xs text-[#5a6475] -mt-1">{event.subtitle}</p>
        )}

        {/* Descripción */}
        {event.description ? (
          <p className="text-sm text-itec-text leading-relaxed">
            {event.description}
          </p>
        ) : (
          <p className="text-sm text-[#5a6475] italic">
            Sin descripción adicional.
          </p>
        )}
      </div>
    </LayoutModal>
  );
};
