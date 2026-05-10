import React, { useState, useEffect } from "react";
import { CalendarEvent, EventType } from "../hooks/useCalendarEvents";

interface TypeConfig { label: string; color: string; dot: string; }
interface Props { event: CalendarEvent; typeConfig: Record<EventType, TypeConfig>; }

const pad = (n: number) => String(n).padStart(2, "0");
const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

export const CalendarCountdown: React.FC<Props> = ({ event, typeConfig }) => {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(event.date + "T00:00:00").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [event.date]);

  const cfg = typeConfig[event.type];
  const d   = new Date(event.date + "T00:00:00");

  return (
    <div className={`mb-8 rounded-2xl border p-4 ${cfg.color}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest opacity-60 mb-0.5">Próxima fecha crítica</p>
          <p className="text-sm font-bold text-itec-text truncate">{event.title}</p>
          {event.subtitle && <p className="text-xs opacity-60 mt-0.5 truncate">{event.subtitle}</p>}
          <p className="text-xs opacity-50 mt-0.5">{d.getDate()} {MONTHS_SHORT[d.getMonth()]} {d.getFullYear()}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[{ label: "Días", val: time.d }, { label: "Horas", val: time.h }, { label: "Min", val: time.m }, { label: "Seg", val: time.s }]
          .map(({ label, val }) => (
          <div key={label} className="flex flex-col items-center bg-black/20 rounded-xl py-2.5">
            <span className="text-2xl font-bold text-itec-text tabular-nums leading-none">{pad(val)}</span>
            <span className="text-[10px] opacity-50 mt-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
