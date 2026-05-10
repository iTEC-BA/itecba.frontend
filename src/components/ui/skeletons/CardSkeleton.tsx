// CardSkeleton.tsx — Skeleton para cards genéricas (cursos, recursos, grupos, etc.)
import React from "react";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  lines?: number;       // líneas de texto a simular
  hasImage?: boolean;   // mostrar placeholder de imagen
  hasAvatar?: boolean;  // mostrar placeholder circular
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className,
  lines = 2,
  hasImage = false,
  hasAvatar = false,
}) => (
  <div
    className={cn(
      "bg-itec-box border border-itec-border rounded-xl p-4 animate-pulse",
      className
    )}
  >
    {hasImage && (
      <div className="w-full h-36 rounded-lg bg-white/5 mb-4" />
    )}
    <div className="flex items-start gap-3">
      {hasAvatar && (
        <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
      )}
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-white/5 rounded-lg w-3/4" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-white/5 rounded-md"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Wrapper para grilla de skeletons
export const CardSkeletonGrid: React.FC<{
  count?: number;
  cols?: string;
  cardProps?: CardSkeletonProps;
}> = ({ count = 6, cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", cardProps }) => (
  <div className={`grid gap-4 ${cols}`}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} {...cardProps} />
    ))}
  </div>
);
