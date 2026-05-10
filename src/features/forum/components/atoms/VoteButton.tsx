import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  upvotes:  number;
  userVote: number;
  onVote:   (v: 1 | -1) => void;
  disabled?: boolean;
  compact?:  boolean;
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}K` : String(n);

export const VoteButton: React.FC<Props> = ({ upvotes, userVote, onVote, disabled, compact }) => (
  <div className={`flex items-center gap-${compact ? '1' : '2'}`}>
    <button
      disabled={disabled}
      onClick={() => onVote(1)}
      className={`flex items-center gap-1 transition-colors ${
        userVote === 1 ? 'text-itec-red' : 'text-itec-muted hover:text-itec-red'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <Heart size={compact ? 13 : 15} fill={userVote === 1 ? 'currentColor' : 'none'} />
      <span className={`font-mono ${compact ? 'text-[11px]' : 'text-xs'}`}>{fmt(upvotes)}</span>
    </button>
  </div>
);
