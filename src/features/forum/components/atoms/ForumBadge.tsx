// src/features/forum/components/atoms/ForumBadge.tsx
import React from "react";
 
interface ForumBadgeProps {
  label:   string;
  variant?: "muted" | "blue" | "amber" | "accent";
}
 
const VARIANTS = {
  muted:  "bg-itec-surface text-itec-muted",
  blue:   "bg-itec-blue/15 text-itec-sky",
  amber:  "bg-itec-amber/15 text-itec-amber",
  accent: "bg-itec-accent/15 text-itec-accent",
};
 
export const ForumBadge: React.FC<ForumBadgeProps> = ({ label, variant = "muted" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]}`}>
    {label}
  </span>
);
