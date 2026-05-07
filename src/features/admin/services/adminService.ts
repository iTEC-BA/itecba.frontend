import { collection, getDocs, doc, updateDoc, query, where, limit } from 'firebase/firestore';
import { db, auth } from '@lib/firebase';
import type { User } from '@context/AuthContext';

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  isCritical: boolean;
  expiresAt: { toDate: () => Date };
  createdAt: { toDate: () => Date };
}

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/announcements`;

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const adminService = {
  // --- USUARIOS ---
  getAdmins: async (): Promise<User[]> => {
    const q = query(collection(db, 'users'), where('role', '==', 'admin'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
  },

  searchUserByEmail: async (email: string): Promise<User | null> => {
    const q = query(collection(db, 'users'), where('email', '==', email.trim().toLowerCase()), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as User;
  },

  updateUserRole: async (userId: string, newRole: 'admin' | 'student'): Promise<void> => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
  },

  // --- AVISOS GLOBALES ---
  getActiveAnnouncements: async (): Promise<AnnouncementData[]> => {
    try {
      const url = `${API_URL}/active`;
      console.log("📍 Fetching announcements from:", url);
      
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
  }
};