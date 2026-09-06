import React from "react";
import { X } from "lucide-react";
import { CourseSearchInput } from "../atoms/CourseSearchInput";
import { CategoryPill }      from "../atoms/CategoryPill";
import { CustomSelect } from "@/components/ui/CustomSelect";

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
    <div className="mb-6 flex flex-col gap-4">
      {/* ── Fila de Buscador y Selectores (Estilo Midudev adaptado a Flat) ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1">
          <CourseSearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            disabled={isLoading} 
            placeholder="Buscar cursos por título, tecnología o descripción..."
          />
        </div>
        
        {materiasDisponibles.length > 0 && (
          <div className="w-full sm:w-56 shrink-0 relative z-10">
            <CustomSelect 
              value={selectedMateria}
              options={materiasDisponibles.map((materia) => ({ label: materia, value: materia }))}
              onChange={setSelectedMateria}
              disabled={isLoading}
              placeholder="Todas las materias"
              className="py-3"
            />
          </div>
        )}
      </div>

      {/* ── Fila de Pills y Limpiar Filtros ── */}
      <div className="flex items-center justify-between gap-3 relative z-0">
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
            className="shrink-0 flex items-center gap-1.5 text-xs text-itec-gray hover:text-white bg-itec-box border border-itec-border px-3 py-1.5 rounded-lg transition-colors font-bold"
          >
            <X className="size-3.5" /> Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
