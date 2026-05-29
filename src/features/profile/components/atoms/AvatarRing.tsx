import React from "react";
import { cn } from "@/lib/utils";

interface AvatarRingProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  glow?: boolean;
  online?: boolean;
  className?: string;
  ring?: string;
}

const SIZE_MAP = {
  xs: { ring: "w-8 h-8 text-xs", dot: "w-2 h-2 border-[2px]" },
  sm: { ring: "w-10 h-10 text-sm", dot: "w-2.5 h-2.5 border-[2px]" },
  md: { ring: "w-14 h-14 text-lg", dot: "w-3 h-3 border-[2px]" },
  lg: { ring: "w-20 h-20 text-2xl", dot: "w-3.5 h-3.5 border-[3px]" },
  xl: { ring: "w-24 h-24 text-3xl", dot: "w-4 h-4 border-[3px]" },
  "2xl": { ring: "w-32 h-32 text-4xl", dot: "w-5 h-5 border-[3px]" },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export const AvatarRing: React.FC<AvatarRingProps> = ({
  src,
  name,
  size = "md",
  glow = false,
  online,
  className,
  ring,
}) => {
  const s = SIZE_MAP[size];
  return (
    <div className={cn("relative shrink-0", className)}>
      {glow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-itec-sky/25 via-itec-purple/15 to-itec-accent/10 blur-xl scale-105 opacity-60" />
      )}
      <div
        className={cn(
          "relative overflow-hidden rounded-full flex items-center justify-center font-bold text-itec-muted",
          "bg-gradient-to-br from-itec-box to-itec-surface border border-itec-border shadow-[0_16px_30px_rgba(0,0,0,0.3)]",
          ring,
          s.ring
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="select-none tracking-tight">{getInitials(name)}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-itec-box shadow-[0_0_0_4px_rgba(0,0,0,0.12)]",
            s.dot,
            online ? "bg-itec-emerald" : "bg-itec-gray"
          )}
        />
      )}
    </div>
  );
};
