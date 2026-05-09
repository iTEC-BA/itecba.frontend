import { auth } from '@/lib/firebase';

const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/forum`;

const getHeaders = async (authRequired = false) => {
  const token = await auth.currentUser?.getIdToken();
  if (authRequired && !token) throw new Error('Sesión requerida');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const forumService = {
  getPosts: async (page = 1, tab = 'para-ti') => {
    const res = await fetch(`${BASE}/posts?page=${page}&tab=${tab}`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Error al cargar el foro');
    return res.json();
  },

  getThread: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Error al cargar el hilo');
    return res.json();
  },

  createPost: async (body: string) => {
    const res = await fetch(`${BASE}/posts`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: JSON.stringify({ body }),
    });
    if (!res.ok) throw new Error('Error al publicar');
    return res.json();
  },

  createReply: async (parentId: number, body: string) => {
    const res = await fetch(`${BASE}/posts/${parentId}/replies`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: JSON.stringify({ body }),
    });
    if (!res.ok) throw new Error('Error al responder');
    return res.json();
  },

  vote: async (id: number, value: 1 | -1) => {
    const res = await fetch(`${BASE}/posts/${id}/vote`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error('Error al votar');
    return res.json();
  },

  repost: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}/repost`, {
      method: 'POST',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al repostear');
    return res.json();
  },

  deletePost: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al eliminar');
  },

  getVapidKey: async (): Promise<string> => {
    const res = await fetch(`${BASE}/vapid-public-key`);
    const data = await res.json();
    return data.key;
  },

  subscribePush: async (subscription: PushSubscription) => {
    await fetch(`${BASE}/push/subscribe`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: JSON.stringify(subscription),
    });
  },
};
