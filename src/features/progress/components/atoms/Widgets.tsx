import React from 'react';
import type { ProgressMetrics } from '../../types/progress';

interface MetricCardProps {
  title:      string;
  value:      string | number;
  subtitle?:  string;
  icon?:      string;
  highlight?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title, value, subtitle, icon, highlight,
}) => (
  <div className="bg-itec-bg border border-itec-gray/50 rounded-xl p-5 flex flex-col justify-between transition-colors hover:border-itecBlue/50 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform select-none">
      {icon}
    </div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <span className="text-itec-text text-xs font-bold uppercase tracking-widest">{title}</span>
    </div>
    <div className="relative z-10">
      <span className={`text-4xl font-bold ${highlight ?? 'text-itec-text'}`}>{value}</span>
      {subtitle && <p className="text-xs text-gray-500 mt-2 font-medium">{subtitle}</p>}
    </div>
  </div>
);

export const PromocionadasCard: React.FC<{ count: number }> = ({ count }) => (
  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400/40 transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform select-none">✦</div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Promocionadas</span>
    </div>
    <div className="relative z-10">
      <span className="text-4xl font-bold text-emerald-300">{count}</span>
      <p className="text-xs text-gray-500 mt-2 font-medium">Sin final rendido</p>
    </div>
  </div>
);

interface StressMonitorProps {
  horas: number;
  nivel: ProgressMetrics['nivelEstres'];
}

export const StressMonitor: React.FC<StressMonitorProps> = ({ horas, nivel }) => {
  const colors: Record<ProgressMetrics['nivelEstres'], string> = {
    Bajo:      'text-green-400 border-green-500/20 bg-green-500/5',
    Manejable: 'text-itecBlue border-itecBlue/20 bg-itecBlue/5',
    Alto:      'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
    Crítico:   'text-itec-accent border-itec-accent/20 bg-itec-accent/5',
  };
  return (
    <div className={`rounded-xl p-5 flex flex-col justify-between transition-all border ${colors[nivel]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Estrés Semanal</span>
        <span>⚡</span>
      </div>
      <div>
        <div className="text-3xl font-bold">{horas} <span className="text-sm opacity-70 font-medium">hrs/sem</span></div>
        <div className="text-[10px] font-bold mt-2 tracking-widest uppercase bg-black/20 inline-block px-2 py-1 rounded">ESTADO: {nivel}</div>
      </div>
    </div>
  );
};
