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
  sky: "hover:shadow-[0_0_24px_rgba(56,189,248,0.18)] hover:border-itec-sky/30",
  accent: "hover:shadow-[0_0_24px_rgba(212,19,19,0.18)] hover:border-itec-accent/30",
  amber: "hover:shadow-[0_0_24px_rgba(245,158,11,0.18)] hover:border-itec-amber/30",
  emerald: "hover:shadow-[0_0_24px_rgba(16,185,129,0.18)] hover:border-itec-emerald/30",
  purple: "hover:shadow-[0_0_24px_rgba(168,85,247,0.18)] hover:border-itec-purple/30",
  none: "",
};
const VARIANT_MAP: Record<GlassVariant, string> = {
  default: "bg-itec-box/80 backdrop-blur-md border border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
  elevated: "bg-itec-box/90 backdrop-blur-lg border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
  sunken: "bg-itec-bg/60 backdrop-blur-sm border border-white/5",
  outlined: "bg-transparent backdrop-blur-sm border border-itec-border",
  solid: "bg-itec-box border border-itec-border shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
};
export const GlassCard: React.FC<GlassCardProps> = ({
  children, className, glow = "none", hover = false,
  onClick, variant = "default", as: Tag = "div", style,
}) => (
  <Tag
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    style={style}
    className={cn(
      "relative overflow-hidden rounded-3xl transition-all duration-300",
      VARIANT_MAP[variant],
      hover && "cursor-pointer hover:scale-[1.018] hover:-translate-y-0.5",
      glow !== "none" && GLOW_MAP[glow],
      className
    )}
  >
    {children}
  </Tag>
);
