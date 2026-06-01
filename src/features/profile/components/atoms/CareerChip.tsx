import React from "react";
import { cn } from "@/lib/utils";

interface CareerChipProps {
  label: string;
  code?: string;
  colorClass?: string;
  active?: boolean;
  sm?: boolean;
}

export const CareerChip: React.FC<CareerChipProps> = ({
  label,
  code,
  colorClass,
  active = true,
  sm = false,
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-xl border font-bold",
      sm ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
      active && colorClass
        ? colorClass
        : "bg-itec-surface border-itec-border text-itec-muted"
    )}
  >
    {code && <span className="text-[9px] font-bold opacity-60">{code}</span>}
    {label}
  </span>
);
