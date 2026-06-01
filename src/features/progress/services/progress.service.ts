// src/features/progress/services/progress.service.ts
// FIX (Legacy Data): normalizeProgressData absorbe respuestas con estructuras
//   viejas (campos renombrados, estados expandidos) antes de que lleguen al hook.
import { auth } from '@/lib/firebase';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5001'}/progress`;

export type FirestoreState = 'a' | 'pr' | 'r' | 'c';

export interface SubjectStateEntry {
  s: FirestoreState;
  n?: number;
  y?: number;
}

export interface ProgressData {
  activeCareer:    string | null;
  enrolledCareers: string[];
  p:               Record<string, SubjectStateEntry>;
}

// ── Helpers internos ──────────────────────────────────────────────────────────
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json() as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch { /* ignorar */ }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
};

const LEGACY_STATE_MAP: Record<string, FirestoreState> = {
  aprobada:     'a',
  promocionada: 'pr',
  regular:      'r',
  regularizada: 'r',
  cursando:     'c',
  en_curso:     'c',
};
const VALID_COMPACT = new Set<string>(['a', 'pr', 'r', 'c']);

/**
 * Normaliza la respuesta cruda del backend al tipo ProgressData esperado por el hook.
 * Tolera datos legacy de Firestore que pudieran pasar el controlador sin migración.
 */
const normalizeProgressData = (raw: unknown): ProgressData => {
  if (!raw || typeof raw !== 'object') {
    return { activeCareer: null, enrolledCareers: [], p: {} };
  }

  const r = raw as Record<string, unknown>;

  // enrolledCareers
  let enrolledCareers: string[] = [];
  if (Array.isArray(r.enrolledCareers)) {
    enrolledCareers = (r.enrolledCareers as unknown[])
      .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
      .map((c) => c.trim().slice(0, 80));
  } else if (typeof r.carrera === 'string' && r.carrera.trim()) {
    enrolledCareers = [r.carrera.trim()];
  }

  // activeCareer
  let activeCareer: string | null = null;
  if (typeof r.activeCareer === 'string' && r.activeCareer.trim()) {
    activeCareer = r.activeCareer.trim().slice(0, 80);
  } else if (enrolledCareers.length > 0) {
    activeCareer = enrolledCareers[0];
  }

  // p — normalizar entradas legacy
  const rawP = (r.p ?? r.progreso ?? r.subjects ?? r.materias ?? {}) as Record<string, unknown>;
  const p: Record<string, SubjectStateEntry> = {};

  for (const [codigo, entry] of Object.entries(rawP)) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;
    const rawS = String(e.s ?? e.estado ?? e.state ?? '').toLowerCase().trim();
    const compact = VALID_COMPACT.has(rawS)
      ? (rawS as FirestoreState)
      : LEGACY_STATE_MAP[rawS] ?? null;

    if (!compact) continue;

    const normalized: SubjectStateEntry = { s: compact };
    const n = Number(e.n ?? e.nota ?? e.grade);
    if (Number.isFinite(n) && n >= 1 && n <= 10) normalized.n = n;
    const y = Number(e.y ?? e.year ?? e.anio);
    if (Number.isFinite(y) && y >= 1990) normalized.y = y;

    p[String(codigo).trim().slice(0, 50)] = normalized;
  }

  return { activeCareer, enrolledCareers, p };
};

// ── API ───────────────────────────────────────────────────────────────────────
export const progressService = {
  getProgress: async (uid: string): Promise<ProgressData> => {
    const res = await fetch(`${BASE}/${uid}`, {
      method:  'GET',
      headers: await getAuthHeaders(),
    });
    const raw = await handleResponse<unknown>(res);
    return normalizeProgressData(raw);
  },

  updateSubject: async (
    uid:    string,
    codigo: string,
    state:  string | null,
    grade?: number,
    year?:  number
  ): Promise<{ ok: boolean; entry?: SubjectStateEntry; state?: null }> => {
    const res = await fetch(`${BASE}/${uid}/subject`, {
      method:  'PATCH',
      headers: await getAuthHeaders(),
      body:    JSON.stringify({ codigo, state, grade, year }),
    });
    return handleResponse(res);
  },

  bulkSave: async (
    uid:     string,
    payload: {
      activeCareer:    string | null;
      enrolledCareers: string[];
      p:               Record<string, SubjectStateEntry>;
    }
  ): Promise<{ ok: boolean; saved: number }> => {
    const res = await fetch(`${BASE}/${uid}/bulk`, {
      method:  'PUT',
      headers: await getAuthHeaders(),
      body:    JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
