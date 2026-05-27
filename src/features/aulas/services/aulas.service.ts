// src/features/aulas/services/aulas.service.ts
import { auth } from "@lib/firebase";
import type {
  AulasListResponse,
  AulaDetailResponse,
  AulaFormData,
  SedeAula,
  FuncionAula,
} from "../types/aulas.types";

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/aulas`;

const getHeaders = async (): Promise<HeadersInit> => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleError = async (res: Response): Promise<never> => {
  const body = await res.json().catch(() => ({})) as Record<string, unknown>;
  throw new Error((body?.message as string) ?? `Error HTTP ${res.status}`);
};

export const aulasService = {
  // ── Públicos ────────────────────────────────────────────────────────────────
  async getList(
    filters?: { sede?: SedeAula; funcion?: FuncionAula }
  ): Promise<AulasListResponse> {
    const params = new URLSearchParams();
    if (filters?.sede)    params.set("sede",    filters.sede);
    if (filters?.funcion) params.set("funcion", filters.funcion);
    const qs = params.toString();
    const res = await fetch(`${BASE}${qs ? `?${qs}` : ""}`);
    if (!res.ok) await handleError(res);
    return res.json() as Promise<AulasListResponse>;
  },

  async getBySlug(slug: string): Promise<AulaDetailResponse> {
    const res = await fetch(`${BASE}/${encodeURIComponent(slug)}`);
    if (!res.ok) await handleError(res);
    return res.json() as Promise<AulaDetailResponse>;
  },

  // ── Admin ───────────────────────────────────────────────────────────────────
  async getAll(): Promise<AulasListResponse> {
    const res = await fetch(`${BASE}/all`, { headers: await getHeaders() });
    if (!res.ok) await handleError(res);
    return res.json() as Promise<AulasListResponse>;
  },

  async create(data: Omit<AulaFormData, "">): Promise<void> {
    const res = await fetch(BASE, {
      method:  "POST",
      headers: await getHeaders(),
      body:    JSON.stringify(data),
    });
    if (!res.ok) await handleError(res);
  },

  async update(id: string, data: Partial<AulaFormData>): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, {
      method:  "PATCH",
      headers: await getHeaders(),
      body:    JSON.stringify(data),
    });
    if (!res.ok) await handleError(res);
  },

  async softDelete(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, {
      method:  "DELETE",
      headers: await getHeaders(),
    });
    if (!res.ok) await handleError(res);
  },

  async uploadImages(id: string, files: File[]): Promise<void> {
    const token = await auth.currentUser?.getIdToken();
    const form  = new FormData();
    files.forEach((f) => form.append("imagenes", f));
    const res = await fetch(`${BASE}/${id}/media`, {
      method:  "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body:    form,
    });
    if (!res.ok) await handleError(res);
  },


  async addVideoUrl(id: string, url: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}/media/video`, {
      method:  "POST",
      headers: await getHeaders(),
      body:    JSON.stringify({ url }),
    });
    if (!res.ok) await handleError(res);
  },

  async deleteMedia(id: string, tipo: "imagen" | "video", url: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}/media`, {
      method:  "DELETE",
      headers: await getHeaders(),
      body:    JSON.stringify({ tipo, url }),
    });
    if (!res.ok) await handleError(res);
  },
};
