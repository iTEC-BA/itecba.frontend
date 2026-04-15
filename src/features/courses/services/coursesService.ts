// src/features/courses/services/coursesService.ts
import { auth } from '../../../lib/firebase';

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
  createdAt?: any;
  // 🔴 NUEVO: Agregamos tipado para los filtros, asumiendo que tu backend de Mongo los soporta o los soportará
  materia?: string;
  categoria?: string; // ej: "Oficial", "Comunidad"
}

const API_URL = 'http://127.0.0.1:5001/api/courses'; 

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const coursesService = {
  getCourses: async (): Promise<CourseData[]> => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error obteniendo cursos');
      const data = await res.json();
      // Mapeamos para asegurar que id sea igual a _id para compatibilidad del frontend
      return Array.isArray(data) ? data.map((c: any) => ({ ...c, id: c._id })) : [];
    } catch (error) {
      console.error(error);
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
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al guardar el curso');
    return data._id;
  },

  deleteCourse: async (id: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar el curso');
  },

  fetchPlaylistDetails: async (playlistUrl: string): Promise<{ title: string, videos: Video[] }> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/fetch-playlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ playlistUrl })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al conectar con YouTube');
    }
    
    return await res.json();
  },

  // Agrega esto debajo de addCourse en tu coursesService.ts
  updateCourse: async (id: string, courseData: Partial<CourseData>): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error('Error al actualizar el curso');
  },
};

