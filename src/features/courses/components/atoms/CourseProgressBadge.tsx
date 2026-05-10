// src/features/courses/components/atoms/CourseProgressBadge.tsx
// Indicador visual de progreso para tarjetas de curso
import React from "react";

interface Props {
  percent: number;   // 0-100
  showLabel?: boolean;
}

export const CourseProgressBadge: React.FC<Props> = ({ percent, showLabel = true }) => {
  if (percent <= 0) return null;

  const color =
    percent >= 100 ? "bg-emerald-500" :
    percent >= 50  ? "bg-itec-blue-skye" :
    "bg-itec-blue-skye/70";

  return (
    <div className="mt-2 space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-itec-gray font-medium">Progreso</span>
          <span className={percent >= 100 ? "text-emerald-400 font-bold" : "text-itec-gray"}>
            {percent >= 100 ? "✓ Completado" : `${percent}%`}
          </span>
        </div>
      )}
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
};
