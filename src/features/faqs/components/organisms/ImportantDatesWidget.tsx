// src/features/faqs/components/organisms/ImportantDatesWidget.tsx
import React, { useState, Suspense, useMemo } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { cn } from "@/lib/utils";

const AddDateModal = React.lazy(() =>
  import("./AddDateModal").then((m) => ({ default: m.AddDateModal }))
);

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description: string;
  expiryDate?: string;
}

interface Props {
  isAdmin: boolean;
}

// SVG Calendar inline
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const ImportantDatesWidget: React.FC<Props> = ({ isAdmin }) => {
  const [dates, setDates] = useState<ImportantDate[]>([
    {
      id: "1",
      title: "Inscripción a Cursada",
      date: "15 al 20 de Marzo",
      description: "A través del sistema SIGA.",
      expiryDate: "2026-03-21T00:00:00",
    },
    {
      id: "2",
      title: "Inicio 1er Cuatrimestre",
      date: "25 de Marzo",
      description: "Comienzo oficial de clases.",
      expiryDate: "2026-03-26T00:00:00",
    },
    {
      id: "3",
      title: "Exámenes Finales",
      date: "10 de Julio",
      description: "Turno de julio. Anotarse 48hs antes.",
      expiryDate: "2026-07-15T00:00:00",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeDates = useMemo(() => {
    const now = new Date().getTime();
    return dates.filter((item) => {
      if (!item.expiryDate) return true;
      return new Date(item.expiryDate).getTime() > now;
    });
  }, [dates]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-itec-border bg-itec-box p-6 shadow-glass h-full animate-in fade-in duration-500">
      {/* Glow sutil */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-itec-amber/5 blur-3xl" />

      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-itec-amber/20 bg-itec-amber/10 text-itec-amber">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Académico
            </p>
            <h2 className="text-sm font-bold tracking-tight text-itec-text">
              Calendario
            </h2>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            title="Agregar fecha"
            className={cn(
              "flex items-center gap-1.5 rounded-xl border border-itec-amber/20 bg-itec-amber/10 px-3 py-1.5",
              "text-xs font-bold text-itec-amber transition-all",
              "hover:bg-itec-amber/20 hover:border-itec-amber/40 active:scale-95"
            )}
          >
            <Icons type="plus" className="h-3.5 w-3.5" />
            Agregar
          </button>
        )}
      </div>

      {activeDates.length > 0 ? (
        <div className="relative z-10 ml-3 space-y-6 border-l border-itec-border/50 pb-2">
          {activeDates.map((item, index) => (
            <div key={item.id} className="group relative pl-5">
              {/* Dot en la línea de tiempo */}
              <span
                className={cn(
                  "absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-itec-box transition-all",
                  index === 0
                    ? "bg-itec-amber shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    : "bg-itec-muted/40 group-hover:bg-itec-amber/60"
                )}
              />

              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-amber">
                {item.date}
              </p>
              <h3 className="mb-1.5 text-sm font-bold leading-snug text-itec-text">
                {item.title}
              </h3>
              {item.description && (
                <p className="rounded-xl border border-itec-border/40 bg-itec-surface/50 p-2.5 text-xs leading-relaxed text-itec-muted">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="relative z-10 rounded-2xl border border-dashed border-itec-border bg-itec-surface/30 py-10 text-center">
          <p className="text-sm text-itec-muted">No hay fechas próximas vigentes.</p>
        </div>
      )}

      {isAdmin && isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />}>
          <AddDateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={(newDate) => setDates((prev) => [...prev, newDate])}
          />
        </Suspense>
      )}
    </section>
  );
};
