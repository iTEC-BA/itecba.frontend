// GradeMateriaRow.tsx — Fila de materia con estilo itec-card
import React from 'react';
import type { Materia } from '../../types/grade.types';

interface Props {
  materia: Materia;
  /** Nombre oficial enriquecido desde la DB (opcional) */
  nombreDB?: string;
}

export const GradeMateriaRow: React.FC<Props> = ({ materia, nombreDB }) => (
  <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-itec-card transition-colors border border-transparent hover:border-itec-border">
    <span className="text-[11px] font-mono font-bold text-itec-blue-skye bg-itec-blue/10 border border-itec-blue-skye/20 px-2 py-1 rounded-md min-w-[52px] text-center flex-shrink-0 mt-0.5">
      {materia.codigo}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-itec-text leading-snug">
        {nombreDB || materia.nombre}
      </p>
      {(materia.correlativasCursada?.length || materia.correlativasAprobada?.length) ? (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {materia.correlativasCursada?.map(c => (
            <span key={c} className="text-[10px] bg-itec-blue/10 text-itec-blue-skye border border-itec-blue-skye/15 px-1.5 py-0.5 rounded font-mono">
              Cursar: {c}
            </span>
          ))}
          {materia.correlativasAprobada?.map(c => (
            <span key={c} className="text-[10px] bg-itec-red/10 text-itec-red-skye border border-itec-red/15 px-1.5 py-0.5 rounded font-mono">
              Aprobar: {c}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[10px] text-itec-description mt-1 block">Sin correlativas previas</span>
      )}
    </div>
  </div>
);
