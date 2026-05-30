import React from "react";
import type { InAppNotification } from "../types/notification";

const SOURCE_COLORS: Record<string, string> = {
  news:     "bg-blue-500/10 text-blue-400 border-blue-500/15",
  rewards:  "bg-itec-rewards/10 text-itec-rewards border-itec-rewards/15",
  points:   "bg-green-500/10 text-green-400 border-green-500/15",
  system:   "bg-white/5 text-itec-text/50 border-white/8",
  calendar: "bg-purple-500/10 text-purple-400 border-purple-500/15",
  forum:    "bg-pink-500/10 text-pink-400 border-pink-500/15",
};

const SOURCE_LABELS: Record<string, string> = {
  news: "Aviso", rewards: "Recompensa", points: "Puntos",
  system: "Sistema", calendar: "Calendario", forum: "Foro",
  benefits: "Beneficio", tutoring: "Tutoría", jobs: "Bolsa IT", auth: "Seguridad",
};

interface Props {
  item:      InAppNotification;
  onRead:    (id: string) => void;
}

export const NotificationItem: React.FC<Props> = ({ item, onRead }) => {
  const labelCls  = SOURCE_COLORS[item.source]  ?? SOURCE_COLORS.system;
  const labelText = SOURCE_LABELS[item.source] ?? item.source;
  const date = new Date(item.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short",
  });

  return (
    <button
      onClick={() => onRead(item.id)}
      className={`
        w-full text-left p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98]
        ${!item.read
          ? "bg-white/3 border-white/10 shadow-sm"
          : "bg-transparent border-transparent hover:bg-white/2"
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Indicador no leído */}
        <div className="mt-1.5 shrink-0">
          {!item.read
            ? <span className="block w-2 h-2 rounded-full bg-itec-blue-skye animate-pulse" />
            : <span className="block w-2 h-2 rounded-full bg-white/10" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-sm font-bold leading-snug ${!item.read ? "text-itec-text" : "text-itec-text/50"}`}>
              {item.title}
            </span>
            <span className="text-[10px] text-itec-text/30 shrink-0 whitespace-nowrap">{date}</span>
          </div>
          <p className="text-xs text-itec-text/50 leading-relaxed line-clamp-2 mb-2">{item.body}</p>
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${labelCls}`}>
            {labelText}
          </span>
        </div>
      </div>
    </button>
  );
};
