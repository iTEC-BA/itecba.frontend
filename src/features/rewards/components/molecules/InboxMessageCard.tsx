import React, { useState } from "react";
import { Mail, MailOpen, ChevronDown, ChevronUp, Medal } from "lucide-react";
import { MarkdownContent } from "@components/ui/MarkdownContent";
import type { InboxMessage } from "../../types/rewards";

interface Props { msg: InboxMessage; onRead: (id: string) => void; }

export const InboxMessageCard: React.FC<Props> = ({ msg, onRead }) => {
  const [expanded, setExpanded] = useState(false);
  const isReward = msg.category === "reward_reply";

  const date = new Date(msg.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const handleToggle = () => {
    setExpanded((p) => !p);
    if (!msg.isRead) onRead(msg._id);
  };

  return (
    <div
      className={`
        rounded-xl border transition-colors duration-150
        ${msg.isRead
          ? "bg-transparent border-white/6"
          : isReward
            ? "bg-itec-rewards/4 border-itec-rewards/18"
            : "bg-white/3 border-white/8"
        }
      `}
    >
      {/* Cabecera — siempre visible */}
      <button onClick={handleToggle} className="w-full text-left p-4">
        <div className="flex items-start gap-3">
          {/* Ícono */}
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            msg.isRead
              ? "bg-white/4 text-itec-text/30"
              : isReward
                ? "bg-itec-rewards/12 text-itec-rewards"
                : "bg-itec-blue-skye/12 text-itec-blue-skye"
          }`}>
            {msg.isRead
              ? <MailOpen className="size-4" />
              : <Mail className="size-4" />
            }
          </div>

          <div className="flex-1 min-w-0">
            {/* Asunto + fecha */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className={`text-sm font-semibold leading-snug truncate ${msg.isRead ? "text-itec-text/55" : "text-itec-text"}`}>
                {msg.subject}
              </span>
              <span className="text-[10px] text-itec-text/30 shrink-0 whitespace-nowrap">{date}</span>
            </div>

            {/* Preview truncado cuando está cerrado */}
            {!expanded && (
              <p className="text-xs text-itec-text/45 leading-relaxed line-clamp-2">
                {msg.content}
              </p>
            )}

            {/* Tags */}
            <div className="flex items-center gap-2 mt-2">
              {!msg.isRead && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-itec-blue-skye uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-itec-blue-skye animate-pulse inline-block" />
                  Nuevo
                </span>
              )}
              {isReward && msg.rewardTitle && (
                <span className="flex items-center gap-1 text-[10px] bg-itec-rewards/8 text-itec-rewards px-2 py-0.5 rounded-full border border-itec-rewards/12 font-medium">
                  <Medal className="size-3" />
                  {msg.rewardTitle}
                </span>
              )}
              <span className="ml-auto text-itec-text/25">
                {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Contenido expandido con markdown */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/5">
          <div className="pt-3">
            <MarkdownContent content={msg.content} />
          </div>
        </div>
      )}
    </div>
  );
};
