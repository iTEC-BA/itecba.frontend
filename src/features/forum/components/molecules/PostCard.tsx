import React from 'react';
import { AnonAvatar }             from '../atoms/AnonAvatar';
import { PostMoreMenu }           from '../atoms/PostMoreMenu';
import { RepostIndicator }        from '../atoms/RepostIndicator';
import { RichText }               from '../atoms/RichText';
import { CardThreadFooterActions } from '../atoms/CardThreadFooterActions';
import type { ForumPost }         from '../../types/forum';

const timeAgo = (iso: string): string => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return `${s}s`;
  if (s < 3600)  return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

interface Props {
  post:     ForumPost;
  onVote:   (id: number, v: 1 | -1) => void;
  onRepost: (id: number) => void;
  onDelete: (id: number) => void;
  onClick:  (id: number) => void;
}

export const PostCard: React.FC<Props> = ({ post, onVote, onRepost, onDelete, onClick }) => {
  const handleShare = (id: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/foro/${id}`);
  };

  return (
    <article className="text-xs border-b border-itec-border/50 hover:bg-white/[0.02] transition-colors duration-150">
      {post.is_reposted && post.reposted_by && (
        <RepostIndicator pseudonym={post.reposted_by} />
      )}

      <div className="flex gap-4 px-4 pt-4 pb-3 cursor-pointer" onClick={() => onClick(post.id)}>
        <div className="relative flex w-9 flex-shrink-0 justify-center">
          <AnonAvatar pseudonym={post.pseudonym} size="md" />
          {post.reply_count > 0 && (
            <div className="absolute left-1/2 top-10 bottom-[-1rem] w-px -translate-x-1/2 bg-itec-border/70" />
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-0.5">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <span className="font-semibold text-sm text-itec-text leading-tight truncate">
                {post.pseudonym.split('#')[0]}
              </span>
              <span className="text-itec-muted text-xs font-mono truncate">
                @{(post.pseudonym.split('#')[1] || post.pseudonym).toLowerCase()}
              </span>
              <span className="text-itec-muted text-xs">· {timeAgo(post.created_at)}</span>
            </div>

            {/* More menu — solo renderiza si es autor o admin (el componente lo maneja) */}
            <PostMoreMenu
              postId={post.id}
              isAuthor={!!post.is_author}
              onDelete={onDelete}
              onShare={handleShare}
            />
          </div>

          <RichText
            text={post.body}
            className="text-sm text-itec-text leading-relaxed mb-3 block whitespace-pre-wrap break-words"
          />

          {/* Quoted post */}
          {post.quoted_post && (
            <div
              onClick={e => { e.stopPropagation(); onClick(post.quoted_post!.id); }}
              className="border border-itec-border/50 rounded-xl p-3 mb-2.5 bg-itec-card hover:border-itec-blue-skye/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <AnonAvatar pseudonym={post.quoted_post.pseudonym} size="sm" />
                <span className="text-[8px] font-semibold text-itec-text font-mono">
                  @{post.quoted_post.pseudonym.toLowerCase()}
                </span>
                <span className="text-[8px] text-itec-muted font-mono">
                  · {timeAgo(post.quoted_post.created_at)}
                </span>
              </div>
              <p className="text-xs text-itec-muted leading-relaxed line-clamp-3">
                {post.quoted_post.body}
              </p>
            </div>
          )}

          <CardThreadFooterActions
            post={post}
            onVote={onVote}
            onRepost={onRepost}
            onClick={onClick}
            handleShare={handleShare}
          />
        </div>
      </div>
    </article>
  );
};
