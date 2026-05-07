// src/features/courses/types/Course.ts
// Tipos centralizados de la feature courses.
// Los componentes deben importar desde aquí en lugar de desde coursesService.ts

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
}

export interface CourseData {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  playlistId: string;
  videos: Video[];
  createdAt?: Date | string;
  materia?: string;
  categoria?: string;
}

export interface CourseFilters {
  searchQuery: string;
  selectedMateria: string;
  selectedCategoria: string;
}

export interface CourseWithLocalProgress extends CourseData {
  localProgress: number;
}
