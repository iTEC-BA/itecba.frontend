import React from "react";

interface Props { progress: number; variant?: "blue" | "green"; }

export const ProgressBar: React.FC<Props> = ({ progress, variant = "blue" }) => {
  const isComplete = progress >= 100;
  const trackColor = "bg-itec-gray/30";
  const fillColor = isComplete || variant === "green"
    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
    : "bg-itec-blue-skye shadow-[0_0_8px_rgba(0,74,173,0.4)]";

  return (
    <div className={`w-full h-1.5 rounded-full overflow-hidden ${trackColor}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${fillColor}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};
