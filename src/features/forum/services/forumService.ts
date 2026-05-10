import { auth } from '@lib/firebase';
import type {
  ForumFeedResponse,
  ForumThreadResponse,
  ForumPost,
  ForumBanner,
  ForumTab,
} from '../types/forum';

const BASE = `${import.meta.env.VITE_API_URL}/forum`;

const getHeaders = async (needsAuth = false): Promise<HeadersInit> => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (needsAuth && auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

export const forumService = {

  // ── Feed ───────────────────────────────────────────────────────────────────
  getFeed: async (tab: ForumTab = 'para-ti', page = 1): Promise<ForumFeedResponse> => {
    const res = await fetch(
      `${BASE}/posts?tab=${tab}&page=${page}`,
      { headers: await getHeaders() },
    );
    if (!res.ok) throw new Error('Error al cargar el feed');
    return res.json();
  },

  // ── Thread ─────────────────────────────────────────────────────────────────
  getThread: async (id: number): Promise<ForumThreadResponse> => {
    const res = await fetch(`${BASE}/posts/${id}`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Hilo no encontrado');
    return res.json();
  },

  // ── Crear post ─────────────────────────────────────────────────────────────
  createPost: async (body: string): Promise<ForumPost> => {
    const res = await fetch(`${BASE}/posts`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || 'Error al publicar');
    }
    return res.json();
  },

  // ── Crear respuesta ────────────────────────────────────────────────────────
  createReply: async (postId: number, body: string): Promise<ForumPost> => {
    const res = await fetch(`${BASE}/posts/${postId}/replies`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || 'Error al responder');
    }
    return res.json();
  },

  // ── Votar ──────────────────────────────────────────────────────────────────
  vote: async (id: number, value: 1 | -1): Promise<{ upvotes: number }> => {
    const res = await fetch(`${BASE}/posts/${id}/vote`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error('Error al votar');
    return res.json();
  },

  // ── Repostear ──────────────────────────────────────────────────────────────
  repost: async (id: number): Promise<{ reposts: number; is_reposted: boolean }> => {
    const res = await fetch(`${BASE}/posts/${id}/repost`, {
      method:  'POST',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al repostear');
    return res.json();
  },

  // ── Eliminar ───────────────────────────────────────────────────────────────
  deletePost: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE}/posts/${id}`, {
      method:  'DELETE',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al eliminar');
  },

  // ── Trending ───────────────────────────────────────────────────────────────
  getTrending: async (): Promise<{ posts: ForumPost[] }> => {
    const res = await fetch(`${BASE}/trending`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Error al cargar tendencias');
    return res.json();
  },

  // ── Banners ────────────────────────────────────────────────────────────────
  getBanners: async (activeOnly = true): Promise<ForumBanner[]> => {
    const qs  = activeOnly ? '?active=1' : '';
    const res = await fetch(`${BASE}/banners${qs}`, { headers: await getHeaders() });
    if (!res.ok) throw new Error('Error al cargar banners');
    const data = await res.json();
    return data.banners ?? [];
  },

  createBanner: async (data: Partial<ForumBanner>): Promise<ForumBanner> => {
    const res = await fetch(`${BASE}/banners`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || 'Error al crear banner');
    }
    const json = await res.json();
    return json.banner;
  },

  updateBanner: async (id: number, data: Partial<ForumBanner>): Promise<ForumBanner> => {
    const res = await fetch(`${BASE}/banners/${id}`, {
      method:  'PATCH',
      headers: await getHeaders(true),
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar banner');
    const json = await res.json();
    return json.banner;
  },

  deleteBanner: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE}/banners/${id}`, {
      method:  'DELETE',
      headers: await getHeaders(true),
    });
    if (!res.ok) throw new Error('Error al eliminar banner');
  },

  // ── VAPID / Push ───────────────────────────────────────────────────────────
  getVapidKey: async (): Promise<string> => {
    const res  = await fetch(`${BASE}/push/vapid-key`);
    const data = await res.json();
    return (data as { key: string }).key;
  },

  subscribePush: async (subscription: PushSubscription): Promise<void> => {
    await fetch(`${BASE}/push/subscribe`, {
      method:  'POST',
      headers: await getHeaders(true),
      body:    JSON.stringify(subscription),
    });
  },
};
