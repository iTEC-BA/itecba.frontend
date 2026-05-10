import React, { useState } from "react";
import { MainLayout } from "@components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Button } from "@components/ui/Button";
import { Icons } from "@components/ui/icons/Icons";
import { useAuth } from "@context/AuthContext";
import { usePageTitle } from "@hooks/usePageTitle";
import {
  useCalendarEvents,
  EventType,
  CalendarEvent,
} from "@features/calendar/hooks/useCalendarEvents";
import { CalendarAdminModal } from "@features/calendar/components/CalendarAdminModal";
import { CalendarDetailModal } from "@features/calendar/components/CalendarDetailModal";
import { CalendarCountdown } from "@features/calendar/components/CalendarCountdown";

// ── Configuración de tipos ────────────────────────────────
const TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; dot: string }
> = {
  examen: {
    label: "Examen",
    color: "bg-itec-red/12 text-[#e01540] border-itec-red/20",
    dot:   "bg-[#e01540]",
  },
  institucional: {
    label: "Institucional",
    color: "bg-[#004aad]/12 text-[#5b9cf6] border-[#004aad]/20",
    dot:   "bg-[#5b9cf6]",
  },
  feriado: {
    label: "Feriado",
    color: "bg-white/8 text-[#9aa3b0] border-itec-border",
    dot:   "bg-[#9aa3b0]",
  },
  beca: {
    label: "Beca",
    color: "bg-[#f0b100]/12 text-[#f0b100] border-[#f0b100]/20",
    dot:   "bg-[#f0b100]",
  },
  actividad: {
    label: "Actividad",
    color: "bg-[#008854]/12 text-[#2fcc8a] border-[#008854]/20",
    dot:   "bg-[#2fcc8a]",
  },
};

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const FILTER_TYPES: (EventType | "Todos")[] = [
  "Todos","examen","institucional","feriado","beca","actividad",
];

// ════════════════════════════════════════════════════════════
export const CalendarioPage: React.FC = () => {
  usePageTitle("Calendario Académico");

  const { isAdmin } = useAuth();
  const { events, loading, createEvent, updateEvent, deleteEvent } =
    useCalendarEvents();

  // ── Estado compartido ──────────────────────────────────
  const [filter, setFilter] = useState<EventType | "Todos">("Todos");

  // ── Estado admin ───────────────────────────────────────
  const [adminOpen, setAdminOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState<CalendarEvent | null>(null);

  // ── Estado usuario ─────────────────────────────────────
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  // ── Derived ────────────────────────────────────────────
  const filtered = events.filter(
    (e) => filter === "Todos" || e.type === filter,
  );

  const grouped = filtered.reduce<Record<string, CalendarEvent[]>>(
    (acc, e) => {
      const key = e.date.slice(0, 7);
      (acc[key] ??= []).push(e);
      return acc;
    },
    {},
  );

  // El próximo evento para el countdown es el primero de todos (sin filtro de tipo)
  const nextEvent = events[0] ?? null;

  // ── Handlers ───────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditTarget(null);
    setAdminOpen(true);
  };

  const handleOpenEdit = (ev: CalendarEvent) => {
    setEditTarget(ev);
    setAdminOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta fecha del calendario?")) return;
    await deleteEvent(id);
  };

  // ────────────────────────────────────────────────────────
  return (
    <MainLayout>
      {/* ── Header ────────────────────────────────────── */}
      <PageHeader
        title="Calendario Académico"
        description="Fechas de parciales, finales, feriados, becas y actividades institucionales de la FRBA."
        iconType="calendar"
        colorTheme="blue"
      >
        {isAdmin && (
          <Button
            variant="danger"
            hierarchy="solid"
            text="+ Nueva fecha"
            onClick={handleOpenCreate}
          />
        )}
      </PageHeader>

      {/* ── Filtros ───────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar">
        {FILTER_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
              filter === t
                ? "bg-itec-red border-itec-red text-white"
                : "bg-transparent border-itec-border text-[#9aa3b0] hover:border-white/20"
            }`}
          >
            {t === "Todos" ? "Todos" : TYPE_CONFIG[t as EventType].label}
          </button>
        ))}
      </div>

      {/* ── Countdown (solo usuarios) ─────────────────── */}
      {!isAdmin && !loading && nextEvent && (
        <CalendarCountdown event={nextEvent} typeConfig={TYPE_CONFIG} />
      )}

      {/* ── Loading ───────────────────────────────────── */}
      {loading && (
        <div className="py-10 text-center text-[#5a6475] text-sm">
          Cargando fechas...
        </div>
      )}

      {/* ── Eventos agrupados por mes ─────────────────── */}
      {!loading &&
        Object.keys(grouped)
          .sort()
          .map((monthKey) => {
            const [year, month] = monthKey.split("-");
            return (
              <div key={monthKey} className="mb-7">
                {/* Cabecera de mes */}
                <h2 className="text-xs font-semibold text-[#5a6475] uppercase tracking-widest mb-3">
                  {MONTHS[parseInt(month) - 1]} {year}
                </h2>

                <div className="flex flex-col gap-2">
                  {grouped[monthKey].map((ev) => {
                    const d   = new Date(ev.date + "T00:00:00");
                    const day = d.getDate();
                    const cfg = TYPE_CONFIG[ev.type];

                    return (
                      <div
                        key={ev.id}
                        onClick={() => !isAdmin && setDetailEvent(ev)}
                        className={`
                          flex items-center gap-3 bg-itec-card border border-white/7
                          rounded-xl p-3 transition-colors
                          ${!isAdmin
                            ? "cursor-pointer hover:border-white/15 hover:bg-white/3"
                            : "hover:border-white/10"
                          }
                        `}
                      >
                        {/* Fecha box */}
                        <div
                          className={`shrink-0 w-11 h-11 rounded-xl flex flex-col items-center
                            justify-center border ${cfg.color}`}
                        >
                          <span className="text-lg font-bold leading-none">{day}</span>
                          <span className="text-[8px] uppercase mt-0.5">
                            {MONTHS[parseInt(month) - 1].slice(0, 3)}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-itec-text truncate">
                            {ev.title}
                          </p>
                          {ev.subtitle && (
                            <p className="text-xs text-[#5a6475] mt-0.5 truncate">
                              {ev.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Admin: botones editar/borrar | Usuario: dot */}
                        {isAdmin ? (
                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Editar */}
                            <button
                              onClick={() => handleOpenEdit(ev)}
                              aria-label="Editar evento"
                              className="p-1.5 rounded-lg text-[#5a6475] hover:text-[#5b9cf6]
                                hover:bg-[#004aad]/10 transition-colors"
                            >
                              {/* pencil icon inline */}
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" strokeWidth={1.8}>
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>

                            {/* Eliminar */}
                            <button
                              onClick={() => handleDelete(ev.id)}
                              aria-label="Eliminar evento"
                              className="p-1.5 rounded-lg text-[#5a6475] hover:text-[#e01540]
                                hover:bg-itec-red/10 transition-colors"
                            >
                              {/* trash icon inline */}
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" strokeWidth={1.8}>
                                <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
                                <path d="M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 11v6M14 11v6" strokeLinecap="round"/>
                                <path d="M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

      {/* ── Empty state ───────────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#004aad]/15 flex items-center justify-center">
            <Icons type="calendar" className="w-5 h-5 text-[#5b9cf6]" />
          </div>
          <p className="text-[#5a6475] text-sm">
            {isAdmin
              ? 'No hay eventos aún. Creá uno con "+ Nueva fecha".'
              : "No hay eventos en esta categoría."}
          </p>
        </div>
      )}

      {/* ── Admin Modal (crear / editar) ──────────────── */}
      {isAdmin && (
        <CalendarAdminModal
          isOpen={adminOpen}
          onClose={() => { setAdminOpen(false); setEditTarget(null); }}
          event={editTarget}
          onCreate={createEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
        />
      )}

      {/* ── Detail Modal (usuario) ────────────────────── */}
      {!isAdmin && (
        <CalendarDetailModal
          isOpen={!!detailEvent}
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          typeConfig={TYPE_CONFIG}
        />
      )}
    </MainLayout>
  );
};
