// src/features/points/services/points.service.ts
//
// Gestiona la caché de actividades en localStorage y las llamadas al backend.
// La caché tiene TTL de 1 hora — los admins pueden invalidarla manualmente.

import type { PointActivity, GrantResult, PointLogEntry } from "../points.types";

const API_BASE       = import.meta.env.VITE_API_URL ?? "";
const CACHE_KEY      = "itec_point_activities";
const CACHE_TTL_MS   = 60 * 60 * 1000; // 1 hora

interface CacheEntry {
  ts:         number;
  activities: PointActivity[];
}

// ── Caché ────────────────────────────────────────────────────────────────────

const readCache = (): CacheEntry | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
};

const writeCache = (activities: PointActivity[]): void => {
  try {
    const entry: CacheEntry = { ts: Date.now(), activities };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch { /* quota exceeded — ignorar */ }
};

/** Invalida la caché manualmente (útil después de que un admin guarda cambios). */
export const invalidateActivitiesCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};

// ── Obtener catálogo de actividades (con caché) ──────────────────────────────

export const getActivities = async (): Promise<PointActivity[]> => {
  const cached = readCache();
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.activities;
  }

  const res = await fetch(`${API_BASE}/points/activities`);
  if (!res.ok) throw new Error("Error al cargar actividades de puntos");

  const data: PointActivity[] = await res.json();
  writeCache(data);
  return data;
};

/** Devuelve una actividad por key desde la caché (sin llamada de red). */
export const getActivityFromCache = (key: string): PointActivity | null => {
  const cached = readCache();
  if (!cached) return null;
  return cached.activities.find((a) => a.key === key) ?? null;
};

// ── Obtener catálogo completo para admin ─────────────────────────────────────

export const getAdminActivities = async (token: string): Promise<PointActivity[]> => {
  const res = await fetch(`${API_BASE}/points/activities/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar actividades (admin)");
  return res.json();
};

// ── Actualizar actividad (admin) ─────────────────────────────────────────────

export const updateActivity = async (
  id: string,
  patch: Partial<PointActivity>,
  token: string,
): Promise<PointActivity> => {
  const res = await fetch(`${API_BASE}/points/activities/${id}`, {
    method:  "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Error al actualizar actividad");
  invalidateActivitiesCache(); // Forzar recarga en próxima consulta
  return res.json();
};

// ── Otorgar puntos (llamada autenticada) ─────────────────────────────────────

export const grantPointsAPI = async (
  activityKey: string,
  token: string,
  context: Record<string, unknown> = {},
): Promise<GrantResult> => {
  const res = await fetch(`${API_BASE}/points/grant`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify({ activityKey, context }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { granted: false, reason: (err as GrantResult).reason ?? "internal_error" };
  }
  return res.json();
};

// ── Historial del usuario ────────────────────────────────────────────────────

export const getPointHistory = async (token: string): Promise<PointLogEntry[]> => {
  const res = await fetch(`${API_BASE}/points/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar historial de puntos");
  return res.json();
};
