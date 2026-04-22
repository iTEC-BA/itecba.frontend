import React from 'react';
import CardCourseState from '../molecules/CardCourseState';

export const ProfileStatsWidget: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      
      {/* Widget 1: Progreso de Carrera */}
      <div className="md:col-span-2 bg-slate-900/40 border border-white/5 rounded-3xl p-6 hover:border-sky-500/30 transition-colors group">
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="text-sky-400">📊</span> Mi Progreso
        </h3>
        
        <div className="flex flex-col gap-8 items-center">
          {/* Gráfico circular simulado */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center rounded-full bg-slate-800 border-[8px] border-slate-950">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" fill="transparent" stroke="#0ea5e9" strokeWidth="8" strokeDasharray="301" strokeDashoffset="210" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="text-center">
              <span className="block text-2xl font-black text-white">15%</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Materias Aprobadas</span>
              <span className="text-xl font-black text-emerald-400">6 <span className="text-sm text-slate-600">/ 42</span></span>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Promedio General</span>
              <span className="text-xl font-black text-sky-400">8.50</span>
            </div>
          </div>
        </div>
      </div>

        <CardCourseState />

    </div>
  );
};