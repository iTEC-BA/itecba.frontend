// ── Estado calculado en runtime (no se persiste) ─────────────
export type SubjectStatus =
  | 'aprobada'
  | 'promocionada'
  | 'habilitada_rendir'
  | 'regular_bloqueada'
  | 'cursando'
  | 'habilitada_cursar'
  | 'bloqueada';

// ── Valor guardado en Firestore ───────────────────────────────
export type FirestoreState = 'a' | 'pr' | 'r' | 'c';

export interface FirestoreSubjectEntry {
  s: FirestoreState;
  n?: number; // nota 1-10
  y?: number; // año
}

export interface FirestoreProgressDoc {
  activeCareer:    string | null;
  enrolledCareers: string[];
  p: Record<string, FirestoreSubjectEntry>;
}

export interface Subject {
  id:               string;
  name:             string;
  code:             string;
  level:            number;
  status:           SubjectStatus;
  grade?:           number;
  yearRegularized?: number;
  yearApproved?:    number;
  reqCursada:       string[];
  reqAprobada:      string[];
}

export interface ProgressMetrics {
  total:                number;
  aprobadas:            number;
  promocionadas:        number;
  regulares:            number;
  cursando:             number;
  porcentajeAvance:     number;
  promedio:             string;
  horasSemanales:       number;
  nivelEstres:          'Bajo' | 'Manejable' | 'Alto' | 'Crítico';
  vencimientosProximos: Subject[];
}

export interface CareerProgress {
  activeCareerId:  string;
  enrolledCareers: string[];
  careerName:      string;
  metrics:         ProgressMetrics;
  subjects:        Subject[];
}

export interface UpdateSubjectArgs {
  id:      string;
  status:  string;
  grade?:  number;
  year?:   number;
}
