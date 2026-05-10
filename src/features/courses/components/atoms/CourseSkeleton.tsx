// src/features/courses/components/atoms/CourseSkeleton.tsx
// Skeleton loader para la tarjeta de curso — igual proporción que CourseCard
import React from "react";

export const CourseSkeleton: React.FC = () => (
  <div className="bg-itec-card rounded-2xl overflow-hidden border border-itec-border animate-pulse">
    {/* Thumbnail */}
    <div className="w-full aspect-video bg-white/5" />

    <div className="p-4 space-y-3">
      {/* Badges */}
      <div className="flex gap-2">
        <div className="h-4 w-14 bg-white/5 rounded-full" />
        <div className="h-4 w-20 bg-white/5 rounded-full" />
      </div>
      {/* Título */}
      <div className="space-y-1.5">
        <div className="h-4 bg-white/5 rounded-md w-full" />
        <div className="h-4 bg-white/5 rounded-md w-4/5" />
      </div>
      {/* Descripción */}
      <div className="h-3 bg-white/5 rounded-md w-3/4" />
      {/* Barra de progreso */}
      <div className="h-1 bg-white/5 rounded-full w-full mt-2" />
    </div>
  </div>
);

export const CourseSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CourseSkeleton key={i} />
    ))}
  </div>
);
