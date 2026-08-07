// src/features/courses/hooks/useCourseFilters.ts
// Filtra cursos con búsqueda normalizada (sin tildes ni caracteres especiales).
import { useState, useMemo, useCallback } from "react";
import { normalizeSearch } from "@/lib/normalize";
import type { CourseData } from "../services/coursesService";

export interface CourseFiltersState {
  searchQuery:          string;
  setSearchQuery:       (q: string) => void;
  selectedMateria:      string;
  setSelectedMateria:   (m: string) => void;
  selectedCategoria:    string;
  setSelectedCategoria: (c: string) => void;
  materiasDisponibles:  string[];
  handleClearFilters:   () => void;
}

const matchesSearch = (course: CourseData, normalized: string): boolean => {
  if (!normalized) return true;
  const searchable = normalizeSearch(`${course.title ?? ""} ${course.description ?? ""} ${course.materia ?? ""}`);
  return searchable.includes(normalized);
};

const matchesMateria = (course: CourseData, materia: string): boolean =>
  !materia || normalizeSearch(course.materia ?? "") === normalizeSearch(materia);

const matchesCategoria = (course: CourseData, categoria: string): boolean =>
  !categoria || course.categoria === categoria;

export const useCourseFilters = (courses: CourseData[]) => {
  const [searchQuery,       setSearchQuery]       = useState("");
  const [selectedMateria,   setSelectedMateria]   = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedMateria("");
    setSelectedCategoria("");
  }, []);

  const materiasDisponibles = useMemo(() => {
    const set = new Set(courses.map((c) => c.materia ?? "").filter(Boolean));
    return Array.from(set).sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalized = normalizeSearch(searchQuery);
    return courses.filter((c) =>
      matchesSearch(c, normalized) &&
      matchesMateria(c, selectedMateria) &&
      matchesCategoria(c, selectedCategoria)
    );
  }, [courses, searchQuery, selectedMateria, selectedCategoria]);

  const filters: CourseFiltersState = {
    searchQuery, setSearchQuery,
    selectedMateria, setSelectedMateria,
    selectedCategoria, setSelectedCategoria,
    materiasDisponibles,
    handleClearFilters,
  };

  return { filters, filteredCourses };
};
