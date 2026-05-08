import React from "react";

interface Props { label: string; isActive: boolean; onClick: () => void; }

export const CategoryPill: React.FC<Props> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 active:scale-95 ${
      isActive
        ? "bg-itec-blue-skye text-white border border-itec-blue-skye"
        : "bg-transparent text-itec-gray border border-itec-border hover:border-white/25 hover:text-itec-text"
    }`}
  >
    {label}
  </button>
);
