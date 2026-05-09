import React from 'react';

const SkeletonPost: React.FC = () => (
  <div className="flex gap-3 px-4 py-3 border-b border-itec-border animate-pulse">
    <div className="w-9 h-9 rounded-full bg-itec-surface flex-shrink-0" />
    <div className="flex-1 space-y-2 pt-0.5">
      <div className="flex gap-2">
        <div className="h-3 w-24 bg-itec-surface rounded-full" />
        <div className="h-3 w-14 bg-itec-surface rounded-full" />
        <div className="h-3 w-8 bg-itec-surface rounded-full" />
      </div>
      <div className="h-3 w-full bg-itec-surface rounded-full" />
      <div className="h-3 w-4/5 bg-itec-surface rounded-full" />
      <div className="h-3 w-2/5 bg-itec-surface rounded-full" />
      <div className="flex gap-6 pt-1">
        {[1,2,3,4].map(i => <div key={i} className="h-3 w-8 bg-itec-surface rounded-full" />)}
      </div>
    </div>
  </div>
);

export const ForumSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div>{Array.from({ length: count }).map((_, i) => <SkeletonPost key={i} />)}</div>
);
