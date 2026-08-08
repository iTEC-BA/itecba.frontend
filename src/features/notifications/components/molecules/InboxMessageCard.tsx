import React from "react";
import type { InboxMessage } from "../../types/inbox";
import { Mail, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const InboxMessageCard: React.FC<{ msg: InboxMessage; onRead: (id: string) => void }> = ({ msg, onRead }) => {
  return (
    <div 
      onClick={() => !msg.isRead && onRead(msg._id)}
      className={cn(
        "flex flex-col gap-2 p-4 rounded-xl border transition-all cursor-pointer",
        msg.isRead ? "bg-white/[0.02] border-white/5 opacity-70" : "bg-itec-box border-itec-border shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {msg.isRead ? <MailOpen className="size-4 text-itec-text/40" /> : <Mail className="size-4 text-itec-sky" />}
          <h4 className={cn("text-sm font-bold truncate", msg.isRead ? "text-itec-text/60" : "text-itec-text")}>{msg.subject}</h4>
        </div>
        <span className="text-[10px] text-itec-muted whitespace-nowrap">
          {new Date(msg.createdAt).toLocaleDateString("es-AR")}
        </span>
      </div>
      <p className={cn("text-xs leading-relaxed line-clamp-3", msg.isRead ? "text-itec-text/40" : "text-itec-text/80")}>
        {msg.content}
      </p>
    </div>
  );
};
