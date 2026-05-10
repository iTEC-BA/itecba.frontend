import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({ fullWidth, className = "", ...props }) => {
  return (
    <input
      className={cn(
        "bg-itec-box border border-itec-border text-itec-text",
        "px-4 py-3 rounded-2xl shadow-inner shadow-black/10",
        "placeholder:text-itec-muted/80 outline-none transition-all",
        "focus:border-itec-box/40 focus:ring-2 focus:ring-itec-sky/10",
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
};
