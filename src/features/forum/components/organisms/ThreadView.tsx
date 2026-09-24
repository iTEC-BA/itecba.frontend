import React, { useState } from 'react';
import { ArrowLeft }       from 'lucide-react';
import { AnonAvatar }      from '../atoms/AnonAvatar';
import { VoteButton }      from '../atoms/VoteButton';
import { RichText }        from '../atoms/RichText';
import { ReplyCard }       from '../molecules/ReplyCard';
import { ComposeBox }      from '../atoms/ComposeBox';
import type { ForumPost }  from '../../types/forum';
import { useAuthStore } from '@/stores/authStore';

const timeAgo = (iso: string): string => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return `${s}s`;
  if (s < 3600)  return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

interface Props {
  post:       ForumPost;
  replies:    ForumPost[];
  loading:    boolean;
  onClose:    () => void;
  onVote:     (id: number, v: 1 | -1) => void;
  onRepost:   (id: number) => void;
  onDelete:   (id: number) => void;
  onReply:    (parentId: number, body: string) => Promise<ForumPost>;
  onOpenReply: (id: number) => void;
}

export const ThreadView: React.FC<Props> = ({
  post, replies, loading, onClose, onVote, onRepost, onDelete, onReply, onOpenReply,
}) => {
  const { isAuthenticated } = useAuthStore();
  const [replying,     setReplying]     = useState(false);

  const handleReply = async (body: string) => {
    await onReply(post.id, body);
    setReplying(false);
  };

  return (
    <div className="flex flex-col bg-itec-bg min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-itec-bg/85 backdrop-blur-md border-b border-itec-border/50">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-itec-muted hover:text-itec-text transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-itec-text">Hilo</h1>
      </header>

      {/* Post principal */}
      <div className="px-4 pt-4 pb-3 border-b border-itec-border/50">
        <div className="flex items-start gap-3 mb-3">
          <AnonAvatar pseudonym={post.pseudonym} size="lg" />
          <div>
            <p className="font-bold text-sm text-itec-text">
              {post.pseudonym.split('#')[0]}
            </p>
            <p className="text-xs text-itec-muted font-mono">
              @{(post.pseudonym.split('#')[1] || post.pseudonym).toLowerCase()}
            </p>
          </div>
        </div>
        <RichText
          text={post.body}
          className="text-sm text-itec-text leading-relaxed block whitespace-pre-wrap wrap-break-word mb-3"
        />
        <p className="text-xs text-itec-muted mb-3">{timeAgo(post.created_at)}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 py-3 border-y border-itec-border/50 text-xs text-itec-text">
          <span><strong>{post.reposts || 0}</strong> <span className="text-itec-muted">Reposts</span></span>
          <span><strong>{post.upvotes}</strong> <span className="text-itec-muted">Likes</span></span>
          <span><strong>{post.views || 0}</strong> <span className="text-itec-muted">Vistas</span></span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around py-1 text-itec-muted" onClick={e => e.stopPropagation()}>
          <VoteButton
            upvotes={post.upvotes}
            userVote={post.user_vote ?? 0}
            onVote={v => onVote(post.id, v)}
            disabled={!isAuthenticated}
          />
          <button
            onClick={() => onRepost(post.id)}
            className="p-2 text-itec-muted hover:text-itec-text hover:bg-white/8 rounded-full transition-colors text-xs"
          >
            Repost
          </button>
          {(post.is_author) && (
            <button
              onClick={() => onDelete(post.id)}
              className="p-2 text-itec-muted hover:text-itec-red hover:bg-itec-red/10 rounded-full transition-colors text-xs"
            >
              Eliminar post
            </button>
          )}
        </div>
      </div>

      {/* Respuestas */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 border-2 border-itec-border/50 border-t-itec-red rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1">
          {replies.map((r, i) => (
            <ReplyCard
              key={r.id}
              reply={r}
              isLast={i === replies.length - 1}
              onVote={onVote}
              onDelete={onDelete}
              onOpen={onOpenReply}
            />
          ))}
          {replies.length === 0 && (
            <div className="py-12 text-center text-xs text-itec-muted">
              Sin respuestas aún. Sé el primero.
            </div>
          )}
        </div>
      )}

      {/* Compose reply */}
      {isAuthenticated && (
        replying ? (
          <div className="border-t border-itec-border/50">
            <ComposeBox onSubmit={handleReply} compact />
          </div>
        ) : (
          <div className="border-t border-itec-border/50 px-4 py-3">
            <button
              onClick={() => setReplying(true)}
              className="w-full text-left text-xs text-itec-muted bg-white/4 rounded-xl px-4 py-2.5 hover:bg-white/8 transition-colors border border-itec-border/50"
            >
              Responder al hilo…
            </button>
          </div>
        )
      )}

    </div>
  );
};
