import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  upvotes:   number;
  userVote?: 1 | -1 | 0 | null;
  onVote:    (v: 1 | -1) => void;
  disabled?: boolean;
  compact?:  boolean;
}

export const VoteButton: React.FC<Props> = ({ upvotes, userVote, onVote, disabled, compact }) => {
  const upActive   = userVote === 1;
  const downActive = userVote === -1;

  if (compact) {
    return (
      <button
        onClick={e => { e.stopPropagation(); onVote(1); }}
        disabled={disabled}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-colors ${
          upActive ? 'text-itec-accent' : 'text-itec-muted hover:text-itec-accent'
        } disabled:opacity-40`}
      >
        <ArrowUp size={11} />
        <span>{upvotes}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => onVote(1)} disabled={disabled}
        className={`p-1 rounded-full transition-colors ${
          upActive ? 'text-itec-accent bg-itec-accent/10' : 'text-itec-muted hover:text-itec-accent hover:bg-itec-accent/10'
        } disabled:opacity-40`}
        title="Upvote"
      >
        <ArrowUp size={14} />
      </button>
      <span className="text-xs text-itec-muted font-mono">{upvotes}</span>
      <button
        onClick={() => onVote(-1)} disabled={disabled}
        className={`p-1 rounded-full transition-colors ${
          downActive ? 'text-itec-blue bg-itec-blue/10' : 'text-itec-muted hover:text-itec-blue hover:bg-itec-blue/10'
        } disabled:opacity-40`}
        title="Downvote"
      >
        <ArrowDown size={14} />
      </button>
    </div>
  );
};
