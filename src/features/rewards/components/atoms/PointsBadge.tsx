import React from "react";
import { Icons } from "@components/ui/icons/Icons";

interface Props {
  points: number;
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "default" | "glow" | "minimal";
}

const sizeMap = {
  xs: { wrap: "gap-0.5 px-1.5 py-0.5 text-[10px]", icon: "size-2.5" },
  sm: { wrap: "gap-1 px-2 py-0.5 text-xs", icon: "size-3" },
  md: { wrap: "gap-1.5 px-3 py-1 text-sm", icon: "size-4" },
  lg: { wrap: "gap-2 px-4 py-2 text-base", icon: "size-5" },
};

export const PointsBadge: React.FC<Props> = ({
  points,
  size = "md",
  showLabel = false,
  variant = "default",
}) => {
  const s = sizeMap[size];
  const base = "inline-flex items-center font-bold text-itec-rewards rounded-full";
  const variantCls =
    variant === "glow"
      ? "bg-itec-rewards/15 border border-itec-rewards/30 shadow-[0_0_12px_rgba(240,177,0,0.2)]"
      : variant === "minimal"
      ? ""
      : "bg-itec-rewards/10 border border-itec-rewards/20";

  return (
    <span className={`${base} ${variantCls} ${s.wrap}`}>
      <Icons type="star" className={`${s.icon} shrink-0`} />
      <span className="tabular-nums">{points.toLocaleString()}</span>
      {showLabel && (
        <span className="font-normal text-itec-text/60 ml-0.5">pts</span>
      )}
    </span>
  );
};
