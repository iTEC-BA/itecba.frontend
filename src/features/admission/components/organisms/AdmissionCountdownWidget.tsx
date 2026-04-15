import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '@/components/atoms/Icons';
import type { AdmissionEvent } from '../../hooks/useAdmissionDates';

interface Props {
  events: AdmissionEvent[];
  isAdmin: boolean;
  onManageClick: () => void;
}

export const AdmissionCountdownWidget: React.FC<Props> = ({ events, isAdmin, onManageClick }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 🟢 LÓGICA BLINDADA: Nos aseguramos de que events exista antes de filtrar
  const nextEvent = useMemo(() => {
    if (!events || !Array.isArray(events)) return null;

    const now = new Date().getTime();
    const futureEvents = events.filter(e => new Date(e.targetDate).getTime() > now);
    
    return futureEvents.length > 0 ? futureEvents[0] : null;
  }, [events]);

  useEffect(() => {
    if (!nextEvent) return;

    const calculateTimeLeft = () => {
      const difference = new Date(nextEvent.targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [nextEvent]);

  return (
    <div className="bg-itec-surface border border-purple-500/20 rounded-3xl p-6 shadow-[0_0_20px_rgba(168,85,247,0.05)] relative overflow-hidden mb-6 animate-in fade-in duration-500 group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600/50 to-purple-400/50"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/10 transition-all duration-700"></div>

      <div className="relative z-10 flex items-start justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_5px_rgba(168,85,247,0.8)]"></span>
            Próximo Evento
          </h3>
          <p className="text-gray-400 text-xs font-medium">
            {nextEvent ? nextEvent.eventName : 'Sin eventos programados'}
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={onManageClick}
            className="w-7 h-7 rounded-lg bg-itec-bg border border-itec-gray flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/30 transition-all"
            title="Gestionar Fechas"
          >
            <Icons type="edit" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {nextEvent ? (
        <div className="flex gap-2 justify-between text-center relative z-10">
          <div className="bg-itec-bg/50 border border-itec-gray/50 rounded-xl flex-1 py-2.5">
            <span className="block text-xl font-bold text-white mb-0.5">{timeLeft.days}</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Días</span>
          </div>
          <div className="bg-itec-bg/50 border border-itec-gray/50 rounded-xl flex-1 py-2.5">
            <span className="block text-xl font-bold text-white mb-0.5">{timeLeft.hours}</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">Hrs</span>
          </div>
          <div className="bg-itec-bg/50 border border-itec-gray/50 rounded-xl flex-1 py-2.5">
            <span className="block text-xl font-bold text-purple-400 mb-0.5">{timeLeft.minutes}</span>
            <span className="text-[9px] text-purple-500/70 uppercase tracking-wider">Min</span>
          </div>
        </div>
      ) : (
        <div className="bg-itec-bg/50 border border-itec-gray/50 rounded-xl py-4 text-center">
          <span className="text-xs text-gray-500">Agrega una fecha desde el panel</span>
        </div>
      )}
    </div>
  );
};