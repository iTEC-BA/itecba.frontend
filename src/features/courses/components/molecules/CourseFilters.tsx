// src/features/courses/components/molecules/CourseFilters.tsx
// Filtros de cursos: búsqueda, materia, categoría — 100% responsive, PWA-friendly
import React, { useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Icons } from "@/components/ui/icons/Icons";
import { CategoryPill } from "../atoms/CategoryPill";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Seleccionar...",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col transition-all duration-300 ${disabled ? "grayscale" : ""}`}
    >
      {label && (
        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 pl-1">
          {label}
        </label>
      )}
      <div onClick={() => !disabled && setIsOpen(!isOpen)}>
        <Input
          fullWidth
          readOnly
          disabled={disabled}
          placeholder={placeholder}
          value={selectedLabel}
          className="cursor-pointer text-sm p-3 bg-slate-950/50 border-itec-border hover:border-emerald-500/50 focus:border-emerald-500 transition-all rounded-xl disabled:cursor-not-allowed select-none"
        />
      </div>
      {isOpen && !disabled && (
        <ul className="absolute z-100 w-full top-full mt-2 bg-slate-800 border border-itec-border rounded-2xl max-h-60 overflow-y-scroll">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm text-slate-300 hover:bg-emerald-600 hover:text-itec-text border-b border-white/5 last:border-0 transition-colors"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface FiltersState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedMateria: string;
  setSelectedMateria: (m: string) => void;
  selectedCategoria: string;
  setSelectedCategoria: (c: string) => void;
  materiasDisponibles: string[];
  handleClearFilters: () => void;
}

interface Props {
  filters: FiltersState;
  isLoading: boolean;
}

const CATEGORIAS = ["Todos", "Oficial", "Comunidad"] as const;

export const CourseFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedMateria,
    setSelectedMateria,
    selectedCategoria,
    setSelectedCategoria,
    materiasDisponibles,
    handleClearFilters,
  } = filters;

  const searchId = useId();

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedMateria !== "" ||
    selectedCategoria !== "";

  return (
    <div className="mb-6 space-y-3">
      {/* Fila 1: Búsqueda + Materia */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Buscador */}
        <div className="relative flex-1">
          <label htmlFor={searchId} className="sr-only">
            Buscar curso
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Icons type="search" className="w-3.5 h-3.5 text-itec-gray" />
          </div>
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o descripción..."
            disabled={isLoading}
            className="w-full bg-itec-card border border-itec-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-itec-text placeholder-itec-gray/50 outline-none focus:border-itec-blue-skye/50 focus:bg-white/3 transition-all disabled:opacity-50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-itec-gray hover:text-itec-text transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <Icons type="close" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Select de materia */}
        {materiasDisponibles.length > 0 && (
          <div className="sm:w-52">
            <CustomSelect
              value={selectedMateria}
              onChange={setSelectedMateria}
              disabled={isLoading}
              placeholder="Todas las materias"
              options={[
                { value: "", label: "Todas las materias" },
                ...materiasDisponibles.map((m) => ({ value: m, label: m })),
              ]}
            />
          </div>
        )}
      </div>

      {/* Fila 2: Pills de categoría + clear */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIAS.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              isActive={
                cat === "Todos"
                  ? selectedCategoria === ""
                  : selectedCategoria === cat
              }
              onClick={() => setSelectedCategoria(cat === "Todos" ? "" : cat)}
            />
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="shrink-0 flex items-center gap-1.5 text-xs text-itec-gray hover:text-itec-text transition-colors font-medium"
          >
            <Icons type="close" className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
