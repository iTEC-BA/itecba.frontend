import React from 'react';

type DotColor = 'red' | 'green' | 'blue' | 'gold';

const DOT_CLASSES: Record<DotColor, string> = {
  red:   'bg-itec-red   shadow-[0_0_7px_rgba(183,18,52,0.9)]',
  green: 'bg-itec-groups shadow-[0_0_7px_rgba(0,136,84,0.9)]',
  blue:  'bg-itec-blue-skye shadow-[0_0_7px_rgba(0,74,173,0.9)]',
  gold:  'bg-itec-rewards shadow-[0_0_7px_rgba(240,177,0,0.9)]',
};

export const GlowDot: React.FC<{ color?: DotColor; className?: string }> = ({
  color = 'green',
  className = '',
}) => (
  <span
    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${DOT_CLASSES[color]} ${className}`}
  />
);
