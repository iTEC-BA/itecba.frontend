export type SubjectStatus = 
  | 'aprobada' 
  | 'habilitada_rendir' 
  | 'regular_bloqueada' 
  | 'cursando'
  | 'habilitada_cursar' 
  | 'bloqueada';

export interface SubjectMetrics {
  weeklyHours?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  level: number;
  status: SubjectStatus;
  grade?: number;
  yearRegularized?: number;
  yearApproved?: number;
  metrics?: SubjectMetrics;
  reqCursada: string[];
  reqAprobada: string[];
}

export interface ProgressMetrics {
  total: number;
  aprobadas: number;
  regulares: number;
  cursando: number;
  porcentajeAvance: number;
  promedio: string;
  horasSemanales: number;
  nivelEstres: 'Bajo' | 'Manejable' | 'Alto' | 'Crítico';
  vencimientosProximos: Subject[];
}

export interface CareerProgress {
  activeCareerId: string;
  enrolledCareers: string[];
  careerName: string;
  metrics: ProgressMetrics;
  subjects: Subject[];
}