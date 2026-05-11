// src/features/trueketec/services/trueketec.service.ts
import { auth } from "@lib/firebase";
import type {
  TrueketecFeedResponse,
  TrueketecMatchesResponse,
  TrueketecFilters,
  TrueketecFormData,
} from "../types/trueketec.types";

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api/trueketec`;

const getHeaders = async (): Promise<HeadersInit> => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const trueketecService = {
  async getFeed(filters: TrueketecFilters = {}, page = 1): Promise<TrueketecFeedResponse> {
    const params = new URLSearchParams({ page: String(page) });
    if (filters.materia)         params.set("materia",         filters.materia);
    if (filters.turno_deseado)   params.set("turno_deseado",   filters.turno_deseado);
    if (filters.comision_actual) params.set("comision_actual", filters.comision_actual);

    const res = await fetch(`${BASE}?${params}`, { headers: await getHeaders() });
    if (!res.ok) throw new Error("Error al cargar el feed.");
    return res.json();
  },

  async getMyMatches(): Promise<TrueketecMatchesResponse> {
    const res = await fetch(`${BASE}/my-matches`, { headers: await getHeaders() });
    if (!res.ok) throw new Error("Error al cargar los matches.");
    return res.json();
  },

  async createPost(data: TrueketecFormData) {
    const res = await fetch(BASE, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string })?.error ?? "Error al publicar la solicitud.");
    }
    return res.json();
  },

  async deletePost(id: string) {
    const res = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar la solicitud.");
    return res.json();
  },

  async acceptMatch(myPostId: string, targetPostId: string) {
    const res = await fetch(`${BASE}/${myPostId}/accept-match`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ targetPostId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string })?.error ?? "Error al aceptar el match.");
    }
    return res.json();
  },
};
