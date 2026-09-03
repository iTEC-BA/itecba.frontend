import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AdmissionModality } from '../../types/ingresoLinks';
import { ADMISSION_YEAR } from '../../constants';

interface Props {
  modalities: AdmissionModality[];
}

export const IngresoInfoAccordion: React.FC<Props> = ({ modalities }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-2 pl-1">
        <span className="w-1.5 h-4 bg-itec-section-admission rounded-full"></span>
        <h3 className="text-xs font-bold text-itec-text uppercase tracking-widest">Modalidades Ingreso {ADMISSION_YEAR}</h3>
      </div>
      
      {modalities.map((mod) => (
        <div 
          key={mod.id} 
          className={`border rounded-xl transition-all duration-300 overflow-hidden ${openId === mod.id ? 'bg-itec-box border-itec-section-admission' : 'bg-itec-sidebar border-itec-border hover:border-itec-gray'}`}
        >
          <button 
            onClick={() => toggle(mod.id)}
            className="w-full flex items-center justify-between p-4 text-left focus:outline-none cursor-pointer"
          >
            <div>
              <h4 className={`font-bold text-sm ${openId === mod.id ? 'text-itec-section-admission' : 'text-itec-text'}`}>{mod.title}</h4>
              <p className="text-[11px] text-itec-gray mt-0.5">{mod.shortDesc}</p>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 text-itec-gray ${openId === mod.id ? 'rotate-180 text-itec-section-admission' : ''}`} />
          </button>
          
          <div 
            className={`transition-all duration-300 ease-in-out ${openId === mod.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-4 pt-0 border-t border-itec-border/50">
              <ul className="list-disc list-inside space-y-2 mt-3">
                {mod.content.map((text, idx) => (
                  <li key={idx} className="text-xs text-itec-text/80 leading-relaxed">{text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
