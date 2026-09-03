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
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-itec-gray group-focus-within:text-itec-section-courses transition-colors">
      <Search className="size-4" />
    </div>
    <input
      type="text"
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-itec-sidebar border border-itec-border text-itec-text rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-itec-section-courses transition-colors placeholder:text-itec-gray/60 disabled:opacity-40 hover:border-itec-section-courses/60"
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
