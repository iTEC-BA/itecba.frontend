import React from "react";
import { cn } from "@/lib/utils";

export interface MetaTag {
  icon: string; // clase ti ti-*
  label: string;
}

interface ProfileMetaRowProps {
  tags: MetaTag[];
  className?: string;
}

/**
 * Fila de etiquetas de metadatos del perfil:
 * ubicación, trabajo, escuela, red social, etc.
 */
export const ProfileMetaRow: React.FC<ProfileMetaRowProps> = ({
  tags,
  className,
}) => (
  <div className={cn("flex flex-wrap gap-2", className)}>
    {tags.map((tag, i) => (
      <span
        key={i}
        className="inline-flex items-center gap-1.5 rounded-full border border-itec-border bg-itec-surface px-3 py-1 text-[12px] text-itec-muted"
      >
        <span className={cn(tag.icon, "text-sm text-itec-muted")} />
        {tag.label}
      </span>
    ))}
  </div>
);
