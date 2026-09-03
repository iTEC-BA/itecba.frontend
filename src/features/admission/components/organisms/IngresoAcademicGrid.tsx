import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';
import type { MaterialLink, SiuLink } from '../../types/ingresoLinks';

interface Props { materials: MaterialLink[]; siuLinks: SiuLink[]; }

export const IngresoAcademicGrid: React.FC<Props> = ({ materials, siuLinks }) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-5 pl-1">
          <span className="w-1.5 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span>
          <h3 className="text-xs font-extrabold text-white uppercase tracking-widest">Material de Estudio</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {materials.map(material => (
            <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer" className="bg-itec-box border border-white/10 hover:border-purple-500/60 rounded-2xl p-6 text-center transition-all duration-300 group hover:-translate-y-1.5 shadow-lg overflow-hidden relative">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
              <div className="w-16 h-16 mx-auto bg-itec-bg border border-white/10 rounded-2xl mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 group-hover:border-purple-500/40 shadow-inner relative z-10 -rotate-3 group-hover:rotate-0">
                {material.emoji}
              </div>
              <h4 className="font-bold text-white text-[13px] md:text-sm mb-1 relative z-10 tracking-wide">{material.title}</h4>
              <span className="text-[10px] text-purple-200/60 relative z-10 font-medium">{material.subtitle}</span>
            </a>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2.5 mb-5 pl-1">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
          <h3 className="text-xs font-extrabold text-white uppercase tracking-widest">Portales Oficiales UTN</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {siuLinks.map((siu, index) => (
            <a key={siu.id} href={siu.url} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-itec-box to-[#080b0f] border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:border-blue-500/50 transition-all duration-300 group shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-500 group-hover:text-white shadow-inner group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <div className="w-7 h-7">
                  <Icons type={index === 0 ? "siuGuarani" : "aulasVirtuales"} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white text-base md:text-lg leading-tight group-hover:text-blue-400 transition-colors">{siu.title}</h4>
                <p className="text-[11px] md:text-xs text-blue-100/50 mt-1.5 font-medium">{siu.subtitle}</p>
              </div>
              <div className="ml-auto text-white/20 group-hover:text-blue-400 transition-colors group-hover:translate-x-1.5">
                ➔
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
