// src/features/forum/services/forumService.ts
// Único punto de acceso a la API del foro.
import { auth } from "@lib/firebase";
import type {
  ForumFeedResponse,
  ForumPost,
  ForumThreadResponse,
} from "../types/forum";

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/forum`;

const getToken = async (): Promise<string | null> => {
  try {
    return (await auth.currentUser?.getIdToken()) ?? null;
  } catch {
    return null;
  }
};

const authHeaders = async (
  required = false,
): Promise<Record<string, string>> => {
  const token = await getToken();
  if (required && !token) throw new Error("Debes iniciar sesión");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (data as { message?: string }).message || `Error ${res.status}`,
    );
  return data as T;
};

export const forumService = {
  // ── Feed ──────────────────────────────────────────────────────────────────
  getPosts: async (page = 1): Promise<ForumFeedResponse> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/posts?page=${page}`, { headers });
    return handleResponse<ForumFeedResponse>(res);
  },

  // ── Hilo ──────────────────────────────────────────────────────────────────
  getThread: async (id: number): Promise<ForumThreadResponse> => {
    const headers = await authHeaders();
    const res = await fetch(`${BASE}/posts/${id}`, { headers });
    return handleResponse<ForumThreadResponse>(res);
  },

  // ── Crear post ────────────────────────────────────────────────────────────
  createPost: async (body: string): Promise<ForumPost> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ body }),
    });
    return handleResponse<ForumPost>(res);
  },

  // ── Responder ─────────────────────────────────────────────────────────────
  createReply: async (parentId: number, body: string): Promise<ForumPost> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts/${parentId}/replies`, {
      method: "POST",
      headers,
      body: JSON.stringify({ body }),
    });
    return handleResponse<ForumPost>(res);
  },

  // ── Votar ─────────────────────────────────────────────────────────────────
  vote: async (postId: number, value: 1 | -1): Promise<{ upvotes: number }> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts/${postId}/vote`, {
      method: "POST",
      headers,
      body: JSON.stringify({ value }),
    });
    return handleResponse<{ upvotes: number }>(res);
  },

  // ── Eliminar ──────────────────────────────────────────────────────────────
  deletePost: async (postId: number): Promise<void> => {
    const headers = await authHeaders(true);
    const res = await fetch(`${BASE}/posts/${postId}`, {
      method: "DELETE",
      headers,
    });
    await handleResponse<void>(res);
  },

  // ── Web Push ──────────────────────────────────────────────────────────────
  getVapidKey: async (): Promise<string> => {
    const res = await fetch(`${BASE}/push/vapid-key`);
    const data = await handleResponse<{ key: string }>(res);
    return data.key;
  },

  subscribePush: async (subscription: PushSubscription): Promise<void> => {
    const headers = await authHeaders(true);
    await fetch(`${BASE}/push/subscribe`, {
      method: "POST",
      headers,
      body: JSON.stringify({ subscription }),
    });
  },
};
