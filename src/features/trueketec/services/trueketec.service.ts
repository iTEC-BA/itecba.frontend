// src/features/trueketec/services/trueketec.service.ts
import { auth } from "@lib/firebase";
import type {
  TrueketecFeedResponse,
  TrueketecMatchesResponse,
  TrueketecFilters,
  TrueketecFormData,
  EstadoPost,
  Postulante,
} from "../types/trueketec.types";

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api/trueketec`;

const getHeaders = async (): Promise<HeadersInit> => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleError = async (res: Response) => {
  const body = await res.json().catch(() => ({})) as Record<string, unknown>;
  throw new Error((body?.message as string) ?? `Error HTTP ${res.status}`);
};

export const trueketecService = {
  // Feed principal con filtros y paginación
  async getFeed(filters: TrueketecFilters = {}, page = 1): Promise<TrueketecFeedResponse> {
    const params = new URLSearchParams({ page: String(page) });
    if (filters.materia)       params.set("materia",       filters.materia);
    if (filters.departamento)  params.set("departamento",  filters.departamento);
    if (filters.turno_deseado) params.set("turno_deseado", filters.turno_deseado);
    if (filters.comision)      params.set("comision",      filters.comision);

    const res = await fetch(`${BASE}?${params}`, { headers: await getHeaders() });
    if (!res.ok) await handleError(res);
    return res.json() as Promise<TrueketecFeedResponse>;
  },

  // Mis publicaciones propias
  async getMyPosts() {
    const res = await fetch(`${BASE}/my-posts`, { headers: await getHeaders() });
    if (!res.ok) await handleError(res);
    return (await res.json() as { posts: TrueketecFeedResponse["posts"] }).posts;
  },

  // Mis matches perfectos
  async getMyMatches(): Promise<TrueketecMatchesResponse> {
    const res = await fetch(`${BASE}/my-matches`, { headers: await getHeaders() });
    if (!res.ok) await handleError(res);
    return res.json() as Promise<TrueketecMatchesResponse>;
  },

  // Crear publicación
  async createPost(data: TrueketecFormData) {
    const res = await fetch(BASE, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },

  // Cambiar estado (dueño)
  async changeEstado(postId: string, estado: EstadoPost) {
    const res = await fetch(`${BASE}/${postId}/estado`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },

  // Postularse a un trueque
  async postular(postId: string) {
    const res = await fetch(`${BASE}/${postId}/postular`, {
      method: "POST",
      headers: await getHeaders(),
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },

  // Ver postulantes (sólo dueño)
  async getPostulantes(postId: string): Promise<{ postulantes: Postulante[] }> {
    const res = await fetch(`${BASE}/${postId}/postulantes`, { headers: await getHeaders() });
    if (!res.ok) await handleError(res);
    return res.json() as Promise<{ postulantes: Postulante[] }>;
  },

  // Aceptar match cruzado
  async acceptMatch(myPostId: string, targetPostId: string): Promise<{ theirEmail: string }> {
    const res = await fetch(`${BASE}/${myPostId}/accept-match`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ targetPostId }),
    });
    if (!res.ok) await handleError(res);
    return res.json() as Promise<{ theirEmail: string }>;
  },

  // Soft-delete (cambia estado a Trueque Realizado)
  async deletePost(id: string) {
    const res = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });
    if (!res.ok) await handleError(res);
    return res.json();
  },
};
