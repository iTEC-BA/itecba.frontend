import { auth } from '@lib/firebase';

export interface GroupData {
  id?: string;
  carrera: string;
  nivel: string;
  materia: string;
  comision: string;
  link: string;
  tipo: 'Oficial' | 'Alumnos';
  submittedBy?: string;
  reportCount?: number;
  reports?: { reportedBy: string; reason: string; reportedAt: string }[];
  createdAt?: string;
}

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/groups`;

const getToken = async (required = true): Promise<string | null> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token && required) throw new Error('Debes iniciar sesión');
  return token ?? null;
};

export const groupsService = {
  getApprovedGroups: async (): Promise<GroupData[]> => {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Error al traer grupos');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  getPendingGroups: async (): Promise<GroupData[]> => {
    const token = await getToken();
    const res = await fetch(`${API}/pending`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al traer grupos pendientes');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  getReportedGroups: async (): Promise<GroupData[]> => {
    const token = await getToken();
    const res = await fetch(`${API}/reported`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al traer grupos reportados');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  checkIsDuplicatePending: async (materia: string, comision: string, link: string): Promise<boolean> => {
    try {
      const pending = await groupsService.getPendingGroups();
      return pending.some(g => (g.materia === materia && g.comision.toLowerCase() === comision.toLowerCase()) || g.link === link);
    } catch { return false; }
  },

  submitNewGroup: async (groupData: Omit<GroupData, 'id'>, _isAdmin: boolean): Promise<string> => {
    const token = await getToken(false);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(API, { method: 'POST', headers, body: JSON.stringify(groupData) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al subir el grupo');
    return data._id;
  },

  approvePendingGroup: async (group: GroupData): Promise<string> => {
    const token = await getToken();
    const res = await fetch(`${API}/${group.id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al aprobar');
    return data._id;
  },

  rejectPendingGroup: async (groupId: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API}/${groupId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al rechazar');
  },

  updateGroupLink: async (groupId: string, link: string): Promise<GroupData> => {
    const token = await getToken();
    const res = await fetch(`${API}/${groupId}/link`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ link }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al actualizar link');
    return { ...data, id: data._id };
  },

  reportGroup: async (groupId: string, reason: string, reporterEmail?: string): Promise<{ message: string; reportCount: number }> => {
    const token = await getToken();
    const res = await fetch(`${API}/${groupId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason, reporterEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al reportar');
    return data;
  },
};
