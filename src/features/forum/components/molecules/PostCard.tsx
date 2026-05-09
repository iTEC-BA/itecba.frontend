// src/features/forum/components/molecules/PostCard.tsx
// Tarjeta de post con estética X/Threads. Clic → abre el hilo.
import React, { useState } from "react";
import { MessageSquare, Trash2, MoreHorizontal } from "lucide-react";
import { AnonAvatar }  from "../atoms/AnonAvatar";
import { VoteButton }  from "../atoms/VoteButton";
import type { ForumPost } from "../../types/forum";
import { useAuth }     from "@context/AuthContext";
 
interface PostCardProps {
  post:        ForumPost;
  onOpen?:     (id: number) => void;
  onVote:      (id: number, v: 1 | -1) => void;
  onDelete:    (id: number) => void;
  isThread?:   boolean;
  compact?:    boolean;
}
 
const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)   return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};
 
export const PostCard: React.FC<PostCardProps> = ({
  post, onOpen, onVote, onDelete, isThread = false, compact = false,
}) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
 
  // El ownership real lo valida el backend; el botón "Eliminar"
  // se muestra a cualquier usuario autenticado (el backend rechaza si no es el autor).
  const handleClick = () => {
    if (!isThread && onOpen) onOpen(post.id);
  };
 
  return (
    <article
      onClick={handleClick}
      className={`group relative flex gap-3 px-4 py-3 border-b border-itec-border transition-colors
        ${!isThread ? "cursor-pointer hover:bg-white/[0.02]" : ""}
        ${compact ? "py-2 px-3" : ""}
      `}
    >
      {/* Avatar column */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <AnonAvatar pseudonym={post.pseudonym} size={compact ? "sm" : "md"} />
        {/* Thread line */}
        {isThread && post.reply_count > 0 && (
          <div className="w-px flex-1 min-h-[16px] bg-itec-border mt-1" />
        )}
      </div>
 
      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-itec-text truncate">
            {post.pseudonym}
          </span>
          <span className="text-xs text-itec-muted flex-shrink-0">
            · {timeAgo(post.created_at)}
          </span>
        </div>
 
        {/* Body */}
        <p className={`text-itec-text leading-relaxed whitespace-pre-wrap break-words ${
          compact ? "text-xs" : "text-sm"
        } ${!isThread ? "line-clamp-5" : ""}`}>
          {post.body}
        </p>
 
        {/* Actions bar */}
        <div
          className="flex items-center gap-4 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <VoteButton
            upvotes={post.upvotes}
            userVote={post.user_vote ?? 0}
            onVote={(v) => onVote(post.id, v)}
            disabled={!user}
            compact={compact}
          />
 
          {!isThread && (
            <button
              onClick={(e) => { e.stopPropagation(); if (onOpen) onOpen(post.id); }}
              className="flex items-center gap-1.5 text-xs text-itec-muted hover:text-itec-text transition-colors"
            >
              <MessageSquare size={13} />
              <span>{post.reply_count ?? 0}</span>
            </button>
          )}
        </div>
      </div>
 
      {/* Context menu */}
      {user && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="p-1.5 rounded-full text-itec-muted hover:text-itec-text hover:bg-itec-surface transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-8 z-20 bg-itec-box2 border border-itec-border rounded-xl shadow-glass-lg py-1 min-w-[140px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-itec-accent hover:bg-itec-surface transition-colors"
              >
                <Trash2 size={12} /> Eliminar
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
};
