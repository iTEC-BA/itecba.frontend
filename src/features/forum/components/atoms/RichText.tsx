import React from 'react';

interface Props {
  text:      string;
  className?: string;
}

const URL_RE  = /(https?:\/\/[^\s]+)/g;
const HASH_RE = /(#\w+)/g;

export const RichText: React.FC<Props> = ({ text, className }) => {
  const parts = text.split(/(https?:\/\/[^\s]+|#\w+)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (URL_RE.test(part)) {
          URL_RE.lastIndex = 0;
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-itec-blue-skye underline underline-offset-2 break-all hover:text-blue-400 transition-colors"
            >
              {part}
            </a>
          );
        }
        if (HASH_RE.test(part)) {
          HASH_RE.lastIndex = 0;
          return (
            <span key={i} className="text-itec-red font-medium">
              {part}
            </span>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
};
