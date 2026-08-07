import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService, type AnnouncementData } from "../../services/adminService";
import { Card } from "@components/atoms/Card";
import { Button } from "@components/ui/Button";

const safeParseJSON = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const GlobalAnnouncement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const { data: activeNews = [], isSuccess, isError } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: () => adminService.getActiveAnnouncements(),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  if (isError) console.error("GlobalAnnouncement falló al cargar noticias.");

  useEffect(() => {
    if (isSuccess && Array.isArray(activeNews) && activeNews.length > 0) {
      const dismissedIds = safeParseJSON("itec_dismissed_news", []);
      const newNews = activeNews.filter((news) => news?.isCritical && !dismissedIds.includes(news.id));
      if (newNews.length > 0) {
        setAnnouncements(newNews);
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [activeNews, isSuccess]);

  const closeWidget = () => {
    setIsVisible(false);
    setTimeout(() => {
      setAnnouncements([]);
      setCurrentIndex(0);
    }, 350);
  };

  const handleDismissCurrent = () => {
    const currentId = announcements[currentIndex]?.id;
    if (!currentId) return;

    const dismissedIds = safeParseJSON("itec_dismissed_news", []);
    localStorage.setItem("itec_dismissed_news", JSON.stringify([...new Set([...dismissedIds, currentId])]));

    if (currentIndex >= announcements.length - 1) {
      closeWidget();
    } else {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsExiting(false);
      }, 220);
    }
  };

  const handleDismissAll = () => {
    const dismissedIds = safeParseJSON("itec_dismissed_news", []);
    const newDismissed = [...new Set([...dismissedIds, ...announcements.map((a) => a.id)])];
    localStorage.setItem("itec_dismissed_news", JSON.stringify(newDismissed));
    closeWidget();
  };

  if (!isVisible || announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentIndex];
  if (!currentAnnouncement) return null;

  let dateObj = new Date();
  try {
    if (typeof currentAnnouncement.createdAt === "object" && currentAnnouncement.createdAt?.toDate) {
      dateObj = currentAnnouncement.createdAt.toDate();
    } else if (typeof currentAnnouncement.createdAt === "string" || typeof currentAnnouncement.createdAt === "number") {
      dateObj = new Date(currentAnnouncement.createdAt);
    }
  } catch {}

  return (
    <div className="fixed bottom-5 right-5 z-[60] w-[calc(100%-2.5rem)] sm:w-[420px]">
      <Card className={`p-4 sm:p-5 shadow-xl ${isExiting ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"} transition-all duration-300`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Comunicado crítico</p>
            <h3 className="mt-1 truncate text-sm font-bold text-itec-text">{currentAnnouncement.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-itec-muted">{currentAnnouncement.message}</p>
          </div>
          <button
            onClick={closeWidget}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-itec-border bg-itec-surface text-itec-muted transition-all hover:bg-itec-box hover:text-itec-text"
          >
            ×
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-itec-border bg-itec-surface px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-itec-muted">
            {dateObj.toLocaleDateString()}
          </span>
          <span className="rounded-full border border-itec-accent/20 bg-itec-accent/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-itec-accent">
            Crítico
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" hierarchy="outline" onClick={handleDismissCurrent}>
              Omitir
            </Button>
            <Button variant="danger" hierarchy="solid" onClick={handleDismissAll}>
              Cerrar todo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
