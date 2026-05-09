import React from 'react';

interface Props { label: string; variant?: 'muted' | 'blue' | 'amber' | 'accent'; }
const V = {
  muted:  'bg-itec-surface text-itec-muted',
  blue:   'bg-itec-blue/15 text-itec-sky',
  amber:  'bg-amber-500/15 text-amber-400',
  accent: 'bg-itec-accent/15 text-itec-accent',
};
export const ForumBadge: React.FC<Props> = ({ label, variant = 'muted' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${V[variant]}`}>
    {label}
  </span>
);
