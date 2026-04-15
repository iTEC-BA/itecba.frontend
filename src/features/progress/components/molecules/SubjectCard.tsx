import React from 'react';
import type { Subject } from '../../types/progress';

interface Props {
  subject: Subject;
}

export const SubjectCard: React.FC<Props> = ({ subject }) => {
  // Mapa de estilos según el estado adaptado al theme oscuro de ITEC
  const statusConfig = {
    aprobada: { bg: 'bg-green-500/10', border: 'border-green-500/50', badge: 'bg-green-600 text-white', text: 'text-green-500', icon: 'M20 6 9 17l-5-5' },
    regular: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/50', badge: 'bg-fuchsia-500 text-white', text: 'text-fuchsia-500', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' },
    cursando: { bg: 'bg-yellow-400/10', border: 'border-yellow-400/50', badge: 'bg-yellow-500 text-white animate-pulse', text: 'text-yellow-500', icon: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' },
    disponible: { bg: 'bg-itec-surface', border: 'border-itec-gray hover:border-itec-blue/50', badge: 'bg-itec-blue text-white', text: 'text-itec-blue-skye', icon: 'M5 12h14M12 5v14' },
    bloqueada: { bg: 'bg-itec-bg/50', border: 'border-itec-gray/50 opacity-60', badge: 'bg-gray-600 text-white', text: 'text-gray-500', icon: 'M7 11V7a5 5 0 0 1 10 0v4M3 11h18v11H3z' }, // Simplified lock path
  };

  const config = statusConfig[subject.status];

  return (
    <div className={`rounded-2xl border shadow-md relative transition-all duration-300 transform ${config.bg} ${config.border} ${subject.status !== 'bloqueada' ? 'hover:-translate-y-1 hover:shadow-lg' : ''}`}>
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 absolute -top-3 left-6">
              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-lg ${config.badge}`}>
                {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
              </div>
            </div>
            <h3 className="font-bold tracking-tight mt-4 min-h-[3.5rem] flex items-center text-lg leading-tight text-white">{subject.name}</h3>
            <div className="text-gray-400 text-xs font-mono font-bold opacity-80">{subject.code}</div>
          </div>
          
          <button 
            disabled={subject.status === 'bloqueada'}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${subject.status === 'bloqueada' ? 'bg-itec-bg border border-itec-gray text-gray-500' : `${config.badge} hover:scale-105 shadow-lg`}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={config.icon}></path>
            </svg>
          </button>
        </div>
      </div>

      {(subject.status === 'aprobada' || subject.status === 'regular') && (
        <div className="p-6 pt-0 space-y-4">
          <div className={`animate-in fade-in slide-in-from-top-3 duration-500 p-3 rounded-xl border ${config.bg} ${config.border} grid grid-cols-2 items-start gap-4`}>
            {subject.status === 'aprobada' ? (
              <div className="flex flex-col gap-1.5">
                <span className={`text-[10px] font-bold ${config.text}`}>NOTA</span>
                <input className={`w-full h-9 bg-itec-bg border ${config.border} rounded-lg text-center text-sm font-bold text-white outline-none focus:border-itec-blue`} type="number" defaultValue={subject.grade} readOnly />
              </div>
            ) : <div></div>}
            
            <div className="flex flex-col gap-1.5 items-end">
              <span className={`text-[10px] font-bold ${config.text}`}>AÑO</span>
              <input className={`w-full h-9 bg-itec-bg border ${config.border} rounded-lg text-center text-sm font-bold text-white outline-none focus:border-itec-blue`} type="number" defaultValue={subject.year} readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};