import React from 'react';
import { ProgressBar } from '../atoms/ProgressBar';
import { Icons } from "@/components/ui/Icons";

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  isOficial?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, description, progress, imageUrl, isOficial }) => {
  const isCompleted = progress === 100;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:border-sky-500/50 hover:shadow-[0_8px_30px_-10px_rgba(14,165,233,0.3)] transition-all duration-300 group cursor-pointer">
      
      {/* Sección de Imagen (Ancho completo arriba) */}
      <div className="relative w-full h-44 overflow-hidden bg-slate-950 shrink-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
          loading="lazy"
        />
        
        {/* Botón Play Centrado (Estilo de tu ejemplo) */}
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 group-hover:bg-sky-600 rounded-full p-3.5 transition-colors duration-300 backdrop-blur-sm z-10 shadow-lg border border-white/10 group-hover:border-sky-400/50">
          <div className="w-5 h-5 text-white ml-0.5">
            <Icons type="playFill" />
          </div>
        </button>

        {/* Etiqueta Oficial (Flotante estilo "Heart" pero a la izquierda) */}
        {isOficial && (
          <div className="absolute top-3 left-3 z-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider">
            Curso Oficial
          </div>
        )}
      </div>

      {/* Sección de Contenido */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Título y Descripción */}
        <h3 className="text-base font-semibold text-slate-100 mb-2 line-clamp-2 leading-snug group-hover:text-sky-400 transition-colors duration-200">
          {title}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1 font-normal">
          {description}
        </p>

        {/* Sección Inferior: Progreso (Reemplaza el Precio/Rating de tu ejemplo) */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              {/* Ícono decorativo para el progreso */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-500 group-hover:text-sky-500 transition-colors">
                 <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
              </svg>
              <span className="text-[13px] font-medium text-slate-300">
                Progreso
              </span>
            </div>
            
            <span className={`text-sm font-bold ${isCompleted ? 'text-emerald-400' : 'text-sky-400'}`}>
              {Math.round(progress)}%
            </span>
          </div>
          
          <ProgressBar progress={progress} />
        </div>
        
      </div>
    </div>
  );
};