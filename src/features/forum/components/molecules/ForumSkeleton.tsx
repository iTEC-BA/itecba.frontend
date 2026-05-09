// src/features/forum/components/molecules/ForumSkeleton.tsx
import React from "react";
 
const SkeletonPost: React.FC<{ wide?: boolean }> = ({ wide = false }) => (
  <div className="flex gap-3 px-4 py-3 border-b border-itec-border animate-pulse">
    <div className="w-9 h-9 rounded-full bg-itec-surface flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <div className="h-3 w-28 bg-itec-surface rounded-full" />
        <div className="h-3 w-10 bg-itec-surface rounded-full" />
      </div>
      <div className="h-3 w-full bg-itec-surface rounded-full" />
      <div className={`h-3 bg-itec-surface rounded-full ${wide ? "w-3/4" : "w-1/2"}`} />
      <div className="h-3 w-16 bg-itec-surface rounded-full" />
    </div>
  </div>
);
 
export const ForumSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPost key={i} wide={i % 2 === 0} />
    ))}
  </div>
);
