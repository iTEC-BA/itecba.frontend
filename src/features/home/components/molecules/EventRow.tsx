import React from 'react';
import { GlowDot } from '@features/home/components/atoms/GlowDot';
import { Link } from 'react-router-dom';

interface EventRowProps {
  title: string;
  description: string;
  date: string;
  isUrgent?: boolean;
}

export const EventRow: React.FC<EventRowProps> = ({ title, description, date, isUrgent }) => (
  <Link to="/calendario" className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
    <GlowDot color={isUrgent ? 'red' : 'blue'} className="mt-1.5" />
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-semibold text-itec-text truncate">{title}</p>
      <p className="text-[11px] text-itec-gray truncate mt-0.5">{description}</p>
    </div>
    <span className="text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-full bg-itec-card text-itec-gray">
      {date}
    </span>
  </Link>
);
