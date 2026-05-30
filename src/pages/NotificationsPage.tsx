import React, { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Mail } from "lucide-react";
import { MainLayout } from "@components/templates/MainLayout";
import { usePageTitle } from "@hooks/usePageTitle";
import { useNotificationCenter } from "@features/notifications/hooks/useNotificationCenter";
import { adminService } from "@features/admin/services/adminService";
import { useInbox } from "@features/rewards/hooks/useInbox";
import { SectionTab, type TabId } from "@features/notifications/components/SectionTab";
import { UnreadBadge } from "@features/rewards/components/atoms/UnreadBadge";

const NotificationsPanel = lazy(() =>
  import("@features/notifications/components/NotificationsPanel").then((m) => ({
    default: m.NotificationsPanel,
  }))
);

const InboxPanel = lazy(() =>
  import("@features/rewards/components/organisms/InboxPanel").then((m) => ({
    default: m.InboxPanel,
  }))
);

const PanelSkeleton = () => (
  <div className="space-y-2 pt-2 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-16 rounded-xl bg-white/4" />
    ))}
  </div>
);

export const NotificationsPage: React.FC = () => {
  usePageTitle("Notificaciones");
  const [activeTab, setActiveTab] = useState<TabId>("notifications");

  /* Notificaciones in-app */
  const { data: rawNews = [] } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: () => adminService.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 5,
  });
  const { items, unreadCount, markRead, markAllRead } = useNotificationCenter(rawNews);

  /* Buzón */
  const {
    messages,
    unreadCount: inboxUnread,
    isLoading:   inboxLoading,
    markAsRead,
    markAllAsRead,
  } = useInbox();

  const totalUnread = unreadCount + inboxUnread;

  const tabs = [
    { id: "notifications" as TabId, label: "Avisos", icon: <Bell className="size-3.5" />,  count: unreadCount },
    { id: "inbox"         as TabId, label: "Buzón",  icon: <Mail className="size-3.5" />,  count: inboxUnread },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {/* Encabezado */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <div className="relative">
            <Bell className="size-5 text-itec-text/60" />
            {totalUnread > 0 && (
              <UnreadBadge count={totalUnread} className="absolute -top-2 -right-2" />
            )}
          </div>
          <h1 className="text-lg font-bold text-itec-text">Notificaciones</h1>
        </div>

        {/* Tabs */}
        <SectionTab active={activeTab} tabs={tabs} onChange={setActiveTab} />

        {/* Panel activo */}
        <Suspense fallback={<PanelSkeleton />}>
          {activeTab === "notifications" ? (
            <NotificationsPanel
              items={items}
              isLoading={false}
              onMarkRead={markRead}
              onMarkAll={markAllRead}
            />
          ) : (
            <InboxPanel
              messages={messages}
              isLoading={inboxLoading}
              onRead={markAsRead}
              onReadAll={markAllAsRead}
            />
          )}
        </Suspense>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
