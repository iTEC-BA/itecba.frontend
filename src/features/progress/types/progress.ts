export type SubjectStatus = 'aprobada' | 'regular' | 'cursando' | 'disponible' | 'bloqueada';

export interface Subject {
  id: string;
  name: string;
  code: string;
  level: number;
  status: SubjectStatus;
  grade?: number;
  year?: number;
  correlativesToApprove?: string[]; // IDs de materias que necesita tener aprobadas
  correlativesToRegularize?: string[]; // IDs de materias que necesita tener regulares
}

export interface CareerProgress {
  careerName: string;
  averageGrade: number;
  totalProgress: number; // 0 to 100
  subjects: Subject[];
}