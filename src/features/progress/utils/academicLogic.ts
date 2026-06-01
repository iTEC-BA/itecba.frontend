// src/features/progress/utils/academicLogic.ts
// FIX (Legacy Data): decomposeProgressMap acepta estados compactos ('a','pr','r','c')
//   Y estados expandidos legacy ('aprobada','regular','cursando','promocionada')
//   sin crashear, para que datos viejos de Firestore no rompan la UI.
import type {
  SubjectStatus,
  ProgressMetrics,
  FirestoreSubjectEntry,
} from '../types/progress';

// ── Tabla de normalización legacy ────────────────────────────────────────────
const LEGACY_TO_COMPACT: Record<string, FirestoreSubjectEntry['s']> = {
  aprobada:     'a',
  promocionada: 'pr',
  regular:      'r',
  regularizada: 'r',
  cursando:     'c',
  en_curso:     'c',
};

const VALID_COMPACT = new Set<string>(['a', 'pr', 'r', 'c']);

/** Resuelve el estado compacto Firestore desde cualquier formato de entrada. */
const resolveCompact = (
  raw: FirestoreSubjectEntry | Record<string, unknown> | undefined
): FirestoreSubjectEntry['s'] | null => {
  if (!raw || typeof raw !== 'object') return null;
  const rawObj = raw as Record<string, unknown>;
  const s = String(rawObj.s ?? rawObj.estado ?? rawObj.state ?? '').toLowerCase().trim();
  if (VALID_COMPACT.has(s)) return s as FirestoreSubjectEntry['s'];
  return LEGACY_TO_COMPACT[s] ?? null;
};

// ── Descomposición del mapa Firestore → conjuntos de IDs ──────────────────────
export interface DecomposedProgress {
  passedIds:   Set<string>; // 'a' | 'pr'
  regularIds:  Set<string>; // 'r'
  cursandoIds: Set<string>; // 'c'
  grades:      Record<string, number>;
  years:       Record<string, number>;
}

export const decomposeProgressMap = (
  p: Record<string, FirestoreSubjectEntry | Record<string, unknown>>
): DecomposedProgress => {
  const passedIds   = new Set<string>();
  const regularIds  = new Set<string>();
  const cursandoIds = new Set<string>();
  const grades: Record<string, number> = {};
  const years:  Record<string, number> = {};

  for (const [codigo, entry] of Object.entries(p)) {
    const compact = resolveCompact(entry as Record<string, unknown>);
    if (!compact) continue; // entrada corrupta o desconocida → ignorar sin crash

    if (compact === 'a' || compact === 'pr') {
      passedIds.add(codigo);
      // nota: soportar tanto 'n' (nuevo) como 'nota'/'grade' (legacy)
      const n = Number(
        (entry as Record<string, unknown>).n ??
        (entry as Record<string, unknown>).nota ??
        (entry as Record<string, unknown>).grade
      );
      if (Number.isFinite(n) && n >= 1 && n <= 10) grades[codigo] = n;
      const y = Number(
        (entry as Record<string, unknown>).y ??
        (entry as Record<string, unknown>).year ??
        (entry as Record<string, unknown>).anio
      );
      if (Number.isFinite(y) && y >= 1990 && y <= new Date().getFullYear() + 1) {
        years[codigo] = y;
      }
    } else if (compact === 'r') {
      regularIds.add(codigo);
      const y = Number(
        (entry as Record<string, unknown>).y ??
        (entry as Record<string, unknown>).year ??
        (entry as Record<string, unknown>).anio
      );
      if (Number.isFinite(y) && y >= 1990 && y <= new Date().getFullYear() + 1) {
        years[codigo] = y;
      }
    } else if (compact === 'c') {
      cursandoIds.add(codigo);
    }
  }

  return { passedIds, regularIds, cursandoIds, grades, years };
};

// ── Estado calculado de una materia ──────────────────────────────────────────
export const calculateSubjectStatus = (
  subject: { id: string; reqCursada?: string[]; reqAprobada?: string[] },
  passedIds:   Set<string>,
  regularIds:  Set<string>,
  cursandoIds: Set<string>
): SubjectStatus => {
  if (passedIds.has(subject.id)) return 'aprobada'; // distinción aprobada/prom la hace buildCareerProgress
  if (cursandoIds.has(subject.id)) return 'cursando';

  const reqC = subject.reqCursada  ?? [];
  const reqA = subject.reqAprobada ?? [];

  const hasReqCursada  = reqC.every((id) => passedIds.has(id) || regularIds.has(id));
  const hasReqAprobada = reqA.every((id) => passedIds.has(id));

  if (regularIds.has(subject.id)) {
    return hasReqAprobada ? 'habilitada_rendir' : 'regular_bloqueada';
  }

  if (hasReqCursada && hasReqAprobada) return 'habilitada_cursar';
  return 'bloqueada';
};

// ── Estado UI → estado Firestore compacto ────────────────────────────────────
export const uiStateToFirestore = (
  uiStatus: string
): 'a' | 'pr' | 'r' | 'c' | null => {
  if (uiStatus === 'promocionada')    return 'pr';
  if (uiStatus === 'aprobada')        return 'a';
  if (
    uiStatus === 'regular'             ||
    uiStatus === 'habilitada_rendir'   ||
    uiStatus === 'regular_bloqueada'
  )                                   return 'r';
  if (uiStatus === 'cursando')        return 'c';
  return null;
};

// ── Nivel de estrés ───────────────────────────────────────────────────────────
export const calculateStressLevel = (
  horas: number
): ProgressMetrics['nivelEstres'] => {
  if (horas === 0)  return 'Bajo';
  if (horas <= 12)  return 'Manejable';
  if (horas <= 20)  return 'Alto';
  return 'Crítico';
};
