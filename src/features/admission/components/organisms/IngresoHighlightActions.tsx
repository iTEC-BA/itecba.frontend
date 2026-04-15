import React from 'react';
import { Icons } from '@/components/atoms/Icons';
import type { ActionLink } from '../../types/ingresoLinks';

interface Props { actions: ActionLink[]; }

export const IngresoHighlightActions: React.FC<Props> = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {actions.map((action, index) => (
        <a 
          key={action.id}
          href={action.url} 
          target="_blank" rel="noopener noreferrer"
          className="relative bg-gradient-to-r from-itec-surface to-itec-sidebar border border-itec-gray hover:border-purple-500/50 p-6 rounded-3xl flex items-center justify-between group transition-all duration-300 shadow-xl overflow-hidden hover:-translate-y-1"
        >
          {/* Fondo animado sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              {/* Puntito parpadeante de "Activo" solo en el primer item */}
              {index === 0 && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>}
              <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                {action.title}
              </h3>
            </div>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{action.subtitle}</p>
          </div>
          
          <div className="relative z-10 bg-purple-500/10 p-3.5 rounded-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm border border-purple-500/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <div className="w-6 h-6"><Icons type="edit" /></div>
          </div>
        </a>
      ))}
    </div>
  );
};