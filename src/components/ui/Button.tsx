 
import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "purple"
  | "orange"
  | "teal"
  | "slate";

export type ButtonHierarchy = "solid" | "outline" | "ghost" | "dashed";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  hierarchy?: ButtonHierarchy;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  text?: string;
}

const THEMES: Record<ButtonVariant, Record<ButtonHierarchy, string>> = {
  primary: {
    solid: "bg-itec-blue-skye text-white hover:bg-itec-blue active:translate-y-px",
    outline: "border border-itec-sky/40 text-itec-sky hover:bg-itec-sky/10",
    ghost: "text-itec-sky hover:bg-itec-sky/10",
    dashed: "border border-dashed border-itec-sky/50 text-itec-sky hover:bg-itec-sky/10",
  },
  secondary: {
    solid: "bg-itec-surface text-itec-text border border-itec-border hover:bg-itec-box",
    outline: "border border-itec-border text-itec-text hover:bg-itec-surface/70",
    ghost: "text-itec-text hover:bg-itec-surface/70",
    dashed: "border border-dashed border-itec-border text-itec-text hover:bg-itec-surface/70",
  },
  danger: {
    solid: "bg-itec-red text-white hover:bg-itec-red/50",
    outline: "border border-rose-500/40 text-rose-300 hover:bg-rose-500/10",
    ghost: "text-rose-300 hover:bg-rose-500/10",
    dashed: "border border-dashed border-rose-500/50 text-rose-300 hover:bg-rose-500/10",
  },
  success: {
    solid: "bg-itec-emerald text-white hover:brightness-110",
    outline: "border border-itec-emerald/40 text-itec-emerald hover:bg-itec-emerald/10",
    ghost: "text-itec-emerald hover:bg-itec-emerald/10",
    dashed: "border border-dashed border-itec-emerald/50 text-itec-emerald hover:bg-itec-emerald/10",
  },
  warning: {
    solid: "bg-itec-amber text-black hover:brightness-110",
    outline: "border border-itec-amber/40 text-itec-amber hover:bg-itec-amber/10",
    ghost: "text-itec-amber hover:bg-itec-amber/10",
    dashed: "border border-dashed border-itec-amber/50 text-itec-amber hover:bg-itec-amber/10",
  },
  purple: {
    solid: "bg-itec-purple text-white hover:brightness-110",
    outline: "border border-itec-purple/40 text-itec-purple hover:bg-itec-purple/10",
    ghost: "text-itec-purple hover:bg-itec-purple/10",
    dashed: "border border-dashed border-itec-purple/50 text-itec-purple hover:bg-itec-purple/10",
  },
  orange: {
    solid: "bg-orange-500 text-white hover:bg-orange-400",
    outline: "border border-orange-400/40 text-orange-300 hover:bg-orange-500/10",
    ghost: "text-orange-300 hover:bg-orange-500/10",
    dashed: "border border-dashed border-orange-400/50 text-orange-300 hover:bg-orange-500/10",
  },
  teal: {
    solid: "bg-teal-500 text-white hover:bg-teal-400",
    outline: "border border-teal-400/40 text-teal-300 hover:bg-teal-500/10",
    ghost: "text-teal-300 hover:bg-teal-500/10",
    dashed: "border border-dashed border-teal-400/50 text-teal-300 hover:bg-teal-500/10",
  },
  slate: {
    solid: "bg-itec-box text-itec-text border border-itec-box hover:bg-itec-surface",
    outline: "border border-itec-border text-itec-muted hover:text-itec-text hover:bg-itec-surface/70",
    ghost: "text-itec-muted hover:text-itec-text hover:bg-itec-surface/70",
    dashed: "border border-dashed border-itec-border text-itec-muted hover:text-itec-text hover:bg-itec-surface/70",
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  hierarchy = "solid",
  fullWidth = false,
  icon,
  iconRight,
  isLoading = false,
  text,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = [
    "inline-flex items-center justify-center gap-2 cursor-pointer",
    "px-3 py-2 text-xs font-semibold rounded-[10px]",
    "transition-all duration-200 outline-none"
  ].join(" ");

  const widthStyles = fullWidth ? "w-full" : "w-fit";
  const disabledStyles = disabled || isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer";

  return (
    <button
      className={cn(baseStyles, widthStyles, THEMES[variant][hierarchy], disabledStyles, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon ? <span className="inline-flex items-center leading-none">{icon}</span> : null}
          {text ?? children}
          {iconRight ? <span className="inline-flex items-center leading-none">{iconRight}</span> : null}
        </>
      )}
    </button>
  );
};
