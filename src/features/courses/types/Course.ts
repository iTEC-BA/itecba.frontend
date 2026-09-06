// src/features/courses/types/Course.ts
// Tipos centralizados de la feature courses.
// Los componentes deben importar desde aquí en lugar de desde coursesService.ts
//
// NOTA (migración legacy -> sections):
// El backend migró de `videos: Video[]` (plano) a una jerarquía
// `sections: Section[]` -> `lessons: Lesson[]` (ver course.model.js).
// `videos` se mantiene como opcional para los cursos viejos que todavía no
// pasaron por la migración (ver migrateLegacyCourses en el backend) y para
// el fallback que ya usan CourseDetail.tsx y AddCourseModal.tsx.

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
}

export interface BrokenReport {
  reportedBy: string;
  reason: string;
  createdAt?: Date | string;
}

export interface Lesson {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  type?: "video" | "exam" | "article";
  isPremium?: boolean;
  youtubeId: string;
  mediaUrl?: string;
  duration: string;
  orderIndex?: number;
  brokenReports?: BrokenReport[];
  isBroken?: boolean;
}

export interface Section {
  _id?: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface CourseData {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  playlistId: string;
  /** @deprecated usar `sections`. Se mantiene para cursos legacy no migrados. */
  videos?: Video[];
  sections?: Section[];
  /** Uno o más profesores/docentes a cargo del curso. */
  profesores?: string[];
  status?: "draft" | "approved" | "archived";
  createdBy?: string;
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
