import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, Timestamp, query, where, limit } from 'firebase/firestore';
import type { User } from '@/context/AuthContext';

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  expiresAt: Timestamp | any;
  createdAt: Timestamp | any;
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
      if (!res.ok) throw new Error("Error fetching announcements");
      const data = await res.json();
      if (!data || !Array.isArray(data)) return [];

      return data.map((a: any) => ({
        ...a, id: a._id,
        expiresAt: { toDate: () => new Date(a.expiresAt || Date.now()) },
        createdAt: { toDate: () => new Date(a.createdAt || Date.now()) }
      }));
    } catch (error) {
      return []; 
    }
  },

  createAnnouncement: async (title: string, message: string, hoursActive: number): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL_ANNOUNCEMENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: title.trim(), message: message.trim(), hoursActive })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error del Backend`);
    }
    const data = await res.json();
    return data._id;
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    const token = await getToken();
    await fetch(`${API_URL_ANNOUNCEMENTS}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};