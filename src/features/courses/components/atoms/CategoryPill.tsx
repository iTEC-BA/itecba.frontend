import React from 'react';

interface Props {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryPill: React.FC<Props> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 active:scale-95 ${
      isActive 
        ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] border-none transform -translate-y-0.5' 
        : 'bg-slate-900/50 text-slate-400 border border-white/5 hover:text-white hover:border-sky-500/30 hover:bg-slate-800'
    }`}
  >
    {label}
  </button>
);