// src/features/courses/components/molecules/CourseFilters.tsx
// Filtros de cursos: búsqueda normalizada + materia + pills de categoría.
import React from "react";
import { X } from "lucide-react";
import { CourseSearchInput } from "../atoms/CourseSearchInput";
import { MateriaSelect }     from "../atoms/MateriaSelect";
import { CategoryPill }      from "../atoms/CategoryPill";

export interface FiltersState {
  searchQuery:          string;
  setSearchQuery:       (q: string) => void;
  selectedMateria:      string;
  setSelectedMateria:   (m: string) => void;
  selectedCategoria:    string;
  setSelectedCategoria: (c: string) => void;
  materiasDisponibles:  string[];
  handleClearFilters:   () => void;
}

interface Props {
  filters:   Partial<FiltersState>;
  isLoading: boolean;
}

const CATEGORIAS = ["Todos", "Oficial", "Comunidad"] as const;

export const CourseFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const {
    searchQuery = "",
    setSearchQuery = () => {},
    selectedMateria = "",
    setSelectedMateria = () => {},
    selectedCategoria = "",
    setSelectedCategoria = () => {},
    materiasDisponibles = [],
    handleClearFilters = () => {},
  } = (filters || {}) as Partial<FiltersState>;

  const hasActive = searchQuery !== "" || selectedMateria !== "" || selectedCategoria !== "";

  return (
    <div className="mb-6 space-y-3">
      {/* Fila 1: búsqueda + materia */}
      <div className="flex flex-col sm:flex-row gap-2">
        <CourseSearchInput value={searchQuery} onChange={setSearchQuery} disabled={isLoading} />
        {materiasDisponibles.length > 0 && (
          <MateriaSelect
            value={selectedMateria}
            options={materiasDisponibles}
            onChange={setSelectedMateria}
            disabled={isLoading}
          />
        )}
      </div>

      {/* Fila 2: pills de categoría + limpiar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIAS.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              isActive={cat === "Todos" ? selectedCategoria === "" : selectedCategoria === cat}
              onClick={() => setSelectedCategoria(cat === "Todos" ? "" : cat)}
            />
          ))}
        </div>
        {hasActive && (
          <button
            onClick={handleClearFilters}
            className="shrink-0 flex items-center gap-1.5 text-xs text-itec-gray hover:text-itec-text transition-colors font-medium"
          >
            <X className="size-3" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
