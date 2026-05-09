import React from "react";
import { ArrowLeft } from "lucide-react";
import { ComposeBox } from "../atoms/ComposeBox";
import { ForumSkeleton } from "../molecules/ForumSkeleton";
import type { ForumPost } from "../../types/forum";
import { MessageCircle } from "lucide-react";
import { CardThread } from "../molecules/CardThread";
import { useAuth } from "@/context/AuthContext";

interface Props {
  post: ForumPost;
  replies: ForumPost[];
  loading: boolean;
  onClose: () => void;
  onVote: (id: number, v: 1 | -1) => void;
  onRepost: (id: number) => void;
  onDelete: (id: number) => void;
  onReply: (parentId: number, body: string) => Promise<void>;
}

export const ThreadView: React.FC<Props> = ({
  post,
  replies,
  loading,
  onClose,
  onVote,
  onRepost,
  onDelete,
  onReply,
}) => {
  const handleReply = (body: string) => onReply(post.id, body);
  const {isAuthenticated} = useAuth()

  return (
    <div className="flex flex-col bg-itec-bg text-xs">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-itec-bg/90 backdrop-blur-md border-b border-itec-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-itec-text transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="font-bold text-itec-text">Publicación</span>
      </div>
      {/* Publicacion Principal */}
      <CardThread
        post={post}
        onVote={onVote}
        onRepost={onRepost}
        onDelete={onDelete}
      />
      
      {/* Composer para responder */}
      {isAuthenticated && <ComposeBox onSubmit={handleReply} compact />}

      {/* Replies */}
      {loading ? (
        <ForumSkeleton count={3} />
      ) : (
        <div>
          {replies.map((r) => (
            <CardThread
              post={r}
              onVote={onVote}
              onRepost={onRepost}
              onDelete={onDelete}
            />
          ))}
          {replies.length === 0 && <NoThread />}
        </div>
      )}
    </div>
  );
};

const NoThread = () => {
  return (
    <div className="flex flex-col items-center py-12 gap-3 text-center px-4">
      <MessageCircle size={32} className="text-itec-muted opacity-30" />
      <p className="text-itec-muted text-xs">Sé el primero en responder.</p>
    </div>
  );
};
