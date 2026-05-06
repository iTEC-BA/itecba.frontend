import { auth } from '@lib/firebase';

export interface GroupData {
  id?: string;
  carrera: string;
  nivel: string;
  materia: string;
  comision: string;
  link: string;
  tipo: 'Oficial' | 'Alumnos';
  createdAt?: any;
  submittedBy?: string;
}

// En groupsService.ts
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/groups` 
  : 'http://127.0.0.1:5001/api/groups';
  
// Obtenemos el token de seguridad de Firebase Auth
const getToken = async (requireAuth = true) => {
  const token = await auth.currentUser?.getIdToken();
  if (!token && requireAuth) throw new Error("Debes iniciar sesión para esta acción");
  return token || null;
};

export const groupsService = {
  getApprovedGroups: async (): Promise<GroupData[]> => {
    // 🔴 CORRECCIÓN 1: Quitamos /approved, apuntamos directo a la raíz
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al traer grupos');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  getPendingGroups: async (): Promise<GroupData[]> => {
    const token = await getToken(true);
    const res = await fetch(`${API_URL}/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al traer grupos pendientes');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  checkIsDuplicatePending: async (materia: string, comision: string, link: string): Promise<boolean> => {
    // 🔴 CORRECCIÓN 3: Prevenimos que explote si un NO-Admin intenta ejecutar esto
    try {
      const pending = await groupsService.getPendingGroups();
      return pending.some(g => 
        (g.materia === materia && g.comision.toLowerCase() === comision.toLowerCase()) || g.link === link
      );
    } catch (error) {
      console.warn("No se pudo validar duplicados locales (Probablemente el usuario no es Admin)");
      return false; // Permitimos que el intento pase al backend
    }
  },

  submitNewGroup: async (groupData: Omit<GroupData, 'id'>, _isAdmin: boolean): Promise<string> => {
    const token = await getToken(false);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(groupData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al subir el grupo');
    return data._id;
  },

  approvePendingGroup: async (group: GroupData): Promise<string> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${group.id}/approve`, {
      method: 'PUT', // 🔴 CORRECCIÓN 2: Cambiado de PATCH a PUT
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al aprobar');
    return data._id;
  },

  rejectPendingGroup: async (groupId: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${groupId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al rechazar');
  }
};