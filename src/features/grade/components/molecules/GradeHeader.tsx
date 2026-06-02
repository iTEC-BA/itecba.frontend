// GradeHeader.tsx — Cabecera con título y descripción de la carrera (<100 líneas)
import React from 'react';
import type { GradeConfig } from '../../types/grade.types';

interface Props {
  config: GradeConfig;
}

export const GradeHeader: React.FC<Props> = ({ config }) => (
  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-xl mb-4 uppercase tracking-widest">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
      UTN – FRBA
    </div>
    <h1 className="text-3xl lg:text-4xl font-black text-itec-text mb-4 leading-tight">
      {config.titulo}
    </h1>
    <p className="text-gray-400 text-base lg:text-lg leading-relaxed max-w-3xl mb-6">
      {config.descripcion}
    </p>
    <div className="flex flex-wrap gap-3">
      <span className="bg-itec-box border border-itec-gray text-gray-300 text-xs font-bold px-4 py-2 rounded-xl">
        🕐 {config.duracion}
      </span>
      <span className="bg-itec-box border border-itec-gray text-gray-300 text-xs font-bold px-4 py-2 rounded-xl">
        🎓 {config.grado}
      </span>
    </div>
  </div>
);
