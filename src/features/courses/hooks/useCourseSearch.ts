import { useState, useMemo } from 'react';
import type { CourseData } from '../services/coursesService';
import type { CourseWithLocalProgress } from '../components/organisms/CourseGrid';

export const useCourseSearch = (dbCourses: CourseData[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");

  // 1. Cálculo de progreso local (Defensive Programming)
  const calculateLocalProgress = (courseId: string, totalVideos: number): number => {
    if (!totalVideos || totalVideos === 0) return 0;
    try {
      const savedData = localStorage.getItem(`itec_course_${courseId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const watchedCount = parsed?.watched?.length || 0;
        return Math.min(100, Math.round((watchedCount / totalVideos) * 100));
      }
    } catch {
      console.error("Error leyendo progreso local");
    }
    return 0;
  };

  // 2. Mapeo de cursos con su progreso
  const coursesWithProgress: CourseWithLocalProgress[] = useMemo(() => {
    return (dbCourses || []).map((course: any) => {
      const courseId = course.id || course._id;
      return {
        ...course,
        localProgress: calculateLocalProgress(courseId, course.videos?.length || 0),
      };
    });
  }, [dbCourses]);

  // 3. Extracción de materias únicas disponibles
  const materiasDisponibles = useMemo(() => {
    const materias = coursesWithProgress.map(c => c.materia).filter(Boolean) as string[];
    return Array.from(new Set(materias)).sort();
  }, [coursesWithProgress]);

  // 4. Lógica de Filtrado Complejo
  const filteredCourses = useMemo(() => {
    const searchLower = (searchQuery || "").toLowerCase().trim();
    
    return coursesWithProgress.filter((curso) => {
      const cursoId = curso.id || (curso as any)._id || "";
      
      const matchesSearch = 
        (curso.title || "").toLowerCase().includes(searchLower) ||
        (curso.description || "").toLowerCase().includes(searchLower);

      const matchesMateria = selectedMateria === "" || curso.materia === selectedMateria;

      // Determinamos si es oficial (Hardcoded business rules)
      const isOficial = curso.categoria === 'Oficial' || cursoId.startsWith('seminario') || cursoId.startsWith('analisis');
      
      let matchesCategoria = true;
      if (selectedCategoria === 'Oficial') matchesCategoria = isOficial;
      if (selectedCategoria === 'Comunidad') matchesCategoria = !isOficial;

      return matchesSearch && matchesMateria && matchesCategoria;
    });
  }, [coursesWithProgress, searchQuery, selectedMateria, selectedCategoria]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedMateria("");
    setSelectedCategoria("");
  };

  return {
    filters: {
      searchQuery, setSearchQuery,
      selectedMateria, setSelectedMateria,
      selectedCategoria, setSelectedCategoria,
      materiasDisponibles,
      handleClearFilters
    },
    filteredCourses
  };
};