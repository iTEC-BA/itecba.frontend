import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { MainLayout } from "@components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Button } from "@components/ui/Button";
import { useAuth } from "@context/AuthContext";
import { usePageTitle } from "@hooks/usePageTitle";
import { useCalendarEvents, EventType, CalendarEvent } from "@features/calendar/hooks/useCalendarEvents";
import { CalendarSkeleton } from "@features/calendar/components/CalendarSkeleton";
import { AlertCircle } from "lucide-react";

// ── Lazy Loading de componentes pesados o modales ──
const CalendarAdminModal = lazy(() => import("@features/calendar/components/CalendarAdminModal").then(m => ({ default: m.CalendarAdminModal })));
const CalendarDetailModal = lazy(() => import("@features/calendar/components/CalendarDetailModal").then(m => ({ default: m.CalendarDetailModal })));
const CalendarCountdown = lazy(() => import("@features/calendar/components/CalendarCountdown").then(m => ({ default: m.CalendarCountdown })));

const TYPE_CONFIG: Record<EventType, { label: string; color: string; dot: string }> = {
  examen: { label: "Examen", color: "bg-itec-red/12 text-[#e01540] border-itec-red/20", dot: "bg-[#e01540]" },
  institucional: { label: "Institucional", color: "bg-[#004aad]/12 text-[#5b9cf6] border-[#004aad]/20", dot: "bg-[#5b9cf6]" },
  feriado: { label: "Feriado", color: "bg-white/8 text-[#9aa3b0] border-itec-border", dot: "bg-[#9aa3b0]" },
  beca: { label: "Beca", color: "bg-[#f0b100]/12 text-[#f0b100] border-[#f0b100]/20", dot: "bg-[#f0b100]" },
  actividad: { label: "Actividad", color: "bg-[#008854]/12 text-[#2fcc8a] border-[#008854]/20", dot: "bg-[#2fcc8a]" },
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const FILTER_TYPES: (EventType | "Todos")[] = ["Todos","examen","institucional","feriado","beca","actividad"];

export const CalendarioPage: React.FC = () => {
  usePageTitle("Calendario Académico");
  const { isAdmin } = useAuth();
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
  
  const [filter, setFilter] = useState<EventType | "Todos">("Todos");
  const [adminOpen, setAdminOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CalendarEvent | null>(null);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  // ── Memorización de cálculos pesados (useMemo) ──
  const filtered = useMemo(() => {
    return events.filter(e => filter === "Todos" || e.type === filter);
  }, [events, filter]);

  const nextEvent = useMemo(() => {
    return events[0] ?? null;
  }, [events]);

  // ── Memorización de funciones para evitar re-renders en hijos (useCallback) ──
  const handleFilterChange = useCallback((type: EventType | "Todos") => {
    setFilter(type);
  }, []);

  const handleOpenAdminModal = useCallback((ev: CalendarEvent | null = null) => {
    setEditTarget(ev);
    setAdminOpen(true);
  }, []);

  const handleCloseAdminModal = useCallback(() => {
    setAdminOpen(false);
    setEditTarget(null);
  }, []);

  const handleOpenDetailModal = useCallback((ev: CalendarEvent) => {
    setDetailEvent(ev);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailEvent(null);
  }, []);

  const handleCardClick = useCallback((ev: CalendarEvent) => {
    if (isAdmin) {
      handleOpenAdminModal(ev);
    } else {
      handleOpenDetailModal(ev);
    }
  }, [isAdmin, handleOpenAdminModal, handleOpenDetailModal]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto pb-safe">
        
        {/* HEADER CON BOTÓN ADMIN */}
        <PageHeader 
          title="Calendario Académico" 
          description="Cronograma de fechas críticas, inscripciones y feriados." 
          iconType="calendar" 
          colorTheme="blue"
        >
          {isAdmin && (
            <div className="flex w-full justify-start sm:justify-end sm:w-auto -mt-2 sm:mt-0">
              <Button variant="danger" hierarchy="solid" text="+ Nueva fecha" onClick={() => handleOpenAdminModal(null)} />
            </div>
          )}
        </PageHeader>

        {error && (
          <div className="flex items-center gap-2 mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* 1. FILTROS */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {FILTER_TYPES.map(t => (
            <button 
              key={t} 
              onClick={() => handleFilterChange(t)} 
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                filter === t 
                  ? "bg-itec-red border-itec-red text-white" 
                  : "bg-transparent border-itec-border text-[#9aa3b0] hover:border-white/20"
              }`}
            >
              {t === "Todos" ? "Todos" : TYPE_CONFIG[t as EventType].label}
            </button>
          ))}
        </div>

        {/* 2. RENDER CONDICIONAL DE CARGA / CONTENIDO */}
        {loading ? (
          <CalendarSkeleton />
        ) : (
          <>
            {/* TEMPORIZADOR CON SUSPENSE */}
            {nextEvent && (
              <Suspense fallback={<div className="h-[120px] bg-white/5 animate-pulse rounded-xl mb-6"></div>}>
                <CalendarCountdown event={nextEvent} typeConfig={TYPE_CONFIG} />
              </Suspense>
            )}

            {/* CARDS / GRID DE EVENTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.length === 0 && (
                <div className="col-span-full py-12 text-center text-sm text-[#5a6475] border border-dashed border-itec-border rounded-xl">
                  No hay eventos para mostrar en esta categoría.
                </div>
              )}
              
              {filtered.map(ev => {
                const d = new Date(ev.date + "T00:00:00");
                const cfg = TYPE_CONFIG[ev.type];
                
                return (
                  <div 
                    key={ev.id} 
                    onClick={() => handleCardClick(ev)}
                    className={`flex items-center gap-3 bg-itec-card border border-white/5 rounded-xl p-4 cursor-pointer hover:border-white/10 hover:bg-white/[0.02] transition-colors ${isAdmin ? "hover:border-itec-red/30" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-black/20 shrink-0 border border-white/5">
                      <span className="text-xs text-[#5a6475] uppercase font-bold leading-none">{MONTHS[d.getMonth()].slice(0, 3)}</span>
                      <span className="text-xl font-bold text-white leading-none mt-1">{d.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${cfg.color.split(" ")[1]}`}>{cfg.label}</span>
                      </div>
                      <h3 className="text-sm font-bold text-itec-text truncate leading-tight">{ev.title}</h3>
                      {ev.subtitle && <p className="text-xs text-[#5a6475] truncate mt-0.5">{ev.subtitle}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* MODALES CON SUSPENSE */}
      <Suspense fallback={null}>
        <CalendarAdminModal 
          isOpen={adminOpen} 
          onClose={handleCloseAdminModal} 
          event={editTarget} 
          onCreate={createEvent} 
          onUpdate={updateEvent} 
          onDelete={deleteEvent} 
        />
        <CalendarDetailModal 
          isOpen={!!detailEvent} 
          event={detailEvent} 
          onClose={handleCloseDetailModal} 
          typeConfig={TYPE_CONFIG} 
        />
      </Suspense>
    </MainLayout>
  );
};
