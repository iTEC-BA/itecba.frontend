import React from "react";
import { SearchInput } from "../atoms/SearchInput";
import { FilterSelect } from "../atoms/FilterSelect";
import { CategoryPill } from "../atoms/CategoryPill";

interface FiltersState {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedMateria: string;
  setSelectedMateria: (v: string) => void;
  selectedCategoria: string;
  setSelectedCategoria: (v: string) => void;
  materiasDisponibles: string[];
  handleClearFilters: () => void;
}

interface Props { filters: FiltersState; isLoading: boolean; }

const CATS = ["Todos", "Oficial", "Comunidad"];

export const CourseFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const {
    searchQuery, setSearchQuery,
    selectedMateria, setSelectedMateria,
    selectedCategoria, setSelectedCategoria,
    materiasDisponibles, handleClearFilters,
  } = filters;

  const hasActive = searchQuery || selectedMateria || selectedCategoria;

  return (
    <div className="flex flex-col gap-3 mb-8">
      {/* Fila 1: búsqueda + select materia */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={searchQuery} onChange={setSearchQuery} disabled={isLoading} />
        <div className="sm:w-56 shrink-0">
          <FilterSelect
            value={selectedMateria}
            options={materiasDisponibles}
            onChange={setSelectedMateria}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Fila 2: pills categoría + limpiar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {CATS.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              isActive={selectedCategoria === cat || (cat === "Todos" && !selectedCategoria)}
              onClick={() => setSelectedCategoria(cat === "Todos" ? "" : cat)}
            />
          ))}
        </div>
        {hasActive && (
          <button
            onClick={handleClearFilters}
            className="shrink-0 text-xs text-itec-gray hover:text-itec-red transition-colors font-semibold whitespace-nowrap"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
