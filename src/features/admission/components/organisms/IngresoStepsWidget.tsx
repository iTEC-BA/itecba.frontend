import React from 'react';
import type { AdmissionStep } from '../../types/ingresoLinks';

interface Props {
  steps: AdmissionStep[];
  completedSteps: string[];
  onToggleStep: (id: string) => void;
  progressPercentage: number;
}

export const IngresoStepsWidget: React.FC<Props> = ({ steps, completedSteps, onToggleStep, progressPercentage }) => {
  return (
    <section className="bg-itec-surface border border-itec-gray rounded-3xl p-6 md:p-8 shadow-xl animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
            <span className="text-xl">🗺️</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Tu Hoja de Ruta</h2>
            <p className="text-[11px] text-gray-400 uppercase tracking-widest">Paso a paso</p>
          </div>
        </div>
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-600">
          {progressPercentage}%
        </span>
      </div>

      {/* Barra de progreso global */}
      <div className="w-full bg-itec-bg rounded-full h-2 mb-8 border border-itec-gray overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="relative border-l-2 border-itec-gray/50 ml-4 space-y-6 pb-2 flex-1">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);

          return (
            <div 
              key={step.id} 
              onClick={() => onToggleStep(step.id)}
              className="relative pl-8 group cursor-pointer"
            >
              {/* Círculo Interactivo */}
              <span className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-itec-surface flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'bg-purple-500 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.6)]' 
                  : 'bg-itec-gray group-hover:bg-purple-500/50 group-hover:border-purple-500/20'
              }`}>
                {isCompleted && <span className="text-white text-[8px] font-bold">✓</span>}
              </span>

              {/* Tarjeta del Paso */}
              <div className={`transition-all duration-300 ${isCompleted ? 'opacity-50 hover:opacity-80' : 'opacity-100'}`}>
                <h3 className={`text-sm font-bold mb-1 transition-colors ${isCompleted ? 'text-gray-400 line-through' : 'text-white group-hover:text-purple-300'}`}>
                  <span className={`text-xs mr-2 transition-colors ${isCompleted ? 'text-gray-500' : 'text-purple-400'}`}>
                    Paso {step.stepNumber}
                  </span>
                  {step.title}
                </h3>
                <p className={`text-xs leading-relaxed p-3 rounded-xl border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-transparent border-transparent text-gray-500' 
                    : 'bg-itec-bg/50 border-itec-gray/30 text-gray-400 group-hover:border-purple-500/30'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};