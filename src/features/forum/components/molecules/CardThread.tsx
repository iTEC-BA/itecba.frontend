import { AnonAvatar } from "../atoms/AnonAvatar";
import { RichText } from "../atoms/RichText";
import { Heart, Repeat2, Share2, Eye, MessageCircle } from "lucide-react";
import type { ForumPost } from "../../types/forum";
import { PostMoreMenu } from "../atoms";

export const CardThread = ({
  post,
  onVote,
  onRepost,
  onDelete,
}: {
  post: ForumPost;
  onVote: (id: number, v: 1) => void;
  onRepost: (id: number) => void;
  onDelete: (id: number) => void;
}) => {

  const timeAgo = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleString("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fmt = (n: number): string =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}K` : String(n);

  return (
    <div className="px-4 pt-4 pb-3 border-b border-itec-border text-xs">
      <div className="flex items-start gap-3 mb-3">
        <AnonAvatar pseudonym={post.pseudonym} size="lg" />
        <div>
          <p className="font-bold text-itec-text">
            {post.pseudonym.split("#")[0]}
          </p>
          <p className="text-itec-muted font-mono">
            @{(post.pseudonym.split("#")[1] || post.pseudonym).toLowerCase()}
          </p>
        </div>
      </div>

      <RichText
        text={post.body}
        className="text-itec-text leading-relaxed block whitespace-pre-wrap wrap-break-word mb-3"
      />

      <p className="text-itec-muted mb-3">{timeAgo(post.created_at)}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 py-3 border-y border-itec-border text-itec-text">
        <span>
          <strong className="font-bold">{fmt(post.reposts || 0)}</strong>{" "}
          <span className="text-itec-muted">Reposts</span>
        </span>
        <span>
          <strong className="font-bold">{fmt(post.upvotes)}</strong>{" "}
          <span className="text-itec-muted">Likes</span>
        </span>
        <span>
          <strong className="font-bold">{fmt(post.views || 0)}</strong>{" "}
          <span className="text-itec-muted">Vistas</span>
        </span>
      </div>

      {/* Actions */}
      <div
        className="flex items-center justify-around py-1 text-itec-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="p-2 hover:text-itec-blue hover:bg-itec-blue/10 rounded-full transition-colors">
          <MessageCircle size={20} />
        </button>
        <button
          onClick={() => onRepost(post.id)}
          className={`p-2 rounded-full transition-colors ${post.is_reposted ? "text-emerald-400" : "hover:text-emerald-400 hover:bg-emerald-500/10"}`}
        >
          <Repeat2 size={20} />
        </button>
        <button
          onClick={() => onVote(post.id, 1)}
          className={`p-2 rounded-full transition-colors ${post.user_vote === 1 ? "text-itec-accent" : "hover:text-itec-accent hover:bg-itec-accent/10"}`}
        >
          <Heart
            size={20}
            fill={post.user_vote === 1 ? "currentColor" : "none"}
          />
        </button>
        <button className="p-2 hover:text-itec-sky hover:bg-itec-sky/10 rounded-full transition-colors">
          <Eye size={20} />
        </button>
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.location.origin}/foro/${post.id}`,
            )
          }
          className="p-2 hover:text-itec-sky hover:bg-itec-sky/10 rounded-full transition-colors"
        >
          <Share2 size={20} />
        </button>
      </div>
      <PostMoreMenu
        postId={post.id}
        onDelete={onDelete}
        onShare={(id) =>
          navigator.clipboard.writeText(`${window.location.origin}/foro/${id}`)
        }
      />
    </div>
  );
};
