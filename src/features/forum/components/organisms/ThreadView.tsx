import React, { useState } from 'react';
import { ArrowLeft }       from 'lucide-react';
import { AnonAvatar }      from '../atoms/AnonAvatar';
import { VoteButton }      from '../atoms/VoteButton';
import { RichText }        from '../atoms/RichText';
import { ReplyCard }       from '../molecules/ReplyCard';
import { ComposeBox }      from '../atoms/ComposeBox';
import type { ForumPost }  from '../../types/forum';
import { useAuth }         from '@context/AuthContext';

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
  onReply:    (parentId: number, body: string) => Promise<void>;
}

export const ThreadView: React.FC<Props> = ({
  post, replies, loading, onClose, onVote, onRepost, onDelete, onReply,
}) => {
  const { isAuthenticated } = useAuth();
  const [replying, setReplying] = useState(false);

  const handleReply = async (body: string) => {
    await onReply(post.id, body);
    setReplying(false);
  };

  return (
    <div className="flex flex-col bg-itec-bg min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-itec-bg/85 backdrop-blur-md border-b border-itec-border">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-itec-muted hover:text-itec-text transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-itec-text">Hilo</h1>
      </header>

      {/* Post principal */}
      <article className="px-4 pt-4 pb-3 border-b border-itec-border">
        <div className="flex items-start gap-3">
          <AnonAvatar pseudonym={post.pseudonym} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-itec-text">{post.pseudonym.split('#')[0]}</span>
              <span className="text-xs text-itec-muted font-mono">@{(post.pseudonym.split('#')[1] || post.pseudonym).toLowerCase()}</span>
            </div>
            <p className="text-xs text-itec-muted mt-0.5">{timeAgo(post.created_at)}</p>
          </div>
        </div>

        <RichText
          text={post.body}
          className="block mt-3 text-base text-itec-text leading-relaxed whitespace-pre-wrap break-words"
        />

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-itec-border/50 text-xs text-itec-muted">
          <span><strong className="text-itec-text font-semibold">{post.reposts}</strong> reposts</span>
          <span><strong className="text-itec-text font-semibold">{post.upvotes}</strong> likes</span>
          <span><strong className="text-itec-text font-semibold">{post.reply_count}</strong> respuestas</span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4 mt-3" onClick={e => e.stopPropagation()}>
          <VoteButton
            upvotes={post.upvotes}
            userVote={post.user_vote ?? 0}
            onVote={v => onVote(post.id, v)}
            disabled={!isAuthenticated}
          />
          {isAuthenticated && (
            <button
              onClick={() => setReplying(r => !r)}
              className="text-xs text-itec-muted hover:text-itec-text transition-colors"
            >
              {replying ? 'Cancelar' : 'Responder'}
            </button>
          )}
          <button
            onClick={() => onRepost(post.id)}
            className={`text-xs transition-colors ${post.is_reposted ? 'text-itec-red' : 'text-itec-muted hover:text-itec-text'}`}
          >
            {post.is_reposted ? 'Reposteado' : 'Repostear'}
          </button>
        </div>
      </article>

      {/* Compose reply */}
      {replying && isAuthenticated && (
        <div className="border-b border-itec-border">
          <ComposeBox onSubmit={handleReply} compact />
        </div>
      )}

      {/* Replies */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-5 h-5 border-2 border-itec-border border-t-white rounded-full animate-spin" />
        </div>
      ) : replies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <span className="text-3xl opacity-20">💬</span>
          <p className="text-sm text-itec-muted">Sin respuestas todavía</p>
          {isAuthenticated && (
            <button
              onClick={() => setReplying(true)}
              className="text-xs text-itec-red hover:underline mt-1"
            >
              Sé el primero en responder
            </button>
          )}
        </div>
      ) : (
        <div>
          {replies.map((reply, i) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              isLast={i === replies.length - 1}
              onVote={onVote}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
