// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { db } from '../lib/firebase';
// import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, Timestamp, query, orderBy, limit } from 'firebase/firestore';

// export interface ResourceData {
//   id: string;
//   title: string;
//   carrera: string;
//   nivel: string;
//   materia: string;
//   tipo: string;
//   formato: string;
//   link: string;
//   autor: string;
//   createdAt?: Timestamp | any;
//   submittedBy?: string;
// }

// export const resourcesService = {
//   getApprovedResources: async (): Promise<ResourceData[]> => {
//     // Solo trae los últimos 150 apuntes más recientes
//     const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(50));
//     const snap = await getDocs(q);
//     return snap.docs.map(d => ({ id: d.id, ...d.data() } as ResourceData));
//   },

//   getPendingResources: async (): Promise<ResourceData[]> => {
//     const snap = await getDocs(collection(db, 'pending_resources'));
//     return snap.docs.map(d => ({ id: d.id, ...d.data() } as ResourceData));
//   },

//   submitNewResource: async (resourceData: Omit<ResourceData, 'id'>, isDirectPublish: boolean): Promise<string> => {
//     const collectionName = isDirectPublish ? 'resources' : 'pending_resources';
//     const docRef = await addDoc(collection(db, collectionName), {
//       ...resourceData,
//       createdAt: serverTimestamp(),
//     });
//     return docRef.id;
//   },

//   approvePendingResource: async (resource: ResourceData): Promise<string> => {
//     const { id, ...data } = resource;
//     const docRef = await addDoc(collection(db, 'resources'), data);
//     await deleteDoc(doc(db, 'pending_resources', id));
//     return docRef.id;
//   },

//   rejectPendingResource: async (resourceId: string): Promise<void> => {
//     await deleteDoc(doc(db, 'pending_resources', resourceId));
//   }
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '../../../lib/firebase';

export interface ResourceData {
  id: string;
  title: string;
  carrera: string;
  nivel: string;
  materia: string;
  tipo: string;
  formato: string;
  link: string;
  autor: string;
  createdAt?: any;
  submittedBy?: string;
}

// Asegúrate de que este sea tu puerto real
const API_URL = 'http://127.0.0.1:5001/api/resources';

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const resourcesService = {
  
  getApprovedResources: async (): Promise<ResourceData[]> => {
    // 🔴 CORRECCIÓN 1: Quitamos /approved
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al traer recursos');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  getPendingResources: async (): Promise<ResourceData[]> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al traer pendientes');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  submitNewResource: async (resourceData: Omit<ResourceData, 'id'>, isDirectPublish: boolean): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(resourceData)
    });
    const data = await res.json();
    // 🔴 BLINDAJE EXTRA: Verificamos si hubo error
    if (!res.ok) throw new Error(data.message || 'Error al enviar aporte');
    return data._id;
  },

  approvePendingResource: async (resource: ResourceData): Promise<string> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${resource.id}/approve`, {
      method: 'PUT', // 🔴 CORRECCIÓN 2: Cambiamos PATCH por PUT
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al aprobar');
    return data._id;
  },

  rejectPendingResource: async (resourceId: string): Promise<void> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${resourceId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al eliminar');
  }
};