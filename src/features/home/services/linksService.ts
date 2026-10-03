import { auth } from '@lib/firebase';

export interface CampusLink {
  id?: string;
  title: string;
  url: string;
  icon: string;
  imageUrl?: string;
  sectionId?: string | null;
  order: number;
}

export type LinkDisplayType = 'chips' | 'stories' | 'carousel';
export type AudienceRole = 'all' | 'student' | 'ingresante' | 'afiliado' | 'profesor' | 'moderator' | 'admin';

export interface LinkSection {
  id: string;
  title: string;
  description?: string;
  displayType: LinkDisplayType;
  audienceRoles: AudienceRole[];
  order: number;
  isActive?: boolean;
  links: CampusLink[];
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${API_BASE}/links`;
let sectionsRequest: Promise<LinkSection[]> | null = null;

const getToken = async (): Promise<string> => {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Sesión caducada o no disponible.');
  return token;
};

const authHeaders = (token: string): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const linksService = {
  getLinks: async (): Promise<CampusLink[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) {
      const detail = await res.json().catch(() => null) as { message?: string } | null;
      throw new Error(detail?.message || `Error al traer links (HTTP ${res.status})`);
    }
    const data = await res.json();
    return data.map((item: CampusLink & { _id: string }) => ({ ...item, id: item._id }));
  },
  getSections: async (): Promise<LinkSection[]> => {
    if (!sectionsRequest) {
      sectionsRequest = (async () => {
        const res = await fetch(`${API_URL}/sections`);
        if (!res.ok) {
          const detail = await res.json().catch(() => null) as { message?: string } | null;
          throw new Error(detail?.message || `Error al traer secciones (HTTP ${res.status})`);
        }
        return res.json() as Promise<LinkSection[]>;
      })().finally(() => {
        sectionsRequest = null;
      });
    }
    return sectionsRequest;
  },
  getAllSections: async (): Promise<Omit<LinkSection, 'links'>[]> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/sections/all`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al traer secciones');
    const data = await res.json();
    return data.map((item: Omit<LinkSection, 'links'> & { _id: string }) => ({ ...item, id: item._id }));
  },
  addSection: async (section: Omit<LinkSection, 'id' | 'links'>): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/sections`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(section) });
    if (!res.ok) throw new Error('Error al crear sección');
  },
  updateSection: async (id: string, section: Partial<Omit<LinkSection, 'id' | 'links'>>): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/sections/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(section) });
    if (!res.ok) throw new Error('Error al actualizar sección');
  },
  deleteSection: async (id: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/sections/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al eliminar sección');
  },
  addLink: async (link: Omit<CampusLink, 'id'>): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(link) });
    if (!res.ok) throw new Error('Error al agregar link');
    const data = await res.json();
    return data._id;
  },
  updateLink: async (id: string, link: Partial<CampusLink>): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(link) });
    if (!res.ok) throw new Error('Error al actualizar link');
  },
  deleteLink: async (id: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error('Error al eliminar link');
  },
};
