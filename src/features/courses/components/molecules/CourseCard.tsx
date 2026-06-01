import React from "react";
import { CourseProgressBadge } from "@features/courses/components/atoms/CourseProgressBadge";

interface Props {
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  isOficial?: boolean;
}

export const CourseCard: React.FC<Props> = ({ title, description, progress, imageUrl, isOficial }) => {
  const isComplete = progress >= 100;

  return (
    <article className="group relative bg-itec-card rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-itec-blue-skye/40 hover:-translate-y-0.5 cursor-pointer">

      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-itec-bg shrink-0">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center border border-white/20 group-hover:bg-itec-blue-skye group-hover:border-itec-blue-skye transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {/* Badge oficial */}
        {isOficial && (
          <span className="absolute top-2 left-2 bg-itec-blue text-itec-text text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-itec-blue-skye/40">
            Oficial
          </span>
        )}
        {/* Badge completado */}
        {isComplete && (
          <span className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            ✓ Listo
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3 className="text-sm font-bold text-itec-text line-clamp-2 leading-snug group-hover:text-itec-blue-skye transition-colors">
          {title}
        </h3>
        <p className="text-xs text-itec-gray line-clamp-2 flex-1 leading-relaxed">
          {description}
        </p>
        
        {/* Progreso Componetizado */}
        {progress > 0 && (
          <div className="mt-auto pt-2 border-t border-white/5">
            <CourseProgressBadge percent={Math.round(progress)} />
          </div>
        )}
      </div>
    </article>
  );
};