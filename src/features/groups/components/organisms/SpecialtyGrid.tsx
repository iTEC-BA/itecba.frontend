import React from 'react';
import { ESPECIALIDADES_DB } from '@/data/specialties';

interface Props {
  onSpecialtyClick: (val: string) => void;
}

export const SpecialtyGrid: React.FC<Props> = ({ onSpecialtyClick }) => {
  return (
    <div className="animate-in fade-in duration-700 pb-10">
      
      <div className="flex items-center gap-3 mb-6 pl-2">
        <span className="w-1.5 h-5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Explorar por Especialidad
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ESPECIALIDADES_DB.map((esp, i) => (
          <div 
            key={i} 
            onClick={() => onSpecialtyClick(esp.carreraValue)} 
            className={`group relative bg-itec-surface border border-itec-gray rounded-3xl p-5 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2 overflow-hidden ${esp.colorClass} hover:border-current shadow-lg hover:shadow-2xl`}
          >
            {/* Glow de fondo sutil al hacer hover */}
            <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-itec-bg border border-itec-gray/50 flex items-center justify-center text-xl font-black text-white group-hover:bg-white/10 group-hover:scale-110 transition-transform duration-500 mb-3 shadow-inner relative z-10">
              {esp.code}
            </div>
            
            <span className="font-bold text-[12px] md:text-xs text-gray-300 group-hover:text-white transition-colors relative z-10 leading-tight">
              {esp.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};