import React from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import type { InAppNotification } from "../types/notification";

interface Props {
  items:        InAppNotification[];
  isLoading:    boolean;
  onMarkRead:   (id: string) => void;
  onMarkAll:    () => void;
}

const Skeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-16 bg-white/3 rounded-2xl animate-pulse" />
    ))}
  </div>
);

export const NotificationsPanel: React.FC<Props> = ({ items, isLoading, onMarkRead, onMarkAll }) => {
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header del fichero */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-itec-text/50" />
          <h2 className="text-sm font-bold text-itec-text">Notificaciones</h2>
          {unread > 0 && (
            <span className="text-[10px] font-bold bg-itec-blue-skye/15 text-itec-blue-skye px-2 py-0.5 rounded-full">
              {unread} nuevas
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAll}
            className="text-[11px] text-itec-blue-skye font-bold hover:opacity-70 transition-opacity"
          >
            Marcar todo
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto space-y-1 pb-4">
        {isLoading ? (
          <Skeleton />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center">
              <Bell className="size-6 text-itec-text/20" />
            </div>
            <p className="text-sm font-bold text-itec-text/40">Sin notificaciones</p>
            <p className="text-xs text-itec-text/25 max-w-[200px]">
              Acá aparecerán los avisos del equipo de ITEC.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <NotificationItem key={item.id} item={item} onRead={onMarkRead} />
          ))
        )}
      </div>
    </div>
  );
};
