// src/features/courses/services/coursesService.ts
import { auth } from '@lib/firebase';

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

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/courses`;

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Debes iniciar sesion');
  return token;
};

export const coursesService = {

  // -------------------------------------------------------------------------
  // GET /api/courses
  // El backend puede devolver:
  //   a) array plano (legacy)    -> [ {...}, ... ]
  //   b) objeto paginado (nuevo) -> { courses: [...], pagination: {...} }
  // Ambos se normalizan a CourseData[] con id === _id garantizado.
  // -------------------------------------------------------------------------
  getCourses: async (): Promise<CourseData[]> => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error obteniendo cursos');
      const data = await res.json();

      const rawList: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as { courses?: unknown[] }).courses)
          ? (data as { courses: unknown[] }).courses
          : [];

      return rawList.map((c: unknown) => {
        const course = c as CourseData & { _id?: string };
        return { ...course, id: course._id ?? course.id };
      });
    } catch (error) {
      console.error('[coursesService] getCourses:', error);
      return [];
    }
  },

  getCourseById: async (id: string): Promise<CourseData | null> => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return { ...data, id: data._id };
  },

  addCourse: async (courseData: Omit<CourseData, 'id' | '_id'>): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al guardar el curso');
    return data._id;
  },

  deleteCourse: async (id: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar el curso');
  },

  fetchPlaylistDetails: async (
    playlistUrl: string,
  ): Promise<{ title: string; videos: Video[] }> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/fetch-playlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistUrl }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || 'Error al conectar con YouTube');
    }
    return res.json();
  },

  updateCourse: async (id: string, courseData: Partial<CourseData>): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });
    if (!res.ok) throw new Error('Error al actualizar el curso');
  },
};
