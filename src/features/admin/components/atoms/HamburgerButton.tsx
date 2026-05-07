// src/features/admin/components/atoms/HamburgerButton.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
  open:     boolean;
  onToggle: () => void;
  className?: string;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  open, onToggle, className,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={open ? "Cerrar menú" : "Abrir menú"}
    aria-expanded={open}
    className={cn(
      "w-9 h-9 flex flex-col items-center justify-center gap-[5px]",
      "rounded-xl border border-itec-border bg-itec-surface",
      "hover:bg-itec-box2 transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-itec-sky/30",
      className
    )}
  >
    <span
      className={cn(
        "block w-4 h-0.5 bg-itec-text rounded transition-all duration-300",
        open && "rotate-45 translate-y-[6.5px]"
      )}
    />
    <span
      className={cn(
        "block w-4 h-0.5 bg-itec-text rounded transition-all duration-300",
        open && "opacity-0 scale-x-0"
      )}
    />
    <span
      className={cn(
        "block w-4 h-0.5 bg-itec-text rounded transition-all duration-300",
        open && "-rotate-45 -translate-y-[6.5px]"
      )}
    />
  </button>
);
