import React from "react";
import { Icons } from "@components/ui/icons/Icons";

interface Props {
  icon: string;
  canAfford: boolean;
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const sizeMap = {
  sm: { wrap: "w-9 h-9 rounded-xl", icon: "size-4" },
  md: { wrap: "w-12 h-12 rounded-2xl", icon: "size-6" },
  lg: { wrap: "w-16 h-16 rounded-2xl", icon: "size-8" },
};

export const IconBadge: React.FC<Props> = ({
  icon,
  canAfford,
  size = "md",
  glow = false,
}) => {
  const s = sizeMap[size];
  return (
    <div
      className={`${s.wrap} flex items-center justify-center shrink-0 border transition-all duration-300 ${
        canAfford
          ? `bg-itec-rewards/12 border-itec-rewards/25 text-itec-rewards ${
              glow ? "shadow-[0_0_20px_rgba(240,177,0,0.2)]" : ""
            }`
          : "bg-white/4 border-white/8 text-itec-text/30"
      }`}
    >
      <Icons type={icon} className={s.icon} />
    </div>
  );
};
