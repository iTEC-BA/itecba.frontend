import React from 'react';
import { ProgressBar } from '../atoms/ProgressBar';
import { Icons } from "@/components/atoms/Icons";

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
    <div className="  rounded-[1.5rem] p-4 flex flex-col gap-4 hover:-translate-y-2 hover:bg-slate-900/50 transition-all duration-500 ease-out h-full relative overflow-hidden cursor-pointer group">
      
      {/* Etiqueta Oficial Premium */}
      {isOficial && (
        <div className="absolute top-6 right-6 z-20 bg-slate-950/90 text-sky-400 text-[10px] font-black px-4 py-1.5 rounded-lg border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)] uppercase tracking-widest">
          Oficial
        </div>
      )}

      {/* Imagen Bento Grid */}
      <div className="w-full h-44 bg-slate-950 rounded-2xl overflow-hidden relative border border-white/5">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" 
          loading="lazy"
        />
        
        {/* Play Glassmorphism */}
        <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.5)] transform scale-50 group-hover:scale-100 transition-transform duration-500 ease-out">
            <div className="w-7 h-7 ml-1"><Icons type="playFill" /></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-2 relative z-10">
        <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 leading-snug group-hover:text-sky-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 leading-relaxed font-medium">
          {description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex justify-between items-end mb-2.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progreso</span>
            <span className={`text-[12px] font-black ${isCompleted ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-sky-400'}`}>
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </div>
  );
};