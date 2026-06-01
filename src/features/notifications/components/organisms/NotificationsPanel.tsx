import React, { useState } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "../molecules/NotificationItem";
import { NotificationDetailModal } from "../molecules/NotificationDetailModal";
import { PaginationBar } from "@components/ui/PaginationBar";
import { usePagination } from "@hooks/usePagination";
import type { InAppNotification } from "../../types/notification";

interface Props {
  items:      InAppNotification[];
  isLoading:  boolean;
  onMarkRead: (id: string) => void;
  onMarkAll:  () => void;
}

const Skeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-16 bg-white/3 rounded-xl animate-pulse" />
    ))}
  </div>
);

export const NotificationsPanel: React.FC<Props> = ({ items, isLoading, onMarkRead, onMarkAll }) => {
  const [selected, setSelected] = useState<InAppNotification | null>(null);
  const unread = items.filter((n) => !n.read).length;
  const { paged, page, setPage, totalPages } = usePagination(items, 8);

  const handleClick = (item: InAppNotification) => {
    onMarkRead(item.id);
    setSelected(item);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-itec-text/40" />
          <h2 className="text-sm font-bold text-itec-text">Notificaciones</h2>
          {unread > 0 && (
            <span className="text-[10px] font-bold bg-itec-blue-skye/10 text-itec-blue-skye px-2 py-0.5 rounded-full border border-itec-blue-skye/15">
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
      <div className="space-y-1 pb-2">
        {isLoading ? (
          <Skeleton />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center">
              <Bell className="size-5 text-itec-text/20" />
            </div>
            <p className="text-sm font-bold text-itec-text/35">Sin notificaciones</p>
            <p className="text-xs text-itec-text/25 max-w-[200px]">
              Acá aparecerán los avisos del equipo de ITEC.
            </p>
          </div>
        ) : (
          paged.map((item) => (
            <NotificationItem key={item.id} item={item} onClick={handleClick} />
          ))
        )}
      </div>

      <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />

      {/* Modal de detalle */}
      {selected && (
        <NotificationDetailModal
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};
