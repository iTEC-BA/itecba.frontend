import React from "react";
import { cn } from "@/lib/utils";

export interface ActivityCard {
  iconClass: string;   // clase ti ti-*
  iconColor: string;   // ej: "text-itec-sky"
  title: string;
  subtitle: string;
}

interface ProfileActivityGridProps {
  cards: ActivityCard[];
  className?: string;
}

export const ProfileActivityGrid: React.FC<ProfileActivityGridProps> = ({
  cards,
  className,
}) => (
  <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-3", className)}>
    {cards.map((c, i) => (
      <div
        key={i}
        className="group cursor-pointer rounded-xl border border-itec-border bg-itec-box2 p-3.5 transition hover:border-itec-border/80"
      >
        <div className="mb-2">
          <span className={cn(c.iconClass, "text-xl", c.iconColor)} />
        </div>
        <p className="text-[12.5px] font-semibold text-itec-text leading-snug">{c.title}</p>
        <p className="mt-0.5 text-[11px] text-itec-muted">{c.subtitle}</p>
      </div>
    ))}
  </div>
);

