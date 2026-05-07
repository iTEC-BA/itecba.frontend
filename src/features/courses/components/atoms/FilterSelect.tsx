import React from "react";

interface Props {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const FilterSelect: React.FC<Props> = ({ value, options, onChange, disabled }) => (
  <div className="relative">
    <select
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-white/[0.04] border border-white/8 text-itec-text rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-itec-blue-skye/60 focus:ring-2 focus:ring-itec-blue-skye/10 transition-all cursor-pointer disabled:opacity-40 hover:border-white/15"
    >
      <option value="">Todas las materias</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-itec-gray text-xs">▼</div>
  </div>
);
