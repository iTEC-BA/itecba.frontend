import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressSubject {
  name: string;
  pct: number;                        // 0–100
  status: "aprobada" | "cursando" | "pendiente";
  grade?: number;
}

interface ProfileProgressCardProps {
  subjects: ProgressSubject[];
  overallPct?: number;
  title?: string;
  className?: string;
}

const STATUS_COLOR: Record<ProgressSubject["status"], string> = {
  aprobada: "bg-itec-emerald",
  cursando: "bg-itec-amber",
  pendiente: "bg-itec-border",
};

const STATUS_LABEL_COLOR: Record<ProgressSubject["status"], string> = {
  aprobada: "text-itec-emerald",
  cursando: "text-itec-amber",
  pendiente: "text-itec-muted",
};

/**
 * Tarjeta de progreso académico con barras de avance por materia.
 * Corresponde a .prog-card del HTML de referencia.
 */
export const ProfileProgressCard: React.FC<ProfileProgressCardProps> = ({
  subjects,
  overallPct,
  title = "Progreso de carrera",
  className,
}) => (
  <div
    className={cn(
      "rounded-2xl border border-itec-border bg-itec-box2 p-4 sm:p-5",
      className
    )}
  >
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-['Barlow_Condensed',sans-serif] text-base font-bold text-itec-text">
        {title}
      </h3>
      {overallPct !== undefined && (
        <span className="font-['Barlow_Condensed',sans-serif] text-xl font-bold text-itec-emerald">
          {overallPct}%
        </span>
      )}
    </div>

    <div className="space-y-2.5">
      {subjects.map((s, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-[72px] shrink-0 text-[13px] text-itec-text truncate">
            {s.name}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-itec-surface">
            <div
              className={cn("h-full rounded-full transition-all duration-500", STATUS_COLOR[s.status])}
              style={{ width: `${s.pct}%` }}
            />
          </div>
          <span className={cn("w-24 shrink-0 text-right text-[11px]", STATUS_LABEL_COLOR[s.status])}>
            {s.status === "aprobada" && s.grade ? `Aprobada · ${s.grade}` : s.status === "cursando" ? `Cursando · ${s.pct}%` : "Pendiente"}
          </span>
        </div>
      ))}
    </div>
  </div>
);
