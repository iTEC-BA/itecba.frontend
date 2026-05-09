import { MessageCircle, Repeat2, Heart, Share2, Eye } from "lucide-react";
import type { ForumPost } from "../../types/forum";

interface FooterProps {
  post: ForumPost;
  onVote: (id: number, v: 1 | -1) => void;
  onRepost: (id: number) => void;
  onClick: (id: number) => void;
  handleShare: (id: number) => void;
}

export const CardThreadFooterActions: React.FC<FooterProps> = ({
  post,
  onVote,
  onRepost,
  onClick,
  handleShare,
}) => {
    
  const fmt = (n: number): string =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}K` : String(n);

  return (
    <div
      className="flex items-center justify-between max-w-xs text-itec-muted mt-1"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => onClick(post.id)}
        className="flex items-center gap-1 group/b hover:text-itec-red transition-colors"
      >
        <div className="p-1.5 group-hover/b:bg-itec-blue/10 rounded-full">
          <MessageCircle size={16} />
        </div>
        <span className="text-xs font-mono">{post.reply_count}</span>
      </button>

      <button
        onClick={() => onRepost(post.id)}
        className={`flex items-center gap-1 group/b transition-colors ${
          post.is_reposted ? "text-itec-red" : "hover:text-itec-red"
        }`}
      >
        <div className="p-1.5 group-hover/b:text-itec-red rounded-full">
          <Repeat2 size={16} />
        </div>
        <span className="text-xs font-mono">{fmt(post.reposts || 0)}</span>
      </button>

      <button
        onClick={() => onVote(post.id, 1)}
        className={`flex items-center gap-1 group/b transition-colors ${
          post.user_vote === 1 ? "text-itec-accent" : "hover:text-itec-red"
        }`}
      >
        <div className="p-1.5 group-hover/b:bg-itec-accent/10 rounded-full">
          <Heart
            size={16}
            fill={post.user_vote === 1 ? "currentColor" : "none"}
          />
        </div>
        <span className="text-xs font-mono">{fmt(post.upvotes)}</span>
      </button>

      <div className="flex items-center gap-1 text-itec-muted/70 hover:text-itec-red">
        <Eye size={14} />
        <span className="text-xs font-mono">{fmt(post.views || 0)}</span>
      </div>

      <button
        onClick={() => handleShare(post.id)}
        className="flex items-center group/b hover:text-itec-sky transition-colors hover:text-itec-red"
      >
        <div className="p-1.5 group-hover/b:bg-itec-sky/10 rounded-full">
          <Share2 size={16} />
        </div>
      </button>
    </div>
  );
};
