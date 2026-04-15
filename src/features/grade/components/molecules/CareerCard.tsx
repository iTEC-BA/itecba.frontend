import React from 'react';
import { Icons } from '@/components/atoms/Icons';
import type { CareerOption } from '../../hooks/useCareers';

interface Props {
  career: CareerOption & { subjectsCount: number; yearsCount: number };
  isAvailable: boolean;
  onClick: (id: string) => void;
}

export const CareerCard: React.FC<Props> = ({ career, isAvailable, onClick }) => {
  return (
    <div 
      onClick={() => isAvailable && onClick(career.id)}
      className={`relative bg-itec-surface border rounded-3xl p-6 flex flex-col justify-between transition-all duration-500 group overflow-hidden h-full min-h-[220px]
        ${isAvailable 
          ? `border-itec-gray cursor-pointer ${career.border} hover:shadow-2xl ${career.shadow} hover:-translate-y-2` 
          : 'border-itec-gray/30 cursor-not-allowed opacity-75 hover:opacity-90 grayscale'}`}
    >
      {/* Glow de fondo animado */}
      {isAvailable && (
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${career.bgGlow}`}></div>
      )}

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-itec-bg border border-itec-gray flex items-center justify-center text-3xl shadow-inner transition-transform duration-500 ${isAvailable ? 'group-hover:scale-110 group-hover:rotate-3' : ''}`}>
          {career.icon}
        </div>
        
        {/* Badge de Estado */}
        {isAvailable ? (
          <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-green-500/20 shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            DISPONIBLE
          </span>
        ) : (
          <span className="bg-itec-bg text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-itec-gray uppercase tracking-widest flex items-center gap-1">
            <Icons type="clock" className="w-3 h-3" />
            PRÓXIMAMENTE
          </span>
        )}
      </div>

      <div className="relative z-10 mt-auto">
        <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-gray-100 transition-colors">
          {career.name}
        </h3>
        
        {/* Estadísticas de la Carrera (Generadas dinámicamente) */}
        {career.subjectsCount > 0 ? (
          <div className="flex items-center gap-3 pt-4 border-t border-itec-gray/50">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Materias</span>
              <span className={`text-sm font-black ${career.color}`}>{career.subjectsCount}</span>
            </div>
            <div className="w-px h-6 bg-itec-gray/50"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Duración</span>
              <span className="text-sm font-black text-white">{career.yearsCount} Niveles</span>
            </div>
          </div>
        ) : (
           <div className="pt-4 border-t border-itec-gray/50">
             <span className="text-[11px] text-gray-500 italic">Plan de estudios en desarrollo</span>
           </div>
        )}
      </div>
    </div>
  );
};