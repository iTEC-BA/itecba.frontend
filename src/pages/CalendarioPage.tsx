import React, { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { Icons } from "@/components/ui/icons/Icons";
import { usePageTitle } from "@hooks/usePageTitle";

type EventType = "examen" | "institucional" | "feriado" | "beca" | "actividad";

interface CalEvent {
  date: string; // YYYY-MM-DD
  title: string;
  subtitle?: string;
  type: EventType;
}

const EVENTS: CalEvent[] = [
  { date: "2025-05-01", title: "Día del Trabajador", type: "feriado" },
  { date: "2025-05-25", title: "Revolución de Mayo", type: "feriado" },
  {
    date: "2025-06-03",
    title: "Elecciones estudiantiles",
    subtitle: "Campus y Medrano · No hay clases",
    type: "institucional",
  },
  {
    date: "2025-06-16",
    title: "1.° Turno de finales",
    subtitle: "AM2, Física I, Álgebra · Todas las carreras",
    type: "examen",
  },
  {
    date: "2025-06-17",
    title: "1.° Turno de finales",
    subtitle: "PDEP, AM1 · Todas las carreras",
    type: "examen",
  },
  {
    date: "2025-06-30",
    title: "Cierre inscripción Becas Progresar",
    subtitle: "Plataforma Mi Argentina",
    type: "beca",
  },
  {
    date: "2025-07-07",
    title: "2.° Turno de finales",
    subtitle: "AM2, Física I, Álgebra",
    type: "examen",
  },
  {
    date: "2025-07-14",
    title: "Inicio receso invernal",
    type: "institucional",
  },
  { date: "2025-08-04", title: "Reinicio de clases", type: "institucional" },
  {
    date: "2025-09-15",
    title: "Visita técnica ITEC a Tenaris",
    subtitle: "Industrial, Mecánica, Eléctrica",
    type: "actividad",
  },
];

const TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; dot: string }
> = {
  examen: {
    label: "Examen",
    color: "bg-itec-red/12 text-[#e01540] border-itec-red/20",
    dot: "bg-[#e01540]",
  },
  institucional: {
    label: "Institucional",
    color: "bg-[#004aad]/12 text-[#5b9cf6] border-[#004aad]/20",
    dot: "bg-[#5b9cf6]",
  },
  feriado: {
    label: "Feriado",
    color: "bg-white/8 text-[#9aa3b0] border-itec-border",
    dot: "bg-[#9aa3b0]",
  },
  beca: {
    label: "Beca",
    color: "bg-[#f0b100]/12 text-[#f0b100] border-[#f0b100]/20",
    dot: "bg-[#f0b100]",
  },
  actividad: {
    label: "Actividad",
    color: "bg-[#008854]/12 text-[#2fcc8a] border-[#008854]/20",
    dot: "bg-[#2fcc8a]",
  },
};

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const FILTER_TYPES: (EventType | "Todos")[] = [
  "Todos",
  "examen",
  "institucional",
  "feriado",
  "beca",
  "actividad",
];

export const CalendarioPage: React.FC = () => {
  usePageTitle("Calendario Académico");
  const [filter, setFilter] = useState<EventType | "Todos">("Todos");

  const filtered = EVENTS.filter(
    (e) => filter === "Todos" || e.type === filter,
  );

  const grouped = filtered.reduce<Record<string, CalEvent[]>>((acc, e) => {
    const key = e.date.slice(0, 7); // YYYY-MM
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <MainLayout>
      <PageHeader
        title="Calendario Académico"
        description="Fechas de parciales, finales, feriados, becas y actividades institucionales de la FRBA."
        iconType="calendar"
        colorTheme="blue"
      />

      {/* Filtros */}
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
            {t === "Todos" ? "Todos" : TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      {/* Eventos agrupados por mes */}
      {Object.keys(grouped)
        .sort()
        .map((monthKey) => {
          const [year, month] = monthKey.split("-");
          return (
            <div key={monthKey} className="mb-7">
              <h2 className="text-xs font-semibold text-[#5a6475] uppercase tracking-widest mb-3">
                {MONTHS[parseInt(month) - 1]} {year}
              </h2>
              <div className="flex flex-col gap-2">
                {grouped[monthKey].map((ev, i) => {
                  const d = new Date(ev.date + "T00:00:00");
                  const day = d.getDate();
                  const cfg = TYPE_CONFIG[ev.type];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-itec-card border border-white/7 rounded-xl p-3 hover:border-white/12 transition-colors"
                    >
                      <div
                        className={`shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center border ${cfg.color}`}
                      >
                        <span className="text-lg font-bold leading-none">
                          {day}
                        </span>
                        <span className="text-[8px] uppercase mt-0.5">
                          {MONTHS[parseInt(month) - 1].slice(0, 3)}
                        </span>
                      </div>
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
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-[#004aad]/15 flex items-center justify-center">
            <div className="w-5 h-5 text-[#5b9cf6]">
              <Icons type="calendar" className="w-full h-full" />
            </div>
          </div>
          <p className="text-[#5a6475] text-sm">
            No hay eventos en esta categoría.
          </p>
        </div>
      )}
    </MainLayout>
  );
};
