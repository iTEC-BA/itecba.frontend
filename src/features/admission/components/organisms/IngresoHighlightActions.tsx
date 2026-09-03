import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';
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
          className="relative bg-itec-box border border-white/10 hover:border-purple-500/60 p-6 rounded-2xl flex items-center justify-between group transition-all duration-300 shadow-lg overflow-hidden hover:-translate-y-1.5"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-1.5">
              {index === 0 && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>}
              <h3 className="font-extrabold text-white text-lg group-hover:text-purple-300 transition-colors">
                {action.title}
              </h3>
            </div>
            <p className="text-xs text-white/60 group-hover:text-purple-200/80 transition-colors font-medium">{action.subtitle}</p>
          </div>
          
          <div className="relative z-10 bg-white/5 p-3.5 rounded-xl text-white/70 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm border border-white/10 group-hover:border-purple-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-110">
            <div className="w-6 h-6"><Icons type="edit" /></div>
          </div>
        </a>
      ))}
    </div>
  );
};
