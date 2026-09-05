import React from "react";
import { cn } from "@/lib/utils";

type GlowColor = "sky" | "accent" | "amber" | "emerald" | "purple" | "none";
type GlassVariant = "default" | "elevated" | "sunken" | "outlined" | "solid";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: GlowColor;
  hover?: boolean;
  onClick?: () => void;
  variant?: GlassVariant;
  as?: "div" | "article" | "section" | "li";
  style?: React.CSSProperties;
}

const GLOW_MAP: Record<GlowColor, string> = {
  sky: "hover:border-itec-sky/30",
  accent: "hover:border-itec-accent/30",
  amber: "hover:border-itec-amber/30",
  emerald: "hover:border-itec-emerald/30",
  purple: "hover:border-itec-purple/30",
  none: "",
};

const VARIANT_MAP: Record<GlassVariant, string> = {
  default: "bg-itec-box border border-itec-border",
  elevated: "bg-itec-surface border border-itec-border",
  sunken: "bg-black/20 border border-white/5",
  outlined: "bg-transparent border border-itec-border",
  solid: "bg-itec-box border border-itec-border",
};

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", glow = "none", hover = false, onClick, variant = "default", as = "div", style }) => {
  const Comp = as;
  return (
    <Comp
      onClick={onClick}
      style={style}
      className={cn(
        "relative overflow-hidden rounded-[1.9rem] transition-all duration-300",
        VARIANT_MAP[variant],
        glow !== "none" && GLOW_MAP[glow],
        hover && "hover:-translate-y-1 hover:scale-[1.01]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
};
