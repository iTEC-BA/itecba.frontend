// src/features/courses/components/atoms/CourseSearchInput.tsx
// Input de búsqueda que muestra el texto tal como el usuario escribe
// pero envía el valor original al hook (la normalización ocurre en el filtro).
import React from "react";
import { Search, X } from "lucide-react";

interface Props {
  value:       string;
  onChange:    (val: string) => void;
  disabled?:   boolean;
  placeholder?: string;
}

export const CourseSearchInput: React.FC<Props> = ({
  value, onChange, disabled, placeholder = "Buscar cursos...",
}) => (
  <div className="relative group flex-1">
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-itec-gray group-focus-within:text-itec-blue-skye transition-colors">
      <Search className="size-4" />
    </div>
    <input
      type="text"
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/[0.04] border border-white/8 text-itec-text rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-itec-blue-skye/60 focus:ring-2 focus:ring-itec-blue-skye/10 transition-all placeholder:text-itec-gray/60 disabled:opacity-40 hover:border-white/15"
    />
    {value && !disabled && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute inset-y-0 right-3 flex items-center text-itec-gray hover:text-itec-text transition-colors"
        aria-label="Limpiar búsqueda"
      >
        <X className="size-3.5" />
      </button>
    )}
  </div>
);
