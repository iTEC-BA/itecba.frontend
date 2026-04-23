import type { SubjectStatus, ProgressMetrics } from '../types/progress';

export const calculateSubjectStatus = (
  subject: any, 
  passedIds: string[] = [], 
  regularIds: string[] = [], 
  cursandoIds: string[] = []
): SubjectStatus => {
  if (passedIds.includes(subject.id)) return 'aprobada';
  if (cursandoIds.includes(subject.id)) return 'cursando';

  const reqC = subject.reqCursada || [];
  const reqA = subject.reqAprobada || [];

  const hasReqCursada = reqC.every((id: string) => passedIds.includes(id) || regularIds.includes(id));
  const hasReqAprobada = reqA.every((id: string) => passedIds.includes(id));

  if (regularIds.includes(subject.id)) {
    return hasReqAprobada ? 'habilitada_rendir' : 'regular_bloqueada';
  }

  if (hasReqCursada && hasReqAprobada) return 'habilitada_cursar';
  
  return 'bloqueada';
};

export const calculateStressLevel = (horas: number): ProgressMetrics['nivelEstres'] => {
  if (horas === 0) return 'Bajo';
  if (horas <= 12) return 'Manejable';
  if (horas <= 20) return 'Alto';
  return 'Crítico';
};