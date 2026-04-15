/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Icons } from '../atoms/Icons';

interface Props {
  title: string;
  description: string;
  iconType?: string;
  imageUrl?: string;
  colorTheme: 'purple' | 'orange' | 'blue' | 'green' | 'yellow' | 'teal' | 'red';
  children?: React.ReactNode;
}

export const PageHeader: React.FC<Props> = ({ title, description, iconType, imageUrl, colorTheme, children }) => {
  
  const getThemeClasses = () => {
    switch (colorTheme) {
      case 'purple': return 'bg-purple-500/10 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)] border-purple-500/20';
      case 'orange': return 'bg-orange-500/10 text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.3)] border-orange-500/20';
      case 'blue': return 'bg-blue-500/10 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)] border-blue-500/20';
      case 'green': return 'bg-green-500/10 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] border-green-500/20';
      case 'yellow': return 'bg-yellow-500/10 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.3)] border-yellow-500/20';
      case 'teal': return 'bg-teal-500/10 text-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.3)] border-teal-500/20';
      case 'red': return 'bg-red-500/10 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)] border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 shadow-[0_0_30px_rgba(156,163,175,0.3)] border-gray-500/20';
    }
  };

  const getGlowColor = () => {
    switch (colorTheme) {
      case 'red': return 'rgba(239,68,68,0.5)';
      // (Puedes agregar los demás colores si en el futuro usas logos de otro color)
      default: return 'rgba(255,255,255,0.2)';
    }
  };

  return (
    <div className="mb-8 animate-in fade-in zoom-in-95 shrink-0 flex flex-col items-center xl:items-start xl:flex-row">
      {/* 🔴 LÓGICA MEJORADA: Si es imagen, la mostramos gigante y sin caja. Si es icono, usamos la caja bonita. */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Logo" 
          className="h-28 md:h-36 mb-6 mx-auto object-contain " 
          style={{ filter: `drop-shadow(0px 0px 30px ${getGlowColor()})` }}
        />
      ) : (
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center my-auto mr-6 border transition-all ${getThemeClasses()}`}>
          <div className="w-8 h-8">
            {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Icons type={iconType as any} />
          </div>
        </div>
      )}
      <div className='flex flex-col items-center mx-auto xl:items-start xl:mx-2'>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{title}</h1>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
        
        {children && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 ml-0 xl:ml-auto">
            {children}
          </div>
        )}
    </div>
  );
};