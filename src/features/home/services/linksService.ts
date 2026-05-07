import { auth } from '@lib/firebase';

export interface CampusLink {
  id?: string;
  title: string;
  url: string;
  icon: string;
  order: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${API_BASE}/links`;

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const linksService = {
  // Público
  getLinks: async (): Promise<CampusLink[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al traer links');
    const data = await res.json();
    // Mapeamos _id a id para que React no se rompa
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  // Solo Admins
  addLink: async (link: Omit<CampusLink, 'id'>): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(link)
    });
    const data = await res.json();
    return data._id;
  },

  updateLink: async (id: string, link: Partial<CampusLink>): Promise<void> => {
    const token = await getToken();
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(link)
    });
  },

  deleteLink: async (id: string): Promise<void> => {
    const token = await getToken();
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};