import React from "react";
export const TypingDots: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-1">
    {[0,1,2].map(i => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }} />
    ))}
  </span>
);
