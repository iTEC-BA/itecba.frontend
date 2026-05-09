import React from 'react';

export const TrendingBanner: React.FC = () => (
  <div className="mx-4 my-3 px-4 py-3 rounded-2xl bg-itec-red border border-itec-red/20 flex items-center gap-3 cursor-pointer hover:bg-itect-red/12 transition-colors group text-xs">
    <div className="w-10 h-10 rounded-xl bg-itect-red flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
      🎙
    </div>
    <div className="flex-1 min-w-0">
      <span className="flex gap-2 py-0.5 rounded-full bg-itect-red text-white text-[8px] font-bold tracking-wide mb-1">
        <span className="w-3.5 h-3.5 border-2 border-itec-red/30 border-t-white rounded-full animate-spin" />
         EN VIVO
      </span>
      <p className="font-semibold text-itec-text truncate">Foro UTN BA · Tendencias del día</p>
    </div>
    <div className="text-itec-text-reverse ml-auto flex-shrink-0">
      <svg width="22" height="18" viewBox="0 0 22 18" className="animate-pulse">
        <rect x="0" y="6" width="3" height="12" rx="1.5" fill="currentColor" opacity="0.4"/>
        <rect x="5" y="2" width="3" height="16" rx="1.5" fill="currentColor" opacity="0.7"/>
        <rect x="10" y="0" width="3" height="18" rx="1.5" fill="currentColor"/>
        <rect x="15" y="4" width="3" height="14" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="20" y="8" width="2" height="10" rx="1" fill="currentColor" opacity="0.35"/>
      </svg>
    </div>
  </div>
);
