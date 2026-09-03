import React from "react";

interface Props { progress: number; variant?: "blue" | "green"; }

export const ProgressBar: React.FC<Props> = ({ progress, variant = "blue" }) => {
  const isComplete = progress >= 100;
  const trackColor = "bg-itec-sidebar border border-itec-border";
  const fillColor = isComplete || variant === "green"
    ? "bg-emerald-500"
    : "bg-itec-section-courses";

  return (
    <div className={`w-full h-1.5 rounded-full overflow-hidden ${trackColor}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${fillColor}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};
