import React from "react";
import { cn } from "@/lib/utils";

interface PointsBadgeProfileProps {
  points: number;
  size?: "xs" | "sm" | "md" | "lg";
  pulse?: boolean;
  showLabel?: boolean;
}

const SIZE = {
  xs: "text-[10px] px-2 py-0.5 gap-1",
  sm: "text-xs px-2.5 py-1 gap-1",
  md: "text-sm px-3 py-1.5 gap-1.5",
  lg: "text-base px-4 py-2 gap-2",
};

export const PointsBadgeProfile: React.FC<PointsBadgeProfileProps> = ({
  points,
  size = "md",
  pulse = false,
  showLabel = true,
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-2xl font-semibold",
      "bg-itec-amber/10 text-itec-amber",
      SIZE[size],
      pulse && "animate-pulse"
    )}
  >
    <span className="leading-none">⭐</span>
    {points.toLocaleString("es-AR")}
    {showLabel && " pts"}
  </span>
);
