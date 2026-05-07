// src/features/courses/types/Filters.ts
export type CategoriaFilter = "Oficial" | "Comunidad" | "";

export interface CourseFiltersState {
  searchQuery: string;
  selectedMateria: string;
  selectedCategoria: CategoriaFilter;
  materiasDisponibles: string[];
}
