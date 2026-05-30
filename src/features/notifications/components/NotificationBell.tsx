import React, { useState, useCallback, useRef, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@features/admin/services/adminService";
import { useNotificationCenter } from "../hooks/useNotificationCenter";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useUnreadCount } from "@features/rewards/hooks/useUnreadCount";
import { Bell } from "lucide-react";

const NotificationPanel = lazy(() =>
  import("./NotificationPanel").then((m) => ({ default: m.NotificationPanel }))
);

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: rawNews = [] } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: () => adminService.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 5,
  });

  const { items, unreadCount, markRead, markAllRead } = useNotificationCenter(rawNews);
  const inboxUnread = useUnreadCount();
  const totalUnread = unreadCount + inboxUnread;

  const push = usePushNotifications();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev && unreadCount > 0) markAllRead();
      return !prev;
    });
  }, [unreadCount, markAllRead]);

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleOpen}
        className="relative outline-none flex items-center justify-center cursor-pointer"
        aria-label={`Notificaciones${totalUnread > 0 ? ` (${totalUnread} sin leer)` : ""}`}
      >
        {totalUnread > 0 ? (
          <span className="bg-itec-red text-itec-text text-xs size-5 flex items-center justify-center rounded-full">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        ) : (
          <Bell className="size-4" />
        )}
      </button>

      {isOpen && (
        <Suspense
          fallback={
            <div className="absolute right-0 w-80 sm:w-96 bg-itec-box border border-itec-box/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 z-100">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-xl bg-white/5" />
                ))}
              </div>
            </div>
          }
        >
          <NotificationPanel
            items={items}
            push={push}
            onMarkRead={markRead}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
