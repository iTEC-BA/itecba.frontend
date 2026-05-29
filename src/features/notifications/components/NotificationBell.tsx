import React, { useState, useCallback, useRef, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@features/admin/services/adminService";
import { useNotificationCenter } from "../hooks/useNotificationCenter";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { Bell } from "lucide-react";

// ── El panel de detalles se carga en diferido (heavy) ─────────
const NotificationPanel = lazy(() =>
  import("./NotificationPanel").then((m) => ({ default: m.NotificationPanel })),
);

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Fetch de news (fuente in-app) ─────────────────────────
  const { data: rawNews = [] } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: () => adminService.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const { items, unreadCount, markRead, markAllRead } =
    useNotificationCenter(rawNews);
  const push = usePushNotifications();

  // ── Handlers memorizados ──────────────────────────────────
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev && unreadCount > 0) markAllRead();
      return !prev;
    });
  }, [unreadCount, markAllRead]);

  // Cierre al click fuera
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell button ───────────────────────────── */}
      <button
        onClick={toggleOpen}
        className="relative outline-none flex items-center justify-center cursor-pointer"
        aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ""}`}
      >
        {unreadCount > 0 ? (
          <span className="bg-itec-red text-itec-text text-xs size-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : (
          <Bell className="size-4"/>
        )}
      </button>

      {/* ── Panel lazy ───────────────────────────────── */}
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
