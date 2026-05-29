import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<Props> = ({ children, className = '' }) => (
  <h2 className={`text-[10px] font-bold text-itec-gray uppercase tracking-[0.12em] mb-1 ${className}`}>
    {children}
  </h2>
);
