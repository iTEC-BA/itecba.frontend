import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: 'red' | 'blue' | 'green' | 'gold' | 'none';
  hover?: boolean;
}

const GLOW: Record<string, string> = {
  red:   'hover:border-itec-red/40 hover:shadow-[0_0_28px_rgba(183,18,52,0.10)]',
  blue:  'hover:border-itec-blue-skye/40 hover:shadow-[0_0_28px_rgba(0,74,173,0.10)]',
  green: 'hover:border-itec-groups/40 hover:shadow-[0_0_28px_rgba(0,136,84,0.10)]',
  gold:  'hover:border-itec-rewards/40 hover:shadow-[0_0_28px_rgba(240,177,0,0.10)]',
  none:  '',
};

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  onClick,
  glow = 'none',
  hover = true,
}) => {
  const Tag = (onClick ? 'button' : 'div') as React.ElementType;
  return (
    <Tag
      onClick={onClick}
      className={[
        'bg-itec-box border border-white/[0.07] rounded-2xl',
        'transition-all duration-200',
        hover ? GLOW[glow] : '',
        onClick ? 'cursor-pointer text-left w-full' : '',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
};
