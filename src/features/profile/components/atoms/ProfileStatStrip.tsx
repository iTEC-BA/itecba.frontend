import React from "react";
import { cn } from "@/lib/utils";

export interface ProfileStat {
  value: string | number;
  label: string;
  accentClass?: string;
}

interface ProfileStatStripProps {
  stats: ProfileStat[];
  className?: string;
}

/**
 * Franja de estadísticas horizontal del perfil:
 * Puntos / Materias / Grupos / Publicaciones / Seguidores / Siguiendo
 */
export const ProfileStatStrip: React.FC<ProfileStatStripProps> = ({
  stats,
  className,
}) => (
  <div
    className={cn(
      "flex divide-x divide-itec-border border-y border-itec-border",
      className
    )}
  >
    {stats.map((s, i) => (
      <div
        key={i}
        className="flex flex-1 flex-col items-center gap-1 py-3 px-1 min-w-0"
      >
        <span
          className={cn(
            "font-['Barlow_Condensed',sans-serif] text-xl font-bold leading-none sm:text-2xl",
            s.accentClass ?? "text-itec-text"
          )}
        >
          {s.value}
        </span>
        <span className="truncate text-[10px] text-itec-muted">{s.label}</span>
      </div>
    ))}
  </div>
);
