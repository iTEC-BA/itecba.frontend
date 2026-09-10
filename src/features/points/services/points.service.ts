import { auth } from '@/lib/firebase';
import type { PointActivity, GrantResult, PointLogEntry } from '../points.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getHeaders = async (): Promise<HeadersInit> => {
  await auth.authStateReady();
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Sesión caducada o no disponible.");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

const CACHE_KEY = "itec_points_activities";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

// Públicas
export const getActivities = async (): Promise<PointActivity[]> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL_MS) return data;
    }
  } catch (e) {}

  const res = await fetch(`${API_URL}/points/activities`);
  if (!res.ok) throw new Error("Error al cargar actividades públicas");
  const data = await res.json();
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  return data;
};

// Admin
export const getAdminActivities = async (): Promise<PointActivity[]> => {
  const res = await fetch(`${API_URL}/points/activities/admin`, { headers: await getHeaders() });
  if (!res.ok) throw new Error("Error al cargar el panel de actividades");
  return res.json();
};

export const updateActivity = async (key: string, data: Partial<PointActivity>): Promise<PointActivity> => {
  const res = await fetch(`${API_URL}/points/activities/${key}`, {
    method: "PATCH",
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al actualizar actividad");
  }
  return res.json();
};

// Autenticadas
export const grantPointsAPI = async (activityKey: string, context: any = {}): Promise<GrantResult> => {
  const res = await fetch(`${API_URL}/points/grant`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ activityKey, context }),
  });
  if (!res.ok) throw new Error("Error al procesar puntos");
  return res.json();
};

export const getPointHistory = async (): Promise<PointLogEntry[]> => {
  const res = await fetch(`${API_URL}/points/history`, { headers: await getHeaders() });
  if (!res.ok) throw new Error("Error al cargar el historial");
  return res.json();
};
