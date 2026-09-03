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
    <section className="bg-itec-box border border-itec-border rounded-xl p-5 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-itec-text">Tu Hoja de Ruta</h2>
          <p className="text-[10px] text-itec-gray uppercase tracking-widest mt-0.5">Seguimiento</p>
        </div>
        <span className="text-xl font-bold text-itec-section-admission">
          {progressPercentage}%
        </span>
      </div>

      <div className="w-full bg-itec-sidebar rounded-full h-1.5 mb-6 border border-itec-border overflow-hidden">
        <div 
          className="bg-itec-section-admission h-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="relative border-l-2 border-itec-border ml-3 space-y-5 pb-2 flex-1">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          return (
            <div 
              key={step.id} 
              onClick={() => onToggleStep(step.id)}
              className="relative pl-6 group cursor-pointer"
            >
              <span className={`absolute -left-[10px] top-1 w-4 h-4 rounded-full border-[3px] border-itec-box flex items-center justify-center transition-colors duration-200 ${
                isCompleted ? 'bg-itec-section-admission' : 'bg-itec-border group-hover:bg-itec-section-admission/50'
              }`}></span>
              <div className={`transition-opacity duration-200 ${isCompleted ? 'opacity-50 hover:opacity-80' : 'opacity-100'}`}>
                <h3 className={`text-sm font-bold mb-1 transition-colors ${isCompleted ? 'text-itec-gray line-through' : 'text-itec-text group-hover:text-itec-section-admission'}`}>
                  {step.title}
                </h3>
                <p className={`text-[11px] leading-relaxed p-2.5 rounded-lg border transition-colors duration-200 ${
                  isCompleted ? 'bg-transparent border-transparent text-itec-gray' : 'bg-itec-sidebar border-itec-border text-itec-text group-hover:border-itec-section-admission/30'
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
