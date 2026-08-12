import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";
import { SectionLabel } from "@features/home/components/atoms/SectionLabel";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { cn } from "@/lib/utils"; // Asumiendo que tenés la utilidad de Tailwind de tu proyecto
import useSizeWindow from "@/hooks/useSizeWindow";

// ─── HELPER PARA FORMATEAR FECHAS ──────────────────────────────────────────
const parseDateInfo = (dateString: string) => {
  // Ajusta la zona horaria para evitar desfases si la fecha viene como ISO pura
  const date = new Date(dateString + 'T12:00:00Z');
  
  if (isNaN(date.getTime())) {
    return { dayOfWeek: "-", dayOfMonth: "-", month: "-", isToday: false };
  }

  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate().toString().padStart(2, "0");

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return { dayOfWeek, dayOfMonth, month, isToday };
};

export const CalendarSlider: React.FC = () => {
  const { events, loading } = useCalendarEvents();
  const {md} = useSizeWindow()
  if (loading) {
    return (
      <>
        <SectionLabel>Fechas importantes</SectionLabel>
        <div className="flex justify-start overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col shrink-0 w-36 sm:w-40 rounded-2xl border border-white/5 bg-itec-box animate-pulse overflow-hidden snap-start"
            >
              <div className="h-16 bg-white/5 border-b border-white/5 w-full flex flex-col items-center justify-center gap-1">
                <div className="h-2 w-8 bg-white/10 rounded-full" />
                <div className="h-6 w-10 bg-white/10 rounded-md" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="h-3 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-2/3 bg-white/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!events || events.length === 0) return null;

  return (
    <>
      <div className="flex items-end justify-between mb-2">
        <SectionLabel>Fechas importantes</SectionLabel>
        <Link to="/calendario" className="text-[10px] font-bold text-itec-sky hover:text-white transition-colors uppercase tracking-widest flex items-center gap-0.5">
          Ver todo <ChevronRight size={12} />
        </Link>
      </div>

      {/* Contenedor principal (Scroll horizontal magnético) */}
      <div className="flex justify-start overflow-x-auto pb-4 pt-1 gap-3 custom-scrollbar snap-x snap-mandatory">
        {events.map((ev, i) => {
          const { dayOfWeek, dayOfMonth, month, isToday } = parseDateInfo(ev.date);
          // Resaltamos si es la fecha actual o si es el primer evento (más urgente)
          const isActive = isToday || i === 0;
          return (
            <Link
              to="/calendario"
              key={ev.id || i}
              className={cn(
                "group flex flex-col shrink-0 w-30 sm:w-40 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden snap-start hover:-translate-y-1",
                isActive
                  ? "bg-itec-red/33 border border-itec-red/20"
                  : "bg-itec-card border border-white/5 hover:border-white/15"
              )}
            >
              {/* Sección superior: FECHA */}
              <div className={cn(
                "flex flex-col items-center justify-center py-3 border-b relative",
                isActive 
                  ? "bg-gradient-to-b from-itec-red/20 border-itec-red/30" 
                  : "bg-white/[0.02] border-white/5 group-hover:bg-white/[0.04] transition-colors"
              )}>
                {/* Ping Dot superior derecho */}
                {isActive && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-itec-sky opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-itec-sky"></span>
                  </span>
                )}

                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-[0.2em]",
                  isActive ? "text-itec-sky" : "text-itec-muted"
                )}>
                  {month} • {dayOfWeek}
                </span>
                
                <span className={cn(
                  "text-2xl font-black tabular-nums tracking-tight mt-0.5",
                  isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-itec-text/80 group-hover:text-white transition-colors"
                )}>
                  {dayOfMonth}
                </span>

                <span className={cn(
                  "text-[8px] tabular-nums tracking-tight mt-0.75 uppercase flex flex-col items-center",
                  isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-itec-text/80 group-hover:text-white transition-colors"
                )}>
                  <span>{ev.type}</span>
                  <span>{ev.subtitle}</span>
                </span>

              </div>
              {md ? (
              <div className="flex flex-col p-3.5 flex-1 bg-itec-box/30 relative">
                <div className="flex items-start gap-1.5 mb-1.5">
                  <Calendar size={16} className={cn("shrink-0 mt-0.5", isActive ? "text-itec-sky" : "text-white/20")} />
                  <span
                    className={cn(
                      "text-[12px] font-semibold leading-tight line-clamp-2",
                      isActive ? "text-white" : "text-itec-text/90"
                    )}
                    title={ev.title}
                  >
                    {ev.title}
                  </span>
                </div>
                {ev.description && (
                  <p
                    className={cn(
                      "text-[10px] leading-relaxed line-clamp-2 pl-4",
                      isActive ? "text-white/60" : "text-itec-muted"
                    )}
                    title={ev.description}
                  >
                    {ev.description}
                  </p>
                )}
              </div>
              ) : <></> }
              {/* Sección inferior: INFO DEL EVENTO */}
              
            </Link>
          );
        })}
      </div>
    </>
  );
};