import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  fullWidth,
  className = "",
  ...props
}) => {
  return (
    <input
      className={cn(
        "text-itec-text placeholder:text-itec-muted/80 outline-none placeholder:text-sm",
        "transition-all",
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
};
