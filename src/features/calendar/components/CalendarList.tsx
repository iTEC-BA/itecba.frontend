import React from 'react';
import { useCalendar } from '../hooks/useCalendar';

export const CalendarList = () => {
  const { events, loading } = useCalendar();

  if (loading) return <div className="text-itec-muted p-4">Cargando fechas...</div>;

  return (
    <div className="space-y-4">
      {/* Temporizador de fecha próxima */}
      {events[0] && (
        <div className="bg-itec-accent/10 border border-itec-accent/20 p-6 rounded-2xl text-center shadow-glass">
          <p className="text-xs text-itec-accent font-bold uppercase tracking-wider">Próximo Evento Crítico</p>
          <h2 className="text-2xl font-bold text-itec-text mt-1">{events[0].title}</h2>
          <p className="text-itec-muted text-sm mt-2">Faltan {Math.ceil((new Date(events[0].date).getTime() - Date.now()) / (1000*60*60*24))} días</p>
        </div>
      )}

      {/* Lista de Cards */}
      <div className="grid gap-3">
        {events.map(event => (
          <div key={event.id} className="p-4 bg-itec-box border border-itec-border rounded-xl hover:border-itec-accent/40 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-itec-surface px-2 py-0.5 rounded-full text-itec-muted uppercase">{event.type}</span>
                <h3 className="font-bold text-itec-text mt-1">{event.title}</h3>
              </div>
              <p className="text-sm font-mono text-itec-accent">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
