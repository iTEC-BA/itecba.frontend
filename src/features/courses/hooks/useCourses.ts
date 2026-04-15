import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService, type CourseData } from '../services/coursesService';

// 1. LECTURAS (Con caché activado para ahorrar recursos)
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesService.getCourses(),
    // 🔴 LA MAGIA AQUÍ: Guardamos en caché por 15 minutos (1000ms * 60s * 15m)
    staleTime: 1000 * 60 * 15, 
  });
};

export const useCourseById = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesService.getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 15, // También cacheamos el curso individual
  });
};

// 2. ESCRITURAS (Mutaciones)
export const useAddCourse = () => {
  const queryClient = useQueryClient(); // Herramienta para manipular el caché

  return useMutation({
    mutationFn: (newCourse: Omit<CourseData, 'id' | '_id'>) => coursesService.addCourse(newCourse),
    onSuccess: () => {
      // Si se agregó con éxito, invalidamos el caché de 'courses'
      // Esto fuerza a React Query a traer la lista actualizada automáticamente
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesService.deleteCourse(id),
    onSuccess: () => {
      // Al borrar, también refrescamos la lista
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, courseData }: { id: string, courseData: Partial<CourseData> }) => 
      coursesService.updateCourse(id, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};