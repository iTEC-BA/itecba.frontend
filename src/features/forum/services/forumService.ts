// src/features/forum/services/forumService.ts
import { auth } from '@lib/firebase';

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
  // ── Feed ───────────────────────────────────────────────────────────────────
  getPosts: async (page = 1, tab = 'para-ti') => {
    const res = await fetch(`${BASE}/posts?page=${page}&tab=${tab}`, {
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error('Error al cargar el foro');
    return res.json();
  },

  // ── Hilo ───────────────────────────────────────────────────────────────────
  getThread: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Error al cargar el hilo');
    return res.json();
  },

  // ── Crear post ─────────────────────────────────────────────────────────────
  createPost: async (body: string) => {
    const res = await fetch(`${BASE}/posts`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al publicar');
    }
    return res.json();
  },

  // ── Responder ──────────────────────────────────────────────────────────────
  createReply: async (parentId: number, body: string) => {
    const res = await fetch(`${BASE}/posts/${parentId}/replies`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al responder');
    }
    return res.json();
  },

  // ── Votar ──────────────────────────────────────────────────────────────────
  vote: async (id: number, value: 1 | -1) => {
    const res = await fetch(`${BASE}/posts/${id}/vote`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error('Error al votar');
    return res.json();
  },

  // ── Repost ─────────────────────────────────────────────────────────────────
  repost: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}/repost`, {
      method:  'POST',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al repostear');
    return res.json();
  },

  // ── Eliminar ───────────────────────────────────────────────────────────────
  deletePost: async (id: number) => {
    const res = await fetch(`${BASE}/posts/${id}`, {
      method:  'DELETE',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al eliminar');
  },

  // ── Trending ───────────────────────────────────────────────────────────────
  getTrending: async () => {
    const res = await fetch(`${BASE}/trending`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Error al cargar tendencias');
    return res.json();
  },

  // ── VAPID / Push ───────────────────────────────────────────────────────────
  getVapidKey: async (): Promise<string> => {
    const res  = await fetch(`${BASE}/push/vapid-key`);
    const data = await res.json();
    return data.key;
  },

  subscribePush: async (subscription: PushSubscription) => {
    await fetch(`${BASE}/push/subscribe`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify(subscription),
    });
  },
};
