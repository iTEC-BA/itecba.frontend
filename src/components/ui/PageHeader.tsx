/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Icons } from './icons/Icons';

// Expandimos la paleta para incluir todas las "páginas" o secciones futuras
export type HeaderColorTheme = 
  | 'purple' | 'orange' | 'blue' | 'green' | 'yellow' 
  | 'teal' | 'red' | 'pink' | 'indigo' | 'cyan' | 'emerald' | 'slate';

interface Props {
  title: string;
  description: string;
  iconType?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  colorTheme: HeaderColorTheme;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<Props> = ({ 
  title, description, iconType, icon, imageUrl, colorTheme, children
}) => {
  
  // Diccionario centralizado: Más limpio que un switch gigante y fácil de mantener.
  // Colores sutiles: fondos translúcidos (/10), bordes suaves (/20) y sombras elegantes (15px)
  const themeStyles: Record<HeaderColorTheme, { box: string; glow: string }> = {
    purple:  { box: 'bg-purple-500/10 text-purple-400 border-purple-500/20 ', glow: 'rgba(168,85,247,0.4)' },
    orange:  { box: 'bg-orange-500/10 text-orange-400 border-orange-500/20 ', glow: 'rgba(249,115,22,0.4)' },
    blue:    { box: 'bg-blue-500/10 text-blue-400 border-blue-500/20 ',   glow: 'rgba(59,130,246,0.4)' },
    green:   { box: 'bg-green-500/10 text-green-400 border-green-500/20 ',  glow: 'rgba(34,197,94,0.4)' },
    yellow:  { box: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 ',  glow: 'rgba(234,179,8,0.4)' },
    teal:    { box: 'bg-teal-500/10 text-teal-400 border-teal-500/20 ',   glow: 'rgba(20,184,166,0.4)' },
    red:     { box: 'bg-red-500/10 text-red-400 border-red-500/20 ',     glow: 'rgba(239,68,68,0.4)' },
    pink:    { box: 'bg-pink-500/10 text-pink-400 border-pink-500/20 ',    glow: 'rgba(236,72,153,0.4)' },
    indigo:  { box: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ',  glow: 'rgba(99,102,241,0.4)' },
    cyan:    { box: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 ',     glow: 'rgba(6,182,212,0.4)' },
    emerald: { box: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ', glow: 'rgba(16,185,129,0.4)' },
    slate:   { box: 'bg-slate-500/10 text-slate-400 border-slate-500/20 ',   glow: 'rgba(100,116,139,0.4)' },
  };

  const currentStyle = themeStyles[colorTheme] || themeStyles.slate;
  return (
    <header className="mb-6 md:mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
      {/* sm:flex-row permite que en tablets/PC el header y los botones se pongan uno a cada lado */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 md:gap-6">
        
        {/* Lado izquierdo: Icono y Textos (Alineados en fila para ahorrar muchísimo espacio en mobile) */}
        <div className="flex items-start gap-3 md:gap-4">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              // Tamaños reducidos y lógicos para un encabezado
              className="w-12 h-12 md:w-16 md:h-16 object-contain shrink-0 mt-1" 
              
            />
          ) : (
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border shrink-0 mt-1 transition-all ${currentStyle.box}`}>
                {icon ? icon : <div className="w-6 h-6 md:w-7 md:h-7"><Icons type={iconType as any} /></div>}
            </div>
          )}

          <div className="flex flex-col pt-0.5">
            <h1 className="text-2xl md:text-3xl font-bold text-itec-text tracking-tight mb-1">
              {title}
            </h1>
            <p className="text-xs md:text-sm text-itec-gray max-w-xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Lado derecho: Acciones (Botones o selectores). Si existen, los acomoda de forma natural */}
        {children && (
          <div className="flex items-center justify-center md:flex-col md:items-end gap-3 sm:mt-1 shrink-0 ">
            {children}
          </div>
        )}

      </div>
    </header>
  );
};