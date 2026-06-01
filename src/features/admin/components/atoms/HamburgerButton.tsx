// src/features/admin/components/atoms/HamburgerButton.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
  open: boolean;
  onToggle: () => void;
  className?: string;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  open,
  onToggle,
  className,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={open ? "Cerrar menú" : "Abrir menú"}
    aria-expanded={open}
    className={cn(
      "group inline-flex h-11 w-11 flex-col items-center justify-center gap-[5px]",
      "rounded-xl border border-itec-border bg-itec-box shadow-[0_12px_30px_rgba(0,0,0,0.28)]",
      "transition-all duration-200 hover:bg-itec-box focus:outline-none focus:ring-2 focus:ring-itec-sky/30",
      className
    )}
  >
    <span className={cn("block h-0.5 w-4 rounded bg-itec-text transition-all duration-300", open && "translate-y-[6px] rotate-45")} />
    <span className={cn("block h-0.5 w-4 rounded bg-itec-text transition-all duration-300", open && "scale-x-0 opacity-0")} />
    <span className={cn("block h-0.5 w-4 rounded bg-itec-text transition-all duration-300", open && "-translate-y-[6px] -rotate-45")} />
  </button>
);
