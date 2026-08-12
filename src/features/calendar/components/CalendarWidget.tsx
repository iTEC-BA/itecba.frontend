import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useCalendarEvents } from "../hooks/useCalendarEvents";

export const CalendarWidget: React.FC = () => {
  // Consumimos los eventos directamente desde tu custom hook
  const { events, loading } = useCalendarEvents();
  
  // Extraemos solo los 3 más próximos para no saturar el panel
  const upcomingEvents = events.slice(0, 3);

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between pl-1">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-itec-muted flex items-center gap-1.5">
          <Calendar size={12} /> Próximas Fechas
        </h3>
        <Link to="/calendario" className="text-[9px] font-bold text-itec-sky hover:text-white transition-colors uppercase tracking-widest">
          Ver todo
        </Link>
      </div>

      <div className="flex flex-col rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded bg-white/5 shrink-0" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-2/3 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[10px] text-itec-muted">No hay eventos próximos.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {upcomingEvents.map((ev) => {
              // Parseamos la fecha para extraer día y mes
              const dateObj = new Date(ev.date + 'T12:00:00Z');
              const day = dateObj.getDate().toString().padStart(2, "0");
              const month = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][dateObj.getMonth()];

              return (
                <div key={ev.id} className="flex items-start gap-3 p-3 transition-colors hover:bg-white/[0.02]">
                  {/* Fecha */}
                  <div className="flex flex-col items-center justify-center bg-itec-box border border-white/10 rounded-md w-9 py-1 shrink-0">
                    <span className="text-[8px] font-bold uppercase text-itec-muted">{month}</span>
                    <span className="text-xs font-black text-white">{day}</span>
                  </div>
                  {/* Info */}
                  <div className="flex flex-col min-w-0 pt-0.5">
                    <span className="text-[11px] font-bold text-itec-text truncate" title={ev.title}>
                      {ev.title}
                    </span>
                    <span className="text-[9px] text-itec-muted uppercase tracking-widest truncate mt-0.5">
                      {ev.subtitle || "Evento"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};