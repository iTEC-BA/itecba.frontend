import React from 'react';
import { ESPECIALIDADES_DB } from '@data/specialties';

interface Props { onSpecialtyClick: (val: string) => void; }

export const SpecialtyGrid: React.FC<Props> = ({ onSpecialtyClick }) => (
  <div className="animate-in fade-in duration-500 pb-8">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1.5 h-5 bg-itec-groups rounded-full" />
      <h3 className="text-xs font-bold text-itec-gray uppercase tracking-widest">Explorar por especialidad</h3>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
      {ESPECIALIDADES_DB.map((esp, i) => (
        <button
          key={i}
          onClick={() => onSpecialtyClick(esp.carreraValue)}
          className={`group relative bg-itec-box border border-white/[0.07] rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden ${esp.colorClass} hover:border-current`}
        >
          <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300" />
          <div className="w-12 h-12 rounded-xl bg-itec-bg border border-white/5 flex items-center justify-center text-lg font-black text-itec-text group-hover:scale-105 transition-transform duration-200 mb-2.5 shadow-inner">
            {esp.code}
          </div>
          <span className="font-semibold text-[11px] text-itec-gray group-hover:text-itec-text transition-colors leading-tight">
            {esp.name}
          </span>
        </button>
      ))}
    </div>
  </div>
);
