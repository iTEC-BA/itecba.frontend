import React from "react";
import { SearchInput } from "../atoms/SearchInput";
import { FilterSelect } from "../atoms/FilterSelect";

interface Props {
  filters: any;
  isLoading: boolean;
}

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

  const hasActiveFilters = searchQuery || selectedMateria || selectedCategoria;
  const categories = ["Todos", "Oficial", "Comunidad"];

  return (
    <div className="mb-10 flex flex-col gap-6">
      {/* Fila superior: Buscador y Selectores */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        <div className="flex-1 w-full relative">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            disabled={isLoading}
            placeholder="Buscar cursos..."
          />
        </div>

        <div className="w-full md:w-64 shrink-0">
          <FilterSelect
            value={selectedMateria}
            options={materiasDisponibles}
            onChange={setSelectedMateria}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Fila inferior: Categorías (Estilo de la imagen de referencia) */}
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar">
          {categories.map((cat) => {
            const isActive =
              selectedCategoria === cat ||
              (cat === "Todos" && !selectedCategoria);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoria(cat === "Todos" ? "" : cat)}
                className={`
              cursor-pointer px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap active:scale-95
              ${
                isActive
                  ? "bg-slate-100 text-slate-900 shadow-md"
                  : "bg-transparent text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-200"
              }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button 
            onClick={handleClearFilters}
            className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all whitespace-nowrap active:scale-95 shrink-0"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};
