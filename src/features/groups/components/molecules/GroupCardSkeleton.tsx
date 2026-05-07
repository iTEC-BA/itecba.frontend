import React from 'react';
export const GroupCardSkeleton: React.FC = () => (
  <div className="bg-itec-box border border-white/[0.07] rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
    <div className="flex gap-1.5">
      <div className="h-4 w-16 bg-white/5 rounded-full" />
      <div className="h-4 w-20 bg-white/5 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
    <div className="h-8 bg-white/5 rounded-xl mt-auto" />
  </div>
);
