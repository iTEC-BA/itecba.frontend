import { collection, getDocs, doc, updateDoc, query, where, limit, setDoc } from 'firebase/firestore';
import { db, auth } from '@lib/firebase';
import type { User } from '@/stores/authStore';

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  isCritical: boolean;
  expiresAt: { toDate: () => Date };
  createdAt: { toDate: () => Date };
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_URL}/announcements`;

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

const logServiceError = (operation: string, error: unknown): void => {
  console.error(`❌ Error en ${operation}:`, error);
};

export const adminService = {
  // --- USUARIOS ---
  getAdmins: async (): Promise<User[]> => {
    try {
      const q = query(collection(db, 'users'), where('role', 'in', ['admin', 'moderator']));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
    } catch (error) {
      logServiceError('getAdmins', error);
      throw error;
    }
  },

  getAuthorized: async (): Promise<User[]> => {
    try {
      // La autorización de usuarios externos se administra en esta colección,
      // que también utiliza authStore para validar el acceso.
      const q = query(
        collection(db, 'users_autorized'),
        where('authorized', '==', true),
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
    } catch (error) {
      logServiceError('getAuthorized', error);
      throw error;
    }
  },

  postAuthorized: async (user: Omit<User, 'id'>): Promise<string> => {
    try {
      const email = user.email.trim().toLowerCase();
      const existingQuery = query(
        collection(db, 'users_autorized'),
        where('email', '==', email),
        limit(1),
      );
      const existingSnap = await getDocs(existingQuery);
      const authorizedRef = existingSnap.empty
        ? doc(collection(db, 'users_autorized'))
        : existingSnap.docs[0].ref;
      await setDoc(authorizedRef, { ...user, email, authorized: true });
      return authorizedRef.id;
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
      const updates = { ...data };
      if (typeof updates.email === 'string') {
        updates.email = updates.email.trim().toLowerCase();
      }
      await updateDoc(doc(db, 'users_autorized', userId), updates);
    } catch (error) {
      logServiceError('updateAuthorized', error);
      throw error;
    }
  },

  searchUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const usersQuery = query(collection(db, 'users'), where('email', '==', normalizedEmail), limit(1));
      const usersSnap = await getDocs(usersQuery);
      if (!usersSnap.empty) {
        const userDoc = usersSnap.docs[0];
        return { id: userDoc.id, ...userDoc.data() } as User;
      }

      const authorizedQuery = query(
        collection(db, 'users_autorized'),
        where('email', '==', normalizedEmail),
        limit(1),
      );
      const authorizedSnap = await getDocs(authorizedQuery);
      if (authorizedSnap.empty) return null;

      const authorizedDoc = authorizedSnap.docs[0];
      return {
        id: authorizedDoc.id,
        ...authorizedDoc.data(),
        isExternalAuthorization: true,
      } as User;
    } catch (error) {
      logServiceError('searchUserByEmail', error);
      throw error;
    }
  },

  updateUserRole: async (userId: string, newRole: 'admin' | 'student' | 'moderator' | 'ingresante' ): Promise<void> => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (error) {
      logServiceError('updateUserRole', error);
      throw error;
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
      
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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
      }));
    } catch (error) {
      // console.error("❌ Error al obtener avisos:", error instanceof Error ? error.message : error);
      console.log(error)
      return []; 
    }
  },

  createAnnouncement: async (title: string, message: string, hoursActive: number, isCritical: boolean): Promise<string> => {
    try {
      const token = await getToken();
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: title.trim(), message: message.trim(), hoursActive, isCritical })
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