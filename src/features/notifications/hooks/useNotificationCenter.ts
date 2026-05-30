import { useState, useCallback, useMemo } from "react";
import type { InAppNotification } from "../types/notification";

const STORAGE_KEY = "itec_notifications_v2";

const loadSeen = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
};

const saveSeen = (ids: Set<string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
};

interface CenterState {
  items:       InAppNotification[];
  unreadCount: number;
  markRead:    (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationCenter = (
  rawNews: Array<{
    id?:        string;
    title?:     string;
    /** AnnouncementData usa "message", InAppNotification usa "body" */
    body?:      string;
    message?:   string;
    createdAt?: Date | { toDate?: () => Date } | string;
  }> = []
): CenterState => {
  const [seenIds, setSeenIds] = useState<Set<string>>(loadSeen);

  const items = useMemo<InAppNotification[]>(() => {
    return rawNews
      .filter((n) => n?.id)
      .map((n) => {
        let createdAtString: string;
        if (typeof n.createdAt === "string") {
          createdAtString = n.createdAt;
        } else if (n.createdAt instanceof Date) {
          createdAtString = n.createdAt.toISOString();
        } else if (n.createdAt?.toDate) {
          createdAtString = n.createdAt.toDate().toISOString();
        } else {
          createdAtString = new Date().toISOString();
        }

        return {
          id:        n.id!,
          source:    "news" as const,
          title:     n.title ?? "Aviso iTEC",
          /* Soporta tanto "body" (InAppNotification) como "message" (AnnouncementData) */
          body:      n.body ?? n.message ?? "",
          url:       "/",
          createdAt: createdAtString,
          read:      seenIds.has(n.id!),
          priority:  "normal" as const,
        };
      });
  }, [rawNews, seenIds]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const markRead = useCallback((id: string) => {
    setSeenIds((prev) => {
      const next = new Set(prev).add(id);
      saveSeen(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    const allIds = new Set(items.map((i) => i.id));
    setSeenIds(allIds);
    saveSeen(allIds);
  }, [items]);

  return { items, unreadCount, markRead, markAllRead };
};
