import React from "react";
import { CourseProgressBadge } from "@features/courses/components/atoms/CourseProgressBadge";
import { Icons } from "@components/ui/icons/Icons";

interface Props {
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  isOficial?: boolean;
  duration?: string;
}

export const CourseCard: React.FC<Props> = ({ title, description, progress, imageUrl, isOficial, duration }) => {
  const isComplete = progress >= 100;

  return (
    <article className="group relative bg-itec-box border border-itec-border hover:border-itec-section-courses/50 hover:bg-itec-section-courses/5 rounded-[1.5rem] flex flex-col h-full transition-all duration-300 cursor-pointer overflow-hidden">
      
      {/* ── Portada y Badges ── */}
      <div className="relative w-full aspect-video overflow-hidden bg-itec-sidebar shrink-0 border-b border-itec-border">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {isOficial && (
            <span className="bg-itec-section-courses/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10">
              Oficial
            </span>
          )}
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {isComplete && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border border-white/10">
              ✓ Listo
            </span>
          )}
        </div>
      </div>
      
      {/* ── Contenido ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-sm font-bold text-itec-text line-clamp-2 leading-snug group-hover:text-itec-section-courses transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs text-itec-gray font-medium">
          <span className="flex items-center gap-1.5">
            <Icons type="clock" className="w-3.5 h-3.5 opacity-70" />
            {duration || "2h 30m"}
          </span>
        </div>

        <p className="text-xs text-itec-gray line-clamp-2 flex-1 leading-relaxed">
          {description}
        </p>
        
        {/* ── Pie de tarjeta (Progreso y CTA) ── */}
        <div className="mt-auto pt-5 border-t border-white/5 flex flex-col gap-4">
          {progress > 0 && <CourseProgressBadge percent={Math.round(progress)} showLabel={false} />}
          
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] text-itec-muted uppercase tracking-widest font-bold">
              {progress > 0 ? `${Math.round(progress)}% Completado` : "Empezar"}
            </span>
            <span className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-itec-section-courses/30 bg-itec-section-courses/10 text-itec-section-courses text-xs font-bold transition-all group-hover:bg-itec-section-courses group-hover:text-white">
              <Icons type="play" className="w-3.5 h-3.5" /> Ir al curso
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
