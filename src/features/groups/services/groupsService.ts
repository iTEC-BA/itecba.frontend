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

export interface SearchGroupsResult {
  groups: GroupData[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface GroupStats {
  total: number;
  oficiales: number;
  reportados: number;
  carreras: number;
}

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/groups`;

const getToken = async (required = true): Promise<string | null> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token && required) throw new Error('Debes iniciar sesión');
  return token ?? null;
};

export const groupsService = {

  /** Búsqueda server-side con paginación. Requiere carrera+nivel+materia O comision. */
  searchGroups: async (
    params: {
      carrera?: string;
      nivel?: string;
      materia?: string;
      comision?: string;
    },
    page = 1
  ): Promise<SearchGroupsResult> => {
    const qs = new URLSearchParams();
    if (params.carrera)  qs.set('carrera',  params.carrera);
    if (params.nivel)    qs.set('nivel',    params.nivel);
    if (params.materia)  qs.set('materia',  params.materia);
    if (params.comision) qs.set('comision', params.comision);
    qs.set('page', String(page));

    const res = await fetch(`${API}?${qs}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al buscar grupos');

    return {
      groups:     (data.groups ?? []).map((d: GroupData & { _id?: string }) => ({ ...d, id: d._id })),
      total:      data.total     ?? 0,
      page:       data.page      ?? page,
      totalPages: data.totalPages ?? 1,
      hasMore:    data.hasMore   ?? false,
    };
  },

  /** Estadísticas globales (solo admin). */
  getStats: async (): Promise<GroupStats> => {
    const token = await getToken();
    const res = await fetch(`${API}/stats`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al traer estadísticas');
    return res.json();
  },

  getPendingGroups: async (): Promise<GroupData[]> => {
    const token = await getToken();
    const res = await fetch(`${API}/pending`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al traer grupos pendientes');
    const data = await res.json();
    return data.map((d: GroupData & { _id?: string }) => ({ ...d, id: d._id }));
  },

  getReportedGroups: async (): Promise<GroupData[]> => {
    const token = await getToken();
    const res = await fetch(`${API}/reported`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al traer grupos reportados');
    const data = await res.json();
    return data.map((d: GroupData & { _id?: string }) => ({ ...d, id: d._id }));
  },

  checkIsDuplicatePending: async (materia: string, comision: string, link: string): Promise<boolean> => {
    try {
      const pending = await groupsService.getPendingGroups();
      return pending.some(
        g => (g.materia === materia && g.comision.toLowerCase() === comision.toLowerCase()) || g.link === link
      );
    } catch { return false; }
  },

  submitNewGroup: async (groupData: Omit<GroupData, 'id'>, _isAdmin: boolean): Promise<string> => {
    const token = await getToken(false);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(API, { method: 'POST', headers, body: JSON.stringify(groupData) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al subir el grupo');
    return (data as GroupData & { _id?: string })._id ?? '';
  },

  approvePendingGroup: async (group: GroupData): Promise<string> => {
    const token = await getToken();
    const res = await fetch(`${API}/${group.id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error((data as { message?: string }).message || 'Error al aprobar');
    return (data as GroupData & { _id?: string })._id ?? '';
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
    if (!res.ok) throw new Error((data as { message?: string }).message || 'Error al actualizar link');
    return { ...(data as GroupData), id: (data as GroupData & { _id?: string })._id };
  },

  reportGroup: async (groupId: string, reason: string, reporterEmail?: string): Promise<{ message: string; reportCount: number }> => {
    const token = await getToken();
    const res = await fetch(`${API}/${groupId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason, reporterEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data as { message?: string }).message || 'Error al reportar');
    return data as { message: string; reportCount: number };
  },
};
