// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { db } from '../lib/firebase';
// import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
// import type { User } from '../context/AuthContext';

// export interface AnnouncementData {
//   id: string;
//   title: string;
//   message: string;
//   expiresAt: Timestamp | any;
//   createdAt: Timestamp | any;
// }

// export const adminService = {
//   // --- GESTIÓN DE USUARIOS ---
//   getAllUsers: async (): Promise<User[]> => {
//     const snap = await getDocs(collection(db, 'users'));
//     return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
//   },

//   updateUserRole: async (userId: string, newRole: 'admin' | 'student'): Promise<void> => {
//     await updateDoc(doc(db, 'users', userId), { role: newRole });
//   },

//   // --- GESTIÓN DE AVISOS GLOBAL ---
//   createAnnouncement: async (title: string, message: string, hoursActive: number): Promise<string> => {
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + hoursActive); // Le sumamos las horas de duración
    
//     const docRef = await addDoc(collection(db, 'announcements'), {
//       title,
//       message,
//       expiresAt: Timestamp.fromDate(expiresAt),
//       createdAt: serverTimestamp(),
//     });
//     return docRef.id;
//   },

//   getActiveAnnouncements: async (): Promise<AnnouncementData[]> => {
//     const now = Timestamp.now();
//     // Traemos solo los anuncios cuya fecha de expiración sea mayor a AHORA
//     const q = query(collection(db, 'announcements'), where('expiresAt', '>', now));
//     const snap = await getDocs(q);
//     // Los ordenamos por fecha de creación (el más reciente primero)
//     return snap.docs.map(d => ({ id: d.id, ...d.data() } as AnnouncementData))
//                     .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
//   },

//   deleteAnnouncement: async (id: string): Promise<void> => {
//     await deleteDoc(doc(db, 'announcements', id));
//   }
// };

// // Pequeño helper temporal para el serverTimestamp (ya que en este scope no lo importamos arriba)
// import { serverTimestamp } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import type { User } from '../context/AuthContext';
import { auth } from '../lib/firebase';

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
  // --- GESTIÓN DE USUARIOS (Sigue en Firebase porque depende de Google Auth) ---
  getAllUsers: async (): Promise<User[]> => {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
  },

  updateUserRole: async (userId: string, newRole: 'admin' | 'student'): Promise<void> => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
  },

  // --- GESTIÓN DE AVISOS GLOBAL (Migrado a Node.js + MongoDB) ---
  // --- GESTIÓN DE AVISOS GLOBAL (Migrado a Node.js + MongoDB) ---
  createAnnouncement: async (title: string, message: string, hoursActive: any): Promise<string> => {
    const token = await getToken();

    // 1. ESCUDO ANTI-NaN: Si el input del modal viene vacío o como NaN, lo forzamos a 24hs.
    let validHours = Number(hoursActive);
    if (isNaN(validHours) || validHours <= 0) {
       validHours = 24;
    }

    const res = await fetch(API_URL_ANNOUNCEMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Esto ahora siempre viajará limpio y perfecto
      body: JSON.stringify({ 
        title: title.trim(), 
        message: message.trim(), 
        hoursActive: validHours 
      })
    });

    // 2. CAPTURA DE ERRORES INTELIGENTE: 
    // Ahora leemos el error exacto que envía Node.js en vez de un "Bad Request" genérico.
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      // Lanzamos el error real (Ej: "El título y el mensaje son obligatorios")
      throw new Error(errorData.error || `Error del Backend: ${res.statusText}`);
    }

    const data = await res.json();
    return data._id;
  },

getActiveAnnouncements: async (): Promise<AnnouncementData[]> => {
    try {
      const res = await fetch(`${API_URL_ANNOUNCEMENTS}/active`);
      const data = await res.json();
      
      // 🛡️ ESCUDO: Si data es null, undefined, o no es un arreglo, devolvemos un arreglo vacío
      if (!data || !Array.isArray(data)) {
        console.warn("El backend no devolvió una lista válida de avisos:", data);
        return [];
      }

      // Mapeo para que el Frontend de React siga creyendo que es Firebase
      return data.map((a: any) => ({
        ...a,
        id: a._id,
        // React espera un objeto de Firebase Timestamp, así que lo simulamos convirtiendo la fecha de Mongo:
        expiresAt: { toDate: () => new Date(a.expiresAt || Date.now()) },
        createdAt: { toDate: () => new Date(a.createdAt || Date.now()) }
      }));
    } catch (error) {
      // 🛡️ Si el servidor está apagado o falla, atrapamos el error y evitamos que explote
      console.error("Fallo de conexión al buscar avisos:", error);
      return []; 
    }
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    const token = await getToken();
    await fetch(`${API_URL_ANNOUNCEMENTS}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};