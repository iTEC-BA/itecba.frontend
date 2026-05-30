import { useState, useEffect, useCallback } from "react";
import { getAuth } from "firebase/auth";
import { inboxService } from "../services/inboxService";
import type { InboxMessage } from "../types/rewards";

export const useInbox = () => {
  const [messages,  setMessages]  = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) return;
      const token = await authUser.getIdToken();
      const data   = await inboxService.getMyMessages(token);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) return;
      const token = await authUser.getIdToken();
      await inboxService.markAsRead(id, token);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
      );
    } catch (err) {
      console.error("Error marcando como leído:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = messages.filter((m) => !m.isRead);
    for (const m of unread) await markAsRead(m._id);
  }, [messages, markAsRead]);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const rewardMessages  = messages.filter((m) => m.category === "reward_reply");
  const generalMessages = messages.filter((m) => m.category !== "reward_reply");

  return { messages, rewardMessages, generalMessages, unreadCount, isLoading, markAsRead, markAllAsRead, refetch: fetchMessages };
};
