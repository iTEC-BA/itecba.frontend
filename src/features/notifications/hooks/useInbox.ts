import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from '@/stores/authStore';
import { inboxService } from "../services/inboxService";
import type { InboxMessage } from "../types/inbox";

export const useInbox = () => {
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await inboxService.getMyMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setIsLoading(false); return; }
    fetchMessages();
  }, [authLoading, isAuthenticated, fetchMessages]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await inboxService.markAsRead(id);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
    } catch (err) {
      console.error("Error marcando como leído:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = messages.filter((m) => !m.isRead);
    for (const m of unread) await markAsRead(m._id);
  }, [messages, markAsRead]);

  const unreadCount = messages.filter((m) => !m.isRead).length;
  return { messages, unreadCount, isLoading, markAsRead, markAllAsRead, refetch: fetchMessages };
};
