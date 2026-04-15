// import { db } from '../lib/firebase';
// import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

// export interface CampusLink {
//   id?: string;
//   title: string;
//   url: string;
//   icon: string; // El emoji
//   order: number; // Para mantener el orden
// }

// export const linksService = {
//   getLinks: async (): Promise<CampusLink[]> => {
//     const snap = await getDocs(collection(db, 'campus_links'));
//     const links = snap.docs.map(d => ({ id: d.id, ...d.data() } as CampusLink));
//     return links.sort((a, b) => a.order - b.order);
//   },

//   addLink: async (link: Omit<CampusLink, 'id'>): Promise<string> => {
//     const docRef = await addDoc(collection(db, 'campus_links'), link);
//     return docRef.id;
//   },

//   updateLink: async (id: string, link: Partial<CampusLink>): Promise<void> => {
//     await setDoc(doc(db, 'campus_links', id), link, { merge: true });
//   },

//   deleteLink: async (id: string): Promise<void> => {
//     await deleteDoc(doc(db, 'campus_links', id));
//   }
// };

import { auth } from '../../../lib/firebase';

export interface CampusLink {
  id?: string;
  title: string;
  url: string;
  icon: string;
  order: number;
}

const API_URL = 'http://127.0.0.1:5001/api/links';

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