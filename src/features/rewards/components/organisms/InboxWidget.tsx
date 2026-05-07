import React, { useState, useEffect, useCallback } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { InboxMessageCard } from "../molecules/InboxMessageCard";
import { EmptyState } from "../atoms/EmptyState";
import { inboxService } from "../../services/inboxService";
import type { InboxMessage } from "../../types/rewards";
import { getAuth } from "firebase/auth";

export const InboxWidget: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const authUser = getAuth().currentUser;
      if (!authUser) return;
      const token = await authUser.getIdToken();
      const data = await inboxService.getMyMessages(token);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleRead = async (id: string) => {
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
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const filtered = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-itec-card border border-white/5 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-itec-blue-skye/12 border border-itec-blue-skye/20 flex items-center justify-center">
            <Icons type="mail" className="size-4 text-itec-blue-skye" />
          </div>
          <div>
            <p className="text-sm font-bold text-itec-text leading-none">Buzón</p>
            {unreadCount > 0 && (
              <p className="text-[10px] text-itec-blue-skye font-bold mt-0.5">
                {unreadCount} sin leer
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-itec-blue-skye text-white text-[10px] font-black">
              {unreadCount}
            </span>
          )}
          <button
            onClick={() => setIsExpanded((p) => !p)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/4 hover:bg-white/8 text-itec-text/50 transition-colors"
          >
            <Icons
              type={isExpanded ? "chevron-up" : "chevron-down"}
              className="size-4"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="px-4 py-3 border-b border-white/5">
            <div className="relative">
              <Icons
                type="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-itec-text/30"
              />
              <input
                type="text"
                placeholder="Buscar mensajes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-itec-bg border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-xs text-itec-text placeholder:text-itec-text/30 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>

          <div className="p-3 space-y-2 max-h-[60vh] lg:max-h-[480px] overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/3 rounded-xl animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <EmptyState
                emoji="📭"
                title="Sin mensajes"
                subtitle="Aquí aparecerán los avisos del equipo de ITEC."
              />
            ) : (
              filtered.map((msg) => (
                <InboxMessageCard key={msg._id} msg={msg} onRead={handleRead} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
