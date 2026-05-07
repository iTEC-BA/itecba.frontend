/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@lib/firebase';
import type { ResourceData } from '../types/resource.types';

export type { ResourceData };

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/resources`;

const getToken = async (): Promise<string> => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Debes iniciar sesión');
  return token;
};

export const resourcesService = {
  getApprovedResources: async (): Promise<ResourceData[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al traer recursos');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  getPendingResources: async (): Promise<ResourceData[]> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al traer pendientes');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  submitNewResource: async (
    resourceData: Omit<ResourceData, 'id'>,
    _isDirectPublish: boolean,
  ): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(resourceData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al enviar aporte');
    return data._id;
  },

  approvePendingResource: async (resource: ResourceData): Promise<string> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${resource.id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al aprobar');
    return data._id;
  },

  rejectPendingResource: async (resourceId: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${resourceId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Error al eliminar');
  },
};
