import React from 'react';

interface Props {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const FilterSelect: React.FC<Props> = ({ value, options, onChange, disabled }) => (
  <div className="md:w-72 relative group">
    <select
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-950/50 border border-white/5 text-slate-200 rounded-2xl pl-5 pr-12 py-4 text-sm appearance-none focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900/60 shadow-inner"
    >
      <option value="">🎯 Todas las materias</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-sky-400 transition-colors">
      ▼
    </div>
  </div>
);