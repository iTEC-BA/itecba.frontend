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
    <article className="group relative bg-itec-box border border-itec-border hover:border-itec-section-courses rounded-xl overflow-hidden flex flex-col h-full transition-colors cursor-pointer">
      <div className="relative w-full aspect-video overflow-hidden bg-itec-sidebar shrink-0 border-b border-itec-border">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-itec-box/40">
          <div className="w-10 h-10 rounded-full bg-itec-section-courses text-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        {isOficial && (
          <span className="absolute top-2 left-2 bg-itec-section-courses text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Oficial
          </span>
        )}
        {isComplete && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            ✓ Listo
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-sm font-bold text-itec-text line-clamp-2 leading-snug group-hover:text-itec-section-courses transition-colors">
          {title}
        </h3>
        <p className="text-xs text-itec-gray line-clamp-2 flex-1 leading-relaxed">
          {description}
        </p>
        {progress > 0 && (
          <div className="mt-auto pt-3 border-t border-itec-border">
            <CourseProgressBadge percent={Math.round(progress)} />
          </div>
        )}
      </div>
    </article>
  );
};
