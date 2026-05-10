// src/features/courses/components/molecules/CourseFilters.tsx
// Filtros de cursos: búsqueda, materia, categoría — 100% responsive, PWA-friendly
import React, { useId } from "react";
import { Icons } from "@/components/ui/icons/Icons";
import { CategoryPill } from "../atoms/CategoryPill";

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
  const selectId = useId();

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
          <div className="relative sm:w-52">
            <label htmlFor={selectId} className="sr-only">
              Filtrar por materia
            </label>
            <select
              id={selectId}
              value={selectedMateria}
              onChange={(e) => setSelectedMateria(e.target.value)}
              disabled={isLoading}
              className="w-full appearance-none bg-itec-card border border-itec-border rounded-xl px-4 py-2.5 text-sm text-itec-text outline-none focus:border-itec-blue-skye/50 transition-all disabled:opacity-50 cursor-pointer pr-8"
            >
              <option value="">Todas las materias</option>
              {materiasDisponibles.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <Icons
                type="chevronDown"
                className="w-3.5 h-3.5 text-itec-gray"
              />
            </div>
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
