import React from "react";
export const UnreadBadge: React.FC<{ count: number; className?: string }> = ({ count, className = "" }) => {
  if (count <= 0) return null;
  return (
    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-itec-red text-white text-[10px] font-bold leading-none animate-in zoom-in-75 duration-200 ${className}`}>
      {count > 99 ? "99+" : count}
    </span>
  );
};
