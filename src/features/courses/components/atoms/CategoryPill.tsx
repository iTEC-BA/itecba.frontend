import React from "react";

interface Props { label: string; isActive: boolean; onClick: () => void; }

export const CategoryPill: React.FC<Props> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`shrink-0 px-5 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-colors ${
      isActive
        ? "bg-itec-section-courses text-white border border-itec-section-courses"
        : "bg-itec-sidebar text-itec-gray border border-itec-border hover:border-itec-section-courses hover:text-itec-text"
    }`}
  >
    {label}
  </button>
);
