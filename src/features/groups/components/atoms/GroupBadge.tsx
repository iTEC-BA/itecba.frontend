import React from 'react';

type BadgeVariant = 'nivel' | 'tipo' | 'carrera' | 'count';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  nivel:   'bg-itec-groups/12 text-emerald-400 border-itec-groups/20',
  tipo:    'bg-itec-blue-skye/12 text-blue-400 border-itec-blue-skye/20',
  carrera: 'bg-white/5 text-itec-gray border-white/10',
  count:   'bg-itec-red/12 text-itec-red border-itec-red/20',
};

export const GroupBadge: React.FC<{
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}> = ({ children, variant = 'nivel', className = '' }) => (
  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${VARIANT_CLASSES[variant]} ${className}`}>
    {children}
  </span>
);
