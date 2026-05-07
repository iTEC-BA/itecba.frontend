import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: 'green' | 'blue' | 'red' | 'gold' | 'none';
}

const GLOW: Record<string, string> = {
  green: 'hover:border-itec-groups/40 hover:shadow-[0_0_30px_rgba(0,136,84,0.10)]',
  blue:  'hover:border-itec-blue-skye/40 hover:shadow-[0_0_30px_rgba(0,74,173,0.10)]',
  red:   'hover:border-itec-red/40 hover:shadow-[0_0_30px_rgba(183,18,52,0.10)]',
  gold:  'hover:border-itec-rewards/40 hover:shadow-[0_0_30px_rgba(240,177,0,0.10)]',
  none:  '',
};

export const GroupGlowCard: React.FC<Props> = ({ children, className = '', onClick, glowColor = 'green' }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`bg-itec-box border border-white/[0.07] rounded-2xl transition-all duration-200 ${GLOW[glowColor]} ${onClick ? 'cursor-pointer text-left w-full' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};
