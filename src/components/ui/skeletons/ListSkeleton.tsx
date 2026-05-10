// ListSkeleton.tsx — Skeleton para listas de items (FAQs, mensajes, etc.)
import React from "react";
import { cn } from "@/lib/utils";

interface ListSkeletonProps {
  count?: number;
  className?: string;
  withIcon?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 4,
  className,
  withIcon = false,
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 animate-pulse"
      >
        {withIcon && (
          <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0" />
        )}
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-white/5 rounded-md" style={{ width: `${80 - (i % 3) * 10}%` }} />
          <div className="h-2.5 bg-white/5 rounded-md w-2/3" />
        </div>
      </div>
    ))}
  </div>
);
