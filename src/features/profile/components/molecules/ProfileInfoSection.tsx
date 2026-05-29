import React from "react";
import { cn } from "@/lib/utils";

export interface InfoRow {
  icon?: string; // clase ti ti-*
  text: string;
  subtext?: string;
  prefix?: React.ReactNode; // para logotipos / avatares custom
}

interface ProfileInfoSectionProps {
  title: string;
  rows: InfoRow[];
  onEdit?: () => void;
  className?: string;
}

/**
 * Sección de información del perfil (datos personales, trabajo, educación, redes).
 * Corresponde a .info-section del diseño HTML de referencia.
 */
export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  title,
  rows,
  onEdit,
  className,
}) => (
  <div
    className={cn(
      "rounded-2xl border border-itec-border bg-itec-box p-4 sm:p-5",
      className
    )}
  >
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-['Barlow_Condensed',sans-serif] text-base font-bold text-itec-text">
        {title}
      </h3>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-[11px] text-itec-muted transition hover:text-itec-text"
        >
          editar
        </button>
      )}
    </div>

    <div className="divide-y divide-itec-border/60">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          {row.prefix ? (
            row.prefix
          ) : row.icon ? (
            <span className={cn(row.icon, "w-5 text-center text-base text-itec-muted shrink-0")} />
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-[13px] text-itec-text">{row.text}</p>
            {row.subtext && (
              <p className="truncate text-[11px] text-itec-muted">{row.subtext}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
