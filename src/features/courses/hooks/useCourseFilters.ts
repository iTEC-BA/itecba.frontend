// src/features/courses/hooks/useCourseFilters.ts
//
// Reemplaza la lógica de filtrado de useCourseSearch.ts pero usando el store
// Zustand en lugar de useState local. De esta forma los filtros sobreviven
// navegaciones dentro de la feature (ej: ir al detalle y volver).

import { useMemo } from "react";
import { useCourseStore, selectFilters } from "../store/useCourseStore";
import type { CourseData } from "../services/coursesService";
import type { CourseWithLocalProgress } from "../components/organisms/CourseGrid";

const calculateLocalProgress = (courseId: string, totalVideos: number): number => {
  if (!totalVideos) return 0;
  try {
    const saved = localStorage.getItem(`itec_course_${courseId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Math.min(100, Math.round(((parsed?.watched?.length || 0) / totalVideos) * 100));
    }
  } catch {
    console.error("[useCourseFilters] Error leyendo progreso local");
  }
  return 0;
};

export const useCourseFilters = (dbCourses: CourseData[]) => {
  const { searchQuery, selectedMateria, selectedCategoria, setSearchQuery, setSelectedMateria, setSelectedCategoria, clearFilters } = useCourseStore(selectFilters);

  const coursesWithProgress: CourseWithLocalProgress[] = useMemo(() => {
    return (dbCourses || []).map((course: any) => {
      const courseId = course.id || course._id;
      return { ...course, localProgress: calculateLocalProgress(courseId, course.videos?.length || 0) };
    });
  }, [dbCourses]);

  const materiasDisponibles = useMemo(() => {
    const materias = coursesWithProgress.map((c) => c.materia).filter(Boolean) as string[];
    return Array.from(new Set(materias)).sort();
  }, [coursesWithProgress]);

  const filteredCourses = useMemo(() => {
    const searchLower = (searchQuery || "").toLowerCase().trim();
    return coursesWithProgress.filter((curso) => {
      const cursoId = curso.id || (curso as any)._id || "";
      const matchesSearch =
        (curso.title || "").toLowerCase().includes(searchLower) ||
        (curso.description || "").toLowerCase().includes(searchLower);
      const matchesMateria = selectedMateria === "" || curso.materia === selectedMateria;
      const isOficial =
        curso.categoria === "Oficial" ||
        cursoId.startsWith("seminario") ||
        cursoId.startsWith("analisis");
      let matchesCategoria = true;
      if (selectedCategoria === "Oficial") matchesCategoria = isOficial;
      if (selectedCategoria === "Comunidad") matchesCategoria = !isOficial;
      return matchesSearch && matchesMateria && matchesCategoria;
    });
  }, [coursesWithProgress, searchQuery, selectedMateria, selectedCategoria]);

  return {
    filters: {
      searchQuery, setSearchQuery,
      selectedMateria, setSelectedMateria,
      selectedCategoria, setSelectedCategoria,
      materiasDisponibles,
      handleClearFilters: clearFilters,
    },
    filteredCourses,
  };
};
