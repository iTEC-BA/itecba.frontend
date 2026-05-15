import { auth } from '@lib/firebase';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/materias`;

export interface MateriaRow {
  id: string;
  carrera: string;
  nivel: string;
  materia: string;
  codigo?: string;
}

const getToken = async (): Promise<string> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Debes iniciar sesión como Admin');
  return token;
};

export const materiasService = {
  getMaterias: async (carrera?: string, nivel?: string): Promise<MateriaRow[]> => {
    const params = new URLSearchParams();
    if (carrera) params.set('carrera', carrera);
    if (nivel)   params.set('nivel', nivel);
    const res = await fetch(`${API}?${params}`);
    if (!res.ok) throw new Error('Error al traer materias');
    return res.json();
  },

  // Búsqueda dual: por nombre O por código
  searchMaterias: async (q: string): Promise<MateriaRow[]> => {
    if (!q || q.trim().length < 2) return [];
    const res = await fetch(`${API}/search?q=${encodeURIComponent(q.trim())}`);
    if (!res.ok) return [];
    return res.json();
  },

  getCarreras: async (): Promise<string[]> => {
    const res = await fetch(`${API}/carreras`);
    if (!res.ok) throw new Error('Error al traer carreras');
    return res.json();
  },

  createMateria: async (data: Omit<MateriaRow, 'id'>): Promise<MateriaRow> => {
    const token = await getToken();
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear materia');
    return res.json();
  },

  updateMateria: async (id: string, data: Omit<MateriaRow, 'id'>): Promise<MateriaRow> => {
    const token = await getToken();
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar materia');
    return res.json();
  },

  deleteMateria: async (id: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar materia');
  },
};
