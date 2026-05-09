// src/features/forum/components/atoms/VoteButton.tsx
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
 
interface VoteButtonProps {
  upvotes:   number;
  userVote?: 1 | -1 | 0 | null;
  onVote:    (v: 1 | -1) => void;
  disabled?: boolean;
  compact?:  boolean;
}
 
export const VoteButton: React.FC<VoteButtonProps> = ({
  upvotes, userVote, onVote, disabled, compact,
}) => {
  const upActive   = userVote === 1;
  const downActive = userVote === -1;
 
  if (compact) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onVote(1); }}
        disabled={disabled}
        className={`flex items-center gap-1 text-xs transition-colors ${
          upActive
            ? "text-itec-amber"
            : "text-itec-muted hover:text-itec-text"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
        title="Votar"
      >
        <ArrowUp size={14} />
        <span>{upvotes}</span>
      </button>
    );
  }
 
  return (
    <div className="flex items-center gap-0.5 bg-itec-box2 rounded-full px-1 py-0.5">
      <button
        onClick={(e) => { e.stopPropagation(); onVote(1); }}
        disabled={disabled}
        title="Upvote"
        className={`p-1 rounded-full transition-colors ${
          upActive
            ? "text-itec-amber bg-itec-amber/10"
            : "text-itec-muted hover:text-itec-amber hover:bg-itec-amber/10"
        } disabled:opacity-40`}
      >
        <ArrowUp size={14} />
      </button>
      <span className={`text-xs font-semibold min-w-[1.5ch] text-center ${
        upActive ? "text-itec-amber" : downActive ? "text-itec-blue" : "text-itec-text"
      }`}>
        {upvotes}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onVote(-1); }}
        disabled={disabled}
        title="Downvote"
        className={`p-1 rounded-full transition-colors ${
          downActive
            ? "text-itec-blue bg-itec-blue/10"
            : "text-itec-muted hover:text-itec-blue hover:bg-itec-blue/10"
        } disabled:opacity-40`}
      >
        <ArrowDown size={14} />
      </button>
    </div>
  );
};
