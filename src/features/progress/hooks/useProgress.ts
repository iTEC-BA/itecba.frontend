import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService, type ProgressData } from '../services/progress.service';
import { useAuthStore } from '@/stores/authStore';
import type { CareerProgress, Subject, UpdateSubjectArgs } from '../types/progress';
import { decomposeProgressMap, calculateSubjectStatus, calculateStressLevel, uiStateToFirestore } from '../utils/academicLogic';
import { CAREER_NAMES, getCareerPlanAsync } from '../data/careers.data';

export { CAREER_NAMES };

const buildCareerProgress = (raw: ProgressData, careerId: string, plan: any[]): CareerProgress => {
  const { passedIds, regularIds, cursandoIds, grades, years } = decomposeProgressMap(raw.p);

  const subjects: Subject[] = plan.map((s) => {
    let status = calculateSubjectStatus(s, passedIds, regularIds, cursandoIds);
    if (status === 'aprobada') {
      const rawS = String((raw.p[s.id] as any)?.s ?? '').toLowerCase().trim();
      if (rawS === 'pr' || rawS === 'promocionada') status = 'promocionada';
    }
    return {
      ...s, status, grade: grades[s.id],
      yearRegularized: (status === 'habilitada_rendir' || status === 'regular_bloqueada') ? years[s.id] : undefined,
      yearApproved: (status === 'aprobada' || status === 'promocionada') ? years[s.id] : undefined,
    };
  });

  const aprobadas = subjects.filter((s) => s.status === 'aprobada').length;
  const promocionadas = subjects.filter((s) => s.status === 'promocionada').length;
  const regulares = subjects.filter((s) => s.status === 'habilitada_rendir' || s.status === 'regular_bloqueada').length;
  const cursando = subjects.filter((s) => s.status === 'cursando').length;
  const total = subjects.length;

  const gradedSubjects = subjects.filter((s) => (s.status === 'aprobada' || s.status === 'promocionada') && s.grade !== undefined);
  const promedio = gradedSubjects.length > 0 ? (gradedSubjects.reduce((acc, s) => acc + (s.grade ?? 0), 0) / gradedSubjects.length).toFixed(2) : '—';
  const horasSemanales = cursando * 4;
  const porcentajeAvance = total > 0 ? Math.round(((aprobadas + promocionadas) / total) * 100) : 0;

  return {
    activeCareerId: careerId,
    enrolledCareers: raw.enrolledCareers,
    careerName: CAREER_NAMES[careerId] ?? careerId,
    subjects,
    metrics: {
      total, aprobadas, promocionadas, regulares, cursando, porcentajeAvance, promedio,
      horasSemanales, nivelEstres: calculateStressLevel(horasSemanales),
      vencimientosProximos: subjects.filter((s) => (s.status === 'habilitada_rendir' || s.status === 'regular_bloqueada') && s.yearRegularized !== undefined && s.yearRegularized <= new Date().getFullYear() - 3)
    },
  };
};

export const useProgress = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const queryKey = ['progress', user?.id] as const;

  const { data: queryData, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const raw = await progressService.getProgress(user!.id!);
      const activeCareer = raw?.activeCareer ?? raw?.enrolledCareers?.[0] ?? 'sistemas';
      const plan = await getCareerPlanAsync(activeCareer);
      return { raw, activeCareer, plan };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
  });

  const data: CareerProgress | undefined = queryData ? buildCareerProgress(queryData.raw, queryData.activeCareer, queryData.plan) : undefined;

  const mutation = useMutation({
    mutationFn: (vars: { codigo: string; state: string | null; grade?: number; year?: number; }) =>
      progressService.updateSubject(user!.id!, vars.codigo, vars.state, vars.grade, vars.year),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateSubjectStatus = ({ id, status, grade, year }: UpdateSubjectArgs) => {
    mutation.mutate({ codigo: id, state: uiStateToFirestore(status), grade, year });
  };

  const switchCareer = (careerId: string) => {
    if (!queryData?.raw) return;
    const newEnrolled = queryData.raw.enrolledCareers.includes(careerId) ? queryData.raw.enrolledCareers : [...queryData.raw.enrolledCareers, careerId].slice(0, 3);
    progressService.bulkSave(user!.id!, { activeCareer: careerId, enrolledCareers: newEnrolled, p: queryData.raw.p })
      .then(() => queryClient.invalidateQueries({ queryKey }));
  };

  const removeCareer = (careerId: string) => {
    if (!queryData?.raw) return;
    const newEnrolled = queryData.raw.enrolledCareers.filter((c) => c !== careerId);
    progressService.bulkSave(user!.id!, { activeCareer: newEnrolled[0] ?? null, enrolledCareers: newEnrolled, p: queryData.raw.p })
      .then(() => queryClient.invalidateQueries({ queryKey }));
  };

  return { data, isLoading, isError, updateSubjectStatus, switchCareer, removeCareer };
};
