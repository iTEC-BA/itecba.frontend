import React from "react";

interface Props {
  active?: boolean;
  size?: "sm" | "md";
}

export const RewardStatusDot: React.FC<Props> = ({ active = true, size = "sm" }) => {
  const sizeCls = size === "md" ? "w-2.5 h-2.5" : "w-2 h-2";
  return (
    <span
      className={`inline-block rounded-full shrink-0 ${sizeCls} ${
        active
          ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)] animate-pulse"
          : "bg-white/20"
      }`}
      aria-label={active ? "Activo" : "Inactivo"}
    />
  );
};
