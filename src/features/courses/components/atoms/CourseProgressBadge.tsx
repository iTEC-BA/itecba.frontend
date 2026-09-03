import React from "react";

interface Props {
  percent: number;
  showLabel?: boolean;
}

export const CourseProgressBadge: React.FC<Props> = ({ percent, showLabel = true }) => {
  if (percent <= 0) return null;
  const color = percent >= 100 ? "bg-emerald-500" : "bg-itec-section-courses";

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-itec-gray font-medium">Progreso</span>
          <span className={percent >= 100 ? "text-emerald-400 font-bold" : "text-itec-gray font-bold"}>
            {percent >= 100 ? "✓ Completado" : `${percent}%`}
          </span>
        </div>
      )}
      <div className="h-1.5 w-full bg-itec-sidebar border border-itec-border rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
};
