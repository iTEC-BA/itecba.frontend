import React from "react";
import { Circle } from "lucide-react";
import type { InAppNotification } from "../types/notification";

const SOURCE_LABELS: Record<string, string> = {
  news: "Aviso", rewards: "Recompensa", points: "Puntos",
  system: "Sistema", calendar: "Calendario", forum: "Foro",
  benefits: "Beneficio", tutoring: "Tutoría", jobs: "Bolsa IT", auth: "Seguridad",
};

const SOURCE_CLS: Record<string, string> = {
  news:     "bg-blue-500/10 text-blue-400 border-blue-500/15",
  rewards:  "bg-itec-rewards/10 text-itec-rewards border-itec-rewards/15",
  points:   "bg-green-500/10 text-green-400 border-green-500/15",
  system:   "bg-white/5 text-itec-text/50 border-white/8",
  calendar: "bg-purple-500/10 text-purple-400 border-purple-500/15",
};

interface Props {
  item:    InAppNotification;
  onClick: (item: InAppNotification) => void;
}

export const NotificationItem: React.FC<Props> = ({ item, onClick }) => {
  const labelCls  = SOURCE_CLS[item.source]  ?? SOURCE_CLS.system;
  const labelText = SOURCE_LABELS[item.source] ?? item.source;
  const date = new Date(item.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short",
  });

  return (
    <button
      onClick={() => onClick(item)}
      className={`
        w-full text-left px-3 py-3 rounded-xl border transition-colors duration-150 active:scale-[0.99]
        ${!item.read
          ? "bg-white/3 border-white/8"
          : "bg-transparent border-transparent hover:bg-white/2"
        }
      `}
    >
      <div className="flex items-start gap-2.5">
        {/* Dot no leído */}
        <div className="mt-1.5 shrink-0 w-3 flex justify-center">
          {!item.read && (
            <Circle className="size-2 fill-itec-blue-skye text-itec-blue-skye" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Título + fecha */}
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <span className={`text-sm font-semibold leading-snug truncate ${!item.read ? "text-itec-text" : "text-itec-text/50"}`}>
              {item.title}
            </span>
            <span className="text-[10px] text-itec-text/30 shrink-0 whitespace-nowrap">{date}</span>
          </div>

          {/* Preview truncado */}
          <p className="text-xs text-itec-text/45 leading-relaxed line-clamp-2 mb-1.5">
            {item.body}
          </p>

          {/* Badge de fuente */}
          <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${labelCls}`}>
            {labelText}
          </span>
        </div>
      </div>
    </button>
  );
};
