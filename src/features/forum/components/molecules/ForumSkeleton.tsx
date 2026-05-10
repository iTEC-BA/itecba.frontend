import React from 'react';

const SkeletonPost: React.FC = () => (
  <div className="flex gap-3 px-4 py-3 border-b border-itec-border animate-pulse">
    <div className="w-9 h-9 rounded-full bg-white/8 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <div className="h-3.5 w-28 rounded-full bg-white/8" />
        <div className="h-3.5 w-16 rounded-full bg-white/5" />
      </div>
      <div className="h-3 w-full rounded-full bg-white/8" />
      <div className="h-3 w-4/5 rounded-full bg-white/5" />
      <div className="flex gap-6 mt-1">
        <div className="h-3 w-8 rounded-full bg-white/5" />
        <div className="h-3 w-8 rounded-full bg-white/5" />
        <div className="h-3 w-8 rounded-full bg-white/5" />
      </div>
    </div>
  </div>
);

interface Props { count?: number; }
export const ForumSkeleton: React.FC<Props> = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => <SkeletonPost key={i} />)}
  </div>
);
