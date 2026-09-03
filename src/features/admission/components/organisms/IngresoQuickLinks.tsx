import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';
import type { ActionLink, MainLink, MaterialLink, SiuLink } from '../../types/ingresoLinks';

interface Props {
  actions: ActionLink[];
  socials: MainLink[];
  materials: MaterialLink[];
  siuLinks: SiuLink[];
}

export const IngresoQuickLinks: React.FC<Props> = ({ actions, socials, materials, siuLinks }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pl-1">
          <span className="w-1.5 h-4 bg-itec-blue-skye rounded-full"></span>
          <h3 className="text-xs font-bold text-itec-text uppercase tracking-widest">Trámites y Sistemas</h3>
        </div>
        {actions.map(action => (
          <a key={action.id} href={action.url} target="_blank" rel="noopener noreferrer" className="bg-itec-box border border-itec-border hover:border-itec-blue-skye p-4 rounded-xl flex items-center justify-between group transition-colors">
            <div>
              <h4 className="font-bold text-itec-text text-sm group-hover:text-itec-blue-skye transition-colors">{action.title}</h4>
              <p className="text-[11px] text-itec-gray">{action.subtitle}</p>
            </div>
            <Icons type="externalLink" className="w-4 h-4 text-itec-gray group-hover:text-itec-blue-skye" />
          </a>
        ))}
        {siuLinks.map(siu => (
           <a key={siu.id} href={siu.url} target="_blank" rel="noopener noreferrer" className="bg-itec-box border border-itec-border hover:border-itec-blue-skye p-4 rounded-xl flex items-center justify-between group transition-colors">
           <div>
             <h4 className="font-bold text-itec-text text-sm group-hover:text-itec-blue-skye transition-colors">{siu.title}</h4>
             <p className="text-[11px] text-itec-gray">{siu.subtitle}</p>
           </div>
           <Icons type="aulasVirtuales" className="w-5 h-5 text-itec-gray group-hover:text-itec-blue-skye" />
         </a>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pl-1">
          <span className="w-1.5 h-4 bg-orange-400 rounded-full"></span>
          <h3 className="text-xs font-bold text-itec-text uppercase tracking-widest">Estudio y Comunidad</h3>
        </div>
        
        {materials.map(mat => (
          <a key={mat.id} href={mat.url} target="_blank" rel="noopener noreferrer" className="bg-itec-box border border-itec-border hover:border-orange-400 p-4 rounded-xl flex items-center gap-4 group transition-colors">
            <span className="text-2xl">{mat.emoji}</span>
            <div>
              <h4 className="font-bold text-itec-text text-sm group-hover:text-orange-400 transition-colors">{mat.title}</h4>
              <p className="text-[11px] text-itec-gray">{mat.subtitle}</p>
            </div>
          </a>
        ))}

        <div className="grid grid-cols-3 gap-2 h-full">
          {socials.map(soc => (
             <a key={soc.id} href={soc.url} target="_blank" rel="noopener noreferrer" className={`bg-itec-box border border-itec-border ${soc.hoverClass} p-3 rounded-xl flex flex-col items-center justify-center text-center group transition-colors h-full min-h-[80px]`}>
               <div className={`w-5 h-5 mb-1.5 ${soc.colorClass}`}>
                 <Icons type={soc.iconType as any} />
               </div>
               <span className="text-[10px] font-bold text-itec-text">{soc.title}</span>
             </a>
          ))}
        </div>
      </div>
    </div>
  );
};
