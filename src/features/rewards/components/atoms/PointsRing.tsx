import React from "react";

interface Props {
  points: number;
  maxPoints?: number;
  size?: number;
  label?: string;
}

export const PointsRing: React.FC<Props> = ({
  points,
  maxPoints = 5000,
  size = 96,
  label,
}) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const effectiveMax = Math.max(maxPoints, points);
  const pct = Math.min(1, points / effectiveMax);
  const dashOffset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={6}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#rewardGradient)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="rewardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f0b100" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold text-itec-text tabular-nums leading-none">
          {points.toLocaleString()}
        </span>
        <span className="text-[9px] font-bold text-itec-rewards/80 uppercase tracking-wider mt-0.5">
          {label ?? "pts"}
        </span>
      </div>
    </div>
  );
};
