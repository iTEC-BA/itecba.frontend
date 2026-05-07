import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── Grupos ────────────────────────────────────────────────────────────────────
export interface StudyGroup {
  name: string;
  members: string;
  iconClass: string;
  iconColor: string;
  bgClass: string;  // ej: "bg-itec-amber/10"
  status?: "activo" | "activo hoy";
}

// ── Fechas ────────────────────────────────────────────────────────────────────
export interface UpcomingDate {
  day: string;
  month: string;
  title: string;
  subtitle: string;
  color?: string; // bg override ej: "bg-itec-emerald"
}

// ── Amigos ────────────────────────────────────────────────────────────────────
export interface FriendSuggestion {
  initials: string;
  name: string;
  shared: string;
}

// ── Novedades ─────────────────────────────────────────────────────────────────
export interface NewsItem {
  title: string;
  meta: string;
  dotColor?: string; // ej: "bg-itec-emerald"
}

interface ProfileRightPanelProps {
  groups?: StudyGroup[];
  dates?: UpcomingDate[];
  friends?: FriendSuggestion[];
  news?: NewsItem[];
  className?: string;
}

const SECTION = "px-4 pb-5 border-b border-itec-border mb-5 last:border-b-0 last:mb-0";
const RP_TITLE = "font-['Barlow_Condensed',sans-serif] text-[15px] font-bold text-itec-text mb-3 flex items-center justify-between";

/**
 * Panel lateral derecho del perfil:
 * Grupos de estudio / Próximas fechas / Amigos / Novedades.
 * Corresponde a .right-panel del HTML de referencia.
 */
export const ProfileRightPanel: React.FC<ProfileRightPanelProps> = ({
  groups = [],
  dates = [],
  friends = [],
  news = [],
  className,
}) => (
  <aside
    aria-label="Panel lateral de perfil"
    className={cn(
      "flex flex-col rounded-[2rem] border border-itec-border bg-itec-box py-5",
      className
    )}
  >
    {/* Grupos */}
    {groups.length > 0 && (
      <div className={SECTION}>
        <p className={RP_TITLE}>
          Grupos de estudio
          <Link to="/grupos" className="text-[11px] font-normal text-itec-sky">ver todos</Link>
        </p>
        {groups.map((g, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b border-itec-border/50 py-2 last:border-b-0">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", g.bgClass)}>
              <span className={cn(g.iconClass, "text-sm", g.iconColor)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-itec-text">{g.name}</p>
              <p className="text-[11px] text-itec-muted">{g.members}</p>
            </div>
            {g.status && (
              <span className="rounded-md bg-itec-emerald/10 px-1.5 py-0.5 text-[10px] font-semibold text-itec-emerald">
                {g.status}
              </span>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Fechas */}
    {dates.length > 0 && (
      <div className={SECTION}>
        <p className={RP_TITLE}>
          Próximas fechas
          <Link to="/calendario" className="text-[11px] font-normal text-itec-sky">calendario</Link>
        </p>
        {dates.map((d, i) => (
          <div key={i} className="mb-2 flex items-center gap-2.5 last:mb-0">
            <div className={cn("flex min-w-[38px] flex-col items-center rounded-lg px-2 py-1.5 text-white", d.color ?? "bg-itec-accent")}>
              <span className="font-['Barlow_Condensed',sans-serif] text-lg font-bold leading-none">{d.day}</span>
              <span className="text-[9px] uppercase opacity-75">{d.month}</span>
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-itec-text leading-snug">{d.title}</p>
              <p className="text-[11px] text-itec-muted">{d.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Amigos */}
    {friends.length > 0 && (
      <div className={SECTION}>
        <p className={RP_TITLE}>Amigos con cosas en común</p>
        {friends.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b border-itec-border/50 py-2 last:border-b-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-itec-surface text-[12px] font-bold text-itec-muted">
              {f.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-itec-text">{f.name}</p>
              <p className="text-[11px] text-itec-muted">{f.shared}</p>
            </div>
            <button className="rounded-lg border border-itec-border bg-itec-surface px-2.5 py-1 text-[11px] font-semibold text-itec-text transition hover:bg-itec-box2">
              Seguir
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Novedades */}
    {news.length > 0 && (
      <div className={SECTION}>
        <p className={RP_TITLE}>
          Novedades
          <Link to="/novedades" className="text-[11px] font-normal text-itec-sky">ver todas</Link>
        </p>
        {news.map((n, i) => (
          <div key={i} className="mb-2 flex items-start gap-2 last:mb-0">
            <div className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", n.dotColor ?? "bg-itec-sky")} />
            <div>
              <p className="text-[12.5px] font-semibold leading-snug text-itec-text">{n.title}</p>
              <p className="mt-0.5 text-[11px] text-itec-muted">{n.meta}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </aside>
);
