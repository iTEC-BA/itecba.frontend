import { auth } from '@lib/firebase';
import type { User } from '@/stores/authStore';

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  isCritical: boolean;
  expiresAt: { toDate: () => Date };
  createdAt: { toDate: () => Date };
  audienceRoles: string[];
  audienceCareers: string[];
}

export interface RoleDefinition {
  _id?: string;
  key: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_URL}/announcements`;

const getToken = async () => {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

const logServiceError = (operation: string, error: unknown): void => {
  console.error(`❌ Error en ${operation}:`, error);
};

export const adminService = {
  getRoles: async (): Promise<RoleDefinition[]> => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/roles`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      const error = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      throw new Error(error?.message || error?.error || `HTTP ${response.status}`);
    }
    return response.json();
  },

  createRole: async (role: Omit<RoleDefinition, '_id'>): Promise<void> => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(role),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      throw new Error(error?.message || error?.error || `HTTP ${response.status}`);
    }
  },

  updateRole: async (id: string, role: Partial<RoleDefinition>): Promise<void> => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(role),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(detail?.message || `HTTP ${response.status}`);
    }
  },

  deleteRole: async (id: string): Promise<void> => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(detail?.message || `HTTP ${response.status}`);
    }
  },
  // --- USUARIOS ---
  getAdmins: async (): Promise<User[]> => {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/users/admins`, { headers: { Authorization: 'Bearer ' + token } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      logServiceError('getAdmins', error);
      throw error;
    }
  },

  getAuthorized: async (): Promise<User[]> => {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/users/authorized`, { headers: { Authorization: 'Bearer ' + token } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      logServiceError('getAuthorized', error);
      throw error;
    }
  },

  postAuthorized: async (user: Omit<User, 'id'>): Promise<string> => {
    try {
      const email = user.email.trim().toLowerCase();
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/users/authorized`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ email, name: user.name, role: user.role, authorized: true }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json() as { id: string };
      return data.id;
    } catch (error) {
      logServiceError('postAuthorized', error);
      throw error;
    }
  },

  updateAuthorized: async (
    userId: string,
    data: Partial<Omit<User, 'id'>>
  ): Promise<void> => {
    try {
      const token = await getToken();
      const updates = { ...data };
      if (typeof updates.email === 'string') updates.email = updates.email.trim().toLowerCase();
      const response = await fetch(`${BASE_URL}/users/authorized/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      logServiceError('updateAuthorized', error);
      throw error;
    }
  },

  searchUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/users/search?email=${encodeURIComponent(normalizedEmail)}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      logServiceError('searchUserByEmail', error);
      throw error;
    }
  },

  updateUserRole: async (userId: string, newRole: string): Promise<{ emailSent: boolean; roleChanged: boolean }> => {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null) as { message?: string; error?: string } | null;
        throw new Error(error?.message || error?.error || `HTTP ${response.status}`);
      }
      const result = await response.json();
      return {
        emailSent: result.emailSent === true,
        roleChanged: result.roleChanged === true,
      };
    } catch (error) {
      logServiceError('updateUserRole', error);
      throw error;
    }
  },

  deleteUser: async (userId: string, externalAuthorization = false): Promise<void> => {
    const token = await getToken();
    const path = externalAuthorization
      ? `${BASE_URL}/users/authorized/${userId}`
      : `${BASE_URL}/users/${userId}`;
    const response = await fetch(path, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      throw new Error(error?.message || error?.error || `HTTP ${response.status}`);
    }
  },

  // Total de usuarios registrados — endpoint liviano del backend
  // (evita paginar /api/users completo solo para contar).
  getUsersCount: async (): Promise<number> => {
    try {
      const token = await getToken();
      const base = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api');
      const res = await fetch(`${base}/users/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.total ?? 0;
    } catch (error) {
      console.error("❌ Error en getUsersCount:", error);
      return 0;
    }
  },

  // --- AVISOS GLOBALES ---
  getActiveAnnouncements: async (): Promise<AnnouncementData[]> => {
    try {
      const url = `${API_URL}/active`;
      // console.log("📍 Fetching announcements from:", url);
      
      const token = await auth.authStateReady().then(() => auth.currentUser?.getIdToken());
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      if (!data || !Array.isArray(data)) {
        console.warn("⚠️ getActiveAnnouncements no devolvió un array:", data);
        return [];
      }

      return data.map((a: Record<string, unknown>) => ({
        id: String(a._id || a.id || ''),
        title: String(a.title || ''),
        message: String(a.message || ''),
        isCritical: Boolean(a.isCritical),
        expiresAt: a.expiresAt ? { toDate: () => new Date(a.expiresAt as string | number) } : { toDate: () => new Date() },
        createdAt: a.createdAt ? { toDate: () => new Date(a.createdAt as string | number) } : { toDate: () => new Date() }
        ,
        audienceRoles: Array.isArray(a.audienceRoles) ? a.audienceRoles.map(String) : ["all"],
        audienceCareers: Array.isArray(a.audienceCareers) ? a.audienceCareers.map(String) : [],
      }));
    } catch (error) {
      // console.error("❌ Error al obtener avisos:", error instanceof Error ? error.message : error);
      console.log(error)
      return []; 
    }
  },

  getAllActiveAnnouncements: async (): Promise<AnnouncementData[]> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/manage`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.map((a: Record<string, unknown>) => ({
      id: String(a._id || a.id || ''),
      title: String(a.title || ''),
      message: String(a.message || ''),
      isCritical: Boolean(a.isCritical),
      active: Boolean(a.active),
      expiresAt: { toDate: () => new Date(a.expiresAt as string | number) },
      createdAt: { toDate: () => new Date(a.createdAt as string | number) },
      audienceRoles: Array.isArray(a.audienceRoles) ? a.audienceRoles.map(String) : ["all"],
      audienceCareers: Array.isArray(a.audienceCareers) ? a.audienceCareers.map(String) : [],
    }));
  },

  createAnnouncement: async (
    title: string,
    message: string,
    hoursActive: number,
    isCritical: boolean,
    audienceRoles: string[] = ["all"],
    audienceCareers: string[] = [],
  ): Promise<string> => {
    try {
      const token = await getToken();
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          hoursActive,
          isCritical,
          audienceRoles,
          audienceCareers,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.error || `Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      return data._id;
    } catch (error) {
      console.error("❌ Error en createAnnouncement (Frontend):", error);
      throw error;
    }
  },
  
  deleteAnnouncement: async (id: string): Promise<void> => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("❌ Error al borrar aviso:", error);
      throw error;
    }
  },

  // ── Beneficios (TarjeTEC) ──────────────────────────────────────────────
  getAllBenefits: async (token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/benefits/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.benefits ?? [];
    } catch (error) {
      logServiceError('getAllBenefits', error);
      throw error;
    }
  },
  saveBenefit: async (
    payload: Record<string, unknown>,
    editId: string | null,
    token: string
  ) => {
    try {
      const url = editId ? `${BASE_URL}/benefits/${editId}` : `${BASE_URL}/benefits`;
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message ?? `HTTP ${res.status}`);
      }
      return res.json();
    } catch (error) {
      logServiceError('saveBenefit', error);
      throw error;
    }
  },
  deleteBenefit: async (id: string, token: string) => {
    try {
      const res = await fetch(`${BASE_URL}/benefits/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (error) {
      logServiceError('deleteBenefit', error);
      throw error;
    }
  },
};