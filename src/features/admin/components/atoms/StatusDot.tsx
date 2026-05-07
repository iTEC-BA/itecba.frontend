// src/features/admin/components/atoms/StatusDot.tsx
import React from "react";
import { cn } from "@/lib/utils";

type Status = "online" | "offline" | "warning" | "error";

const STATUS_MAP: Record<Status, string> = {
  online:  "bg-itec-emerald shadow-[0_0_6px_rgba(16,185,129,0.5)]",
  offline: "bg-itec-gray",
  warning: "bg-itec-amber shadow-[0_0_6px_rgba(245,158,11,0.5)]",
  error:   "bg-itec-accent shadow-[0_0_6px_rgba(212,19,19,0.5)]",
};

export const StatusDot: React.FC<{ status: Status; pulse?: boolean; className?: string }> = ({
  status, pulse = false, className,
}) => (
  <span className={cn("relative inline-flex w-2.5 h-2.5 rounded-full", STATUS_MAP[status], className)}>
    {pulse && (
      <span className={cn(
        "absolute inset-0 rounded-full animate-ping opacity-50",
        STATUS_MAP[status]
      )} />
    )}
  </span>
);
