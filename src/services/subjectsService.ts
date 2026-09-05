import { auth } from '@/lib/firebase';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/subjects`;

export interface SubjectRow {
  id: number;
  subject_key: string;
  carrera: string;
  nivel: number;
  materia: string;
  codigo: string | null;
  sigla: string | null;
}

export interface CorrelativasResponse {
  cursada: string[];
  aprobada: string[];
}

const getToken = async (): Promise<string> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Debes iniciar sesión como Admin');
  return token;
};

export const subjectsService = {
  getSubjects: async (carrera?: string, nivel?: number | string): Promise<SubjectRow[]> => {
    const params = new URLSearchParams();
    
    // Evitamos enviar la palabra "undefined" literal en la URL
    if (carrera && carrera !== 'undefined') params.set('carrera', carrera);
    if (nivel !== undefined && nivel !== '' && String(nivel) !== 'undefined') params.set('nivel', String(nivel));
    
    const res = await fetch(`${API}?${params}`);
    if (!res.ok) throw new Error('Error al traer materias');
    return res.json();
  },

  searchSubjects: async (q: string): Promise<SubjectRow[]> => {
    if (!q || q.trim().length < 2 || q === 'undefined') return [];
    const res = await fetch(`${API}/search?q=${encodeURIComponent(q.trim())}`);
    if (!res.ok) return [];
    return res.json();
  },

  getCarreras: async (): Promise<string[]> => {
    const res = await fetch(`${API}/carreras`);
    if (!res.ok) throw new Error('Error al traer carreras');
    return res.json();
  },

  getCorrelativas: async (subjectKey: string): Promise<CorrelativasResponse> => {
    const res = await fetch(`${API}/${encodeURIComponent(subjectKey)}/correlativas`);
    if (!res.ok) throw new Error('Error al traer correlativas');
    return res.json();
  },

  createSubject: async (data: Omit<SubjectRow, 'id' | 'subject_key'> & { subjectKey?: string }): Promise<SubjectRow> => {
    const token = await getToken();
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear materia');
    return res.json();
  },

  updateSubject: async (id: number, data: Omit<SubjectRow, 'id' | 'subject_key'>): Promise<SubjectRow> => {
    const token = await getToken();
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar materia');
    return res.json();
  },

  deleteSubject: async (id: number): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar materia');
  },
};
