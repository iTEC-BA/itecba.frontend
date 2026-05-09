import React from 'react';

interface Props { text: string; className?: string; }

export const RichText: React.FC<Props> = ({ text, className = '' }) => {
  const parts = text.split(/(#\w+|@\w+)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('#')) return <span key={i} className="text-cyan-400 hover:underline cursor-pointer">{part}</span>;
        if (part.startsWith('@')) return <span key={i} className="text-purple-400 hover:underline cursor-pointer">{part}</span>;
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
};
