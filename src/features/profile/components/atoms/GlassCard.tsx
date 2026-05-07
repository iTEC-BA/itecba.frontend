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
  sky: "hover:border-itec-sky/30 hover:shadow-[0_0_34px_rgba(56,189,248,0.16)]",
  accent: "hover:border-itec-accent/30 hover:shadow-[0_0_34px_rgba(212,19,19,0.16)]",
  amber: "hover:border-itec-amber/30 hover:shadow-[0_0_34px_rgba(245,158,11,0.16)]",
  emerald: "hover:border-itec-emerald/30 hover:shadow-[0_0_34px_rgba(16,185,129,0.16)]",
  purple: "hover:border-itec-purple/30 hover:shadow-[0_0_34px_rgba(168,85,247,0.16)]",
  none: "",
};

const VARIANT_MAP: Record<GlassVariant, string> = {
  default: "bg-itec-box/82 backdrop-blur-xl border border-itec-border shadow-[0_10px_30px_rgba(0,0,0,0.28)]",
  elevated: "bg-itec-box/92 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
  sunken: "bg-itec-surface/70 backdrop-blur-xl border border-white/6 shadow-inner shadow-black/20",
  outlined: "bg-transparent backdrop-blur-xl border border-itec-border/90 shadow-[0_12px_30px_rgba(0,0,0,0.22)]",
  solid: "bg-itec-box2 border border-itec-border shadow-[0_16px_42px_rgba(0,0,0,0.36)]",
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glow = "none",
  hover = false,
  onClick,
  variant = "default",
  as = "div",
  style,
}) => {
  const Comp = as;
  return (
    <Comp
      onClick={onClick}
      style={style}
      className={cn(
        "relative overflow-hidden rounded-[1.9rem]",
        "transition-all duration-300",
        VARIANT_MAP[variant],
        glow !== "none" && GLOW_MAP[glow],
        hover && "hover:-translate-y-1 hover:scale-[1.01]",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03),transparent_28%)]" />
      {children}
    </Comp>
  );
};
