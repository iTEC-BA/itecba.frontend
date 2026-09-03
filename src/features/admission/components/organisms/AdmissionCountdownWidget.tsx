import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '@/components/ui/icons/Icons';
import type { AdmissionEvent } from '../../hooks/useAdmissionDates';

interface Props {
  events: AdmissionEvent[];
  isAdmin: boolean;
  onManageClick: () => void;
}

export const AdmissionCountdownWidget: React.FC<Props> = ({ events, isAdmin, onManageClick }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    <div className="bg-itec-section-admission/10 border border-itec-section-admission/75 rounded-xl p-5 mb-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-itec-text font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-itec-section-admission"></span>
            Próximo Evento
          </h3>
          <p className="text-itec-text text-sm font-medium">
            {nextEvent ? nextEvent.eventName : 'Sin eventos programados'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={onManageClick} className="w-7 h-7 rounded-md bg-itec-sidebar border border-itec-border flex items-center justify-center text-itec-gray hover:text-itec-section-admission transition-colors cursor-pointer">
            <Icons type="edit" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {nextEvent ? (
        <div className="flex gap-2 justify-between text-center">
          <div className="bg-itec-sidebar border border-itec-border rounded-lg flex-1 py-2">
            <span className="block text-lg font-bold text-itec-text mb-0.5">{timeLeft.days}</span>
            <span className="text-[9px] text-itec-gray uppercase tracking-wider">Días</span>
          </div>
          <div className="bg-itec-sidebar border border-itec-border rounded-lg flex-1 py-2">
            <span className="block text-lg font-bold text-itec-text mb-0.5">{timeLeft.hours}</span>
            <span className="text-[9px] text-itec-gray uppercase tracking-wider">Hrs</span>
          </div>
          <div className="bg-itec-sidebar border border-itec-section-admission rounded-lg flex-1 py-2">
            <span className="block text-lg font-bold text-itec-section-admission mb-0.5">{timeLeft.minutes}</span>
            <span className="text-[9px] text-itec-section-admission uppercase tracking-wider">Min</span>
          </div>
        </div>
      ) : (
        <div className="bg-itec-sidebar border border-itec-border rounded-lg py-3 text-center">
          <span className="text-xs text-itec-gray">Agrega una fecha desde el panel</span>
        </div>
      )}
    </div>
  );
};
