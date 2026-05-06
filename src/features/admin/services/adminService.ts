import { collection, getDocs, doc, updateDoc, query, where, limit } from 'firebase/firestore';
import { db, auth } from '@lib/firebase';
import type { User } from '@context/AuthContext';

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  isCritical: boolean;
  expiresAt: any;
  createdAt: any;
}

const API_URL_ANNOUNCEMENTS = 'http://127.0.0.1:5001/api/announcements';

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
      const res = await fetch(`${API_URL_ANNOUNCEMENTS}/active`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      
      if (!data || !Array.isArray(data)) {
        console.warn("⚠️ getActiveAnnouncements no devolvió un array:", data);
        return [];
      }

      return data.map((a: any) => ({
        ...a, 
        id: a._id || a.id, // Seguridad extra por si viene como id o _id
        isCritical: Boolean(a.isCritical),
        expiresAt: a.expiresAt ? { toDate: () => new Date(a.expiresAt) } : { toDate: () => new Date() },
        createdAt: a.createdAt ? { toDate: () => new Date(a.createdAt) } : { toDate: () => new Date() }
      }));
    } catch (error) {
      console.error("❌ Error al obtener avisos:", error);
      return []; 
    }
  },

  createAnnouncement: async (title: string, message: string, hoursActive: number, isCritical: boolean): Promise<string> => {
    try {
      const token = await getToken();
      const res = await fetch(API_URL_ANNOUNCEMENTS, {
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
      await fetch(`${API_URL_ANNOUNCEMENTS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("❌ Error al borrar aviso:", error);
      throw error;
    }
  }
};