// src/features/forum/components/molecules/ReplyCard.tsx
// Tarjeta de respuesta con líneas conectoras (estilo Threads)
import React from "react";
import { AnonAvatar } from "../atoms/AnonAvatar";
import { VoteButton } from "../atoms/VoteButton";
import { Trash2 }     from "lucide-react";
import type { ForumPost } from "../../types/forum";
import { useAuth }    from "@context/AuthContext";
 
interface ReplyCardProps {
  reply:      ForumPost;
  isLast:     boolean;
  onVote:     (id: number, v: 1 | -1) => void;
  onDelete:   (id: number) => void;
}
 
const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};
 
export const ReplyCard: React.FC<ReplyCardProps> = ({
  reply, isLast, onVote, onDelete,
}) => {
  const { user } = useAuth();
 
  return (
    <div className="flex gap-3 px-4 py-3 group hover:bg-white/[0.015] transition-colors">
      {/* Línea conectora + Avatar */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-px ${isLast ? "h-4" : "h-full"} bg-itec-border`} />
        <AnonAvatar pseudonym={reply.pseudonym} size="sm" />
        {!isLast && <div className="w-px flex-1 bg-itec-border mt-1" />}
      </div>
 
      {/* Contenido */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-itec-text">{reply.pseudonym}</span>
          <span className="text-xs text-itec-muted">· {timeAgo(reply.created_at)}</span>
        </div>
        <p className="text-sm text-itec-text leading-relaxed whitespace-pre-wrap break-words">
          {reply.body}
        </p>
        <div
          className="flex items-center gap-4 mt-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <VoteButton
            upvotes={reply.upvotes}
            userVote={reply.user_vote ?? 0}
            onVote={(v) => onVote(reply.id, v)}
            disabled={!user}
            compact
          />
          {user && (
            <button
              onClick={() => onDelete(reply.id)}
              className="opacity-0 group-hover:opacity-100 text-itec-muted hover:text-itec-accent transition-all"
              title="Eliminar"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
