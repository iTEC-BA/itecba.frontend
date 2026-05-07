import React from 'react';

export const ResourceCardSkeleton: React.FC = () => (
  <div className="animate-pulse rounded-2xl border border-itec-gray/30 bg-itec-box p-4 flex gap-4 items-start">
    <div className="w-10 h-10 rounded-xl bg-itec-gray/20 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-itec-gray/20 rounded w-3/4" />
      <div className="h-2.5 bg-itec-gray/10 rounded w-1/2" />
      <div className="h-2 bg-itec-gray/10 rounded w-1/3" />
    </div>
    <div className="w-20 h-8 bg-itec-gray/20 rounded-xl shrink-0" />
  </div>
);
