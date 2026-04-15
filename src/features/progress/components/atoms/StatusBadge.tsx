import React from 'react';

interface Props { status: 'aprobada' | 'regular' | 'disponible' | 'bloqueada'; }

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const styles = {
    aprobada: 'bg-green-500/10 text-green-500 border-green-500/20',
    regular: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20',
    disponible: 'bg-itec-blue/10 text-itec-blue-skye border-itec-blue/20',
    bloqueada: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  const labels = { aprobada: 'Aprobada', regular: 'Regular', disponible: 'Disponible', bloqueada: 'Bloqueada' };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};