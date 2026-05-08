import React from "react";
import { Icons } from "@components/ui/icons/Icons";
import type { InboxMessage } from "../../types/rewards";

interface Props {
  msg: InboxMessage;
  onRead: (id: string) => void;
}

export const InboxMessageCard: React.FC<Props> = ({ msg, onRead }) => {
  const date = new Date(msg.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      onClick={() => onRead(msg._id)}
      className={`
        w-full text-left p-4 rounded-2xl border transition-all duration-200 active:scale-[0.98]
        ${
          msg.isRead
            ? "bg-itec-card border-white/5 hover:border-itec-border hover:bg-white/2"
            : "bg-itec-blue/8 border-itec-blue-skye/20 hover:border-itec-blue-skye/40 shadow-[0_0_16px_rgba(0,74,173,0.1)]"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            msg.isRead
              ? "bg-white/5 text-itec-text/30"
              : "bg-itec-blue-skye/15 text-itec-blue-skye"
          }`}
        >
          <Icons type={msg.isRead ? "mail-open" : "mail"} className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span
              className={`text-sm font-bold leading-snug truncate ${
                msg.isRead ? "text-itec-text/60" : "text-itec-text"
              }`}
            >
              {msg.subject}
            </span>
            <span className="text-[10px] text-itec-text/30 shrink-0 mt-0.5 whitespace-nowrap">
              {date}
            </span>
          </div>
          <p className="text-xs text-itec-text/50 leading-relaxed line-clamp-2">
            {msg.content}
          </p>
          {!msg.isRead && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-itec-blue-skye animate-pulse" />
              <span className="text-[10px] text-itec-blue-skye font-bold uppercase tracking-wider">
                Nuevo
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
