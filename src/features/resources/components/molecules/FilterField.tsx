import React from 'react';

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const FilterField: React.FC<Props> = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-1.5">
      {label}
    </label>
    {children}
  </div>
);
