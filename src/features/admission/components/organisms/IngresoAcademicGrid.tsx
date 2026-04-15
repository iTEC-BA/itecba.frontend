import React from 'react';
import { Icons } from '@/components/atoms/Icons';
import type { MaterialLink, SiuLink } from '../../types/ingresoLinks';

interface Props { materials: MaterialLink[]; siuLinks: SiuLink[]; }

export const IngresoAcademicGrid: React.FC<Props> = ({ materials, siuLinks }) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Material de Estudio - Estilo Bento Carpetas */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 pl-1">
          <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Material de Estudio</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {materials.map(material => (
            <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer" className="bg-itec-surface border border-itec-gray hover:border-purple-500/50 rounded-3xl p-6 text-center transition-all duration-300 group hover:-translate-y-1 shadow-lg overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all"></div>
              
              <div className="w-16 h-16 mx-auto bg-itec-bg border border-itec-gray rounded-2xl mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:border-purple-500/30 shadow-inner relative z-10 rotate-3 group-hover:rotate-0">
                {material.emoji}
              </div>
              <h4 className="font-bold text-white text-[13px] md:text-sm mb-1 relative z-10">{material.title}</h4>
              <span className="text-[10px] text-gray-400 relative z-10">{material.subtitle}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Sistemas Oficiales UTN - Portales Seguros */}
      <div>
        <div className="flex items-center gap-2 mb-4 pl-1">
          <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Portales Oficiales UTN</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siuLinks.map((siu, index) => (
            <a key={siu.id} href={siu.url} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-6 rounded-3xl flex items-center gap-5 hover:border-blue-500/50 transition-all duration-300 group shadow-xl">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform group-hover:bg-blue-500 group-hover:text-white shadow-inner">
                <div className="w-7 h-7">
                  <Icons type={index === 0 ? "siuGuarani" : "aulasVirtuales"} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white text-base md:text-lg leading-tight group-hover:text-blue-400 transition-colors">{siu.title}</h4>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1">{siu.subtitle}</p>
              </div>
              <div className="ml-auto text-gray-600 group-hover:text-blue-400 transition-colors group-hover:translate-x-1">
                ➔
              </div>
            </a>
          ))}
        </div>
      </div>

    </section>
  );
};