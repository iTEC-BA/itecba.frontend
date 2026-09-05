// src/features/groups/services/subjectsService.ts
//
// Reemplaza a materiasService.ts. Apunta al nuevo endpoint /api/subjects
// (tabla Supabase `subjects`, poblada desde src/data/subject.ts).
//
// Cambios de contrato respecto a MateriaRow / materiasService:
//  - `nivel` es number (antes era string). Los callers que arman querystrings
//    o comparan contra un <select> deben castear con String(nivel) / Number(nivel).
//  - se agrega `subject_key` (el id estable usado en subject.ts) y `sigla`.
//  - se agrega getCorrelativas(subjectKey) para consultar reqCursada/reqAprobada.

import { auth } from '@lib/firebase';

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
    if (carrera) params.set('carrera', carrera);
    if (nivel !== undefined && nivel !== '') params.set('nivel', String(nivel));
    const res = await fetch(`${API}?${params}`);
    if (!res.ok) throw new Error('Error al traer materias');
    return res.json();
  },

  // Búsqueda: por nombre, código o sigla
  searchSubjects: async (q: string): Promise<SubjectRow[]> => {
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

  getCorrelativas: async (subjectKey: string): Promise<CorrelativasResponse> => {
    const res = await fetch(`${API}/${encodeURIComponent(subjectKey)}/correlativas`);
    if (!res.ok) throw new Error('Error al traer correlativas');
    return res.json();
  },

  createSubject: async (
    data: Omit<SubjectRow, 'id' | 'subject_key'> & { subjectKey?: string }
  ): Promise<SubjectRow> => {
    const token = await getToken();
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear materia');
    return res.json();
  },

  updateSubject: async (
    id: number,
    data: Omit<SubjectRow, 'id' | 'subject_key'>
  ): Promise<SubjectRow> => {
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

// Alias de retrocompatibilidad temporal, por si algún import viejo quedó
// suelto durante la migración. Eliminar una vez confirmado que no se usa.
/** @deprecated usar subjectsService */
export const materiasService = subjectsService;
