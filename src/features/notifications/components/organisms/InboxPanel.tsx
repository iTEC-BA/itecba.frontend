import React, { useState } from "react";
import { Mail, Search } from "lucide-react";
import { InboxMessageCard } from "../molecules/InboxMessageCard";
import { PaginationBar } from "@components/ui/PaginationBar";
import { usePagination } from "@hooks/usePagination";
import type { InboxMessage } from "../../types/inbox";

export const InboxPanel: React.FC<{ messages: InboxMessage[]; isLoading: boolean; onRead: (id: string) => void; onReadAll: () => void; }> = ({ messages, isLoading, onRead, onReadAll }) => {
  const [search, setSearch] = useState("");
  const unread = messages.filter((m) => !m.isRead).length;

  const filtered = messages.filter((m) => m.subject.toLowerCase().includes(search.toLowerCase()) || m.content.toLowerCase().includes(search.toLowerCase()));
  const { paged, page, setPage, totalPages, reset } = usePagination(filtered, 6);
  const handleSearch = (v: string) => { setSearch(v); reset(); };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-1 py-3">
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-itec-text/40" />
          <h2 className="text-sm font-bold text-itec-text">Buzón</h2>
        </div>
        {unread > 0 && <button onClick={onReadAll} className="text-[11px] text-itec-rewards font-bold hover:opacity-70">Leer todo</button>}
      </div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-itec-text/30" />
        <input type="text" placeholder="Buscar mensajes..." value={search} onChange={(e) => handleSearch(e.target.value)} className="w-full bg-itec-bg border border-white/8 rounded-xl pl-8 pr-3 py-2.5 text-xs text-itec-text focus:outline-none focus:border-white/20" />
      </div>
      <div className="space-y-2 pb-2">
        {isLoading ? ( <div className="animate-pulse space-y-2">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl"/>)}</div> ) : filtered.length === 0 ? (
          <div className="py-14 text-center text-sm text-itec-text/35">Sin mensajes</div>
        ) : (
          paged.map((msg) => <InboxMessageCard key={msg._id} msg={msg} onRead={onRead} />)
        )}
      </div>
      <PaginationBar page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};
