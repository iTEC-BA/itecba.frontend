// src/features/courses/components/atoms/MateriaSelect.tsx
// Selector nativo de materia para los filtros de cursos.
import React from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  value:     string;
  options:   string[];
  onChange:  (val: string) => void;
  disabled?: boolean;
}

export const MateriaSelect: React.FC<Props> = ({ value, options, onChange, disabled }) => (
  <div className="relative sm:w-52">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full appearance-none bg-itec-card border border-itec-border text-itec-text rounded-xl pl-4 pr-9 py-2.5 text-sm focus:outline-none focus:border-itec-blue-skye/60 focus:ring-2 focus:ring-itec-blue-skye/10 transition-all cursor-pointer disabled:opacity-40 hover:border-white/15"
    >
      <option value="">Todas las materias</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-itec-gray">
      <ChevronDown className="size-3.5" />
    </div>
  </div>
);
