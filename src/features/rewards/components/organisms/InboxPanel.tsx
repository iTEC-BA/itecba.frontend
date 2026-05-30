import React, { useState } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { InboxMessageCard } from "../molecules/InboxMessageCard";
import type { InboxMessage } from "../../types/rewards";

interface Props {
  messages:  InboxMessage[];
  isLoading: boolean;
  onRead:    (id: string) => void;
  onReadAll: () => void;
}

const Skeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="h-20 bg-white/3 rounded-2xl animate-pulse" />
    ))}
  </div>
);

export const InboxPanel: React.FC<Props> = ({ messages, isLoading, onRead, onReadAll }) => {
  const [search, setSearch] = useState("");
  const unread   = messages.filter((m) => !m.isRead).length;
  const filtered = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-2">
          <Icons type="mail" className="size-4 text-itec-text/50" />
          <h2 className="text-sm font-bold text-itec-text">Buzón</h2>
          {unread > 0 && (
            <span className="text-[10px] font-bold bg-itec-rewards/10 text-itec-rewards px-2 py-0.5 rounded-full border border-itec-rewards/15">
              {unread} sin leer
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onReadAll}
            className="text-[11px] text-itec-rewards font-bold hover:opacity-70 transition-opacity"
          >
            Leer todo
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-3">
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

      {/* Lista */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-4">
        {isLoading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center">
              <Icons type="mail" className="size-6 text-itec-text/20" />
            </div>
            <p className="text-sm font-bold text-itec-text/40">
              {search ? "Sin resultados" : "Sin mensajes"}
            </p>
            <p className="text-xs text-itec-text/25 max-w-[200px]">
              {search
                ? "Probá con otro término de búsqueda."
                : "Cuando el admin responda tus canjes, aparecerán acá."
              }
            </p>
          </div>
        ) : (
          filtered.map((msg) => (
            <InboxMessageCard key={msg._id} msg={msg} onRead={onRead} />
          ))
        )}
      </div>
    </div>
  );
};
