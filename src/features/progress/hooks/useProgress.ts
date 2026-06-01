// src/features/progress/hooks/useProgress.ts
// FIX (tabla vacía ROOT CAUSE): importa getCareerPlan real desde careers.data.ts
//   en lugar del stub que devolvía [] para toda carrera.
// FIX (memoria): gcTime razonable para no acumular datos obsoletos.
// FIX (asincronía): onMutate con cancelQueries correcto.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService, type ProgressData }    from '../services/progress.service';
import { useAuth }                               from '@/context/AuthContext';
import type { CareerProgress, Subject, UpdateSubjectArgs } from '../types/progress';
import {
  decomposeProgressMap,
  calculateSubjectStatus,
  calculateStressLevel,
  uiStateToFirestore,
} from '../utils/academicLogic';
import { CAREER_NAMES, getCareerPlan } from '../data/careers.data';

export { CAREER_NAMES };

// ── Construcción de CareerProgress desde datos crudos ─────────────────────────
const buildCareerProgress = (
  raw:      ProgressData,
  careerId: string
): CareerProgress => {
  const plan = getCareerPlan(careerId);
  const { passedIds, regularIds, cursandoIds, grades, years } =
    decomposeProgressMap(raw.p);

  const subjects: Subject[] = plan.map((s) => {
    const firestoreEntry = raw.p[s.id];
    let status = calculateSubjectStatus(s, passedIds, regularIds, cursandoIds);

    // Distinguir 'aprobada' vs 'promocionada' con el mapa original.
    if (status === 'aprobada') {
      const rawS = String(
        (firestoreEntry as unknown as Record<string, unknown>)?.s ?? ''
      ).toLowerCase().trim();
      if (rawS === 'pr' || rawS === 'promocionada') status = 'promocionada';
    }

    return {
      ...s,
      status,
      grade:           grades[s.id],
      yearRegularized:
        (status === 'habilitada_rendir' || status === 'regular_bloqueada')
          ? years[s.id]
          : undefined,
      yearApproved:
        (status === 'aprobada' || status === 'promocionada')
          ? years[s.id]
          : undefined,
    };
  });

  const aprobadas     = subjects.filter((s) => s.status === 'aprobada').length;
  const promocionadas = subjects.filter((s) => s.status === 'promocionada').length;
  const regulares     = subjects.filter(
    (s) => s.status === 'habilitada_rendir' || s.status === 'regular_bloqueada'
  ).length;
  const cursando  = subjects.filter((s) => s.status === 'cursando').length;
  const total     = subjects.length;

  const gradedSubjects = subjects.filter(
    (s) =>
      (s.status === 'aprobada' || s.status === 'promocionada') &&
      s.grade !== undefined
  );
  const promedio =
    gradedSubjects.length > 0
      ? (
          gradedSubjects.reduce((acc, s) => acc + (s.grade ?? 0), 0) /
          gradedSubjects.length
        ).toFixed(2)
      : '—';

  const horasSemanales = cursando * 4;
  const nivelEstres    = calculateStressLevel(horasSemanales);

  const THREE_YEARS_AGO = new Date().getFullYear() - 3;
  const vencimientosProximos = subjects.filter(
    (s) =>
      (s.status === 'habilitada_rendir' || s.status === 'regular_bloqueada') &&
      s.yearRegularized !== undefined &&
      s.yearRegularized <= THREE_YEARS_AGO
  );

  const porcentajeAvance =
    total > 0
      ? Math.round(((aprobadas + promocionadas) / total) * 100)
      : 0;

  return {
    activeCareerId:  careerId,
    enrolledCareers: raw.enrolledCareers,
    careerName:      CAREER_NAMES[careerId] ?? careerId,
    subjects,
    metrics: {
      total,
      aprobadas,
      promocionadas,
      regulares,
      cursando,
      porcentajeAvance,
      promedio,
      horasSemanales,
      nivelEstres,
      vencimientosProximos,
    },
  };
};

// ── Hook principal ─────────────────────────────────────────────────────────────
export const useProgress = () => {
  const { user }    = useAuth();
  const queryClient = useQueryClient();
  const queryKey    = ['progress', user?.id] as const;

  const { data: rawData, isLoading, isError } = useQuery<ProgressData>({
    queryKey,
    queryFn:   () => progressService.getProgress(user!.id!),
    enabled:   !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime:    1000 * 60 * 30, // 30 minutos — FIX: evitar acumulación en memoria
  });

  const activeCareer = rawData?.activeCareer ?? rawData?.enrolledCareers?.[0] ?? null;

  // FIX (tabla vacía): si activeCareer tiene valor pero no tiene plan, la UI
  // muestra mensaje de "carrera sin plan" en lugar de tabla vacía silenciosa.
  const data: CareerProgress | undefined =
    rawData && activeCareer
      ? buildCareerProgress(rawData, activeCareer)
      : undefined;

  // ── Mutación: actualizar estado de una materia ──────────────────────────────
  const mutation = useMutation({
    mutationFn: (vars: {
      codigo: string;
      state:  string | null;
      grade?: number;
      year?:  number;
    }) =>
      progressService.updateSubject(
        user!.id!,
        vars.codigo,
        vars.state,
        vars.grade,
        vars.year
      ),

    // FIX: Optimistic update correcto — modifica el mapa `p` con el estado compacto.
    onMutate: async (newSubject) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ProgressData>(queryKey);

      queryClient.setQueryData<ProgressData>(queryKey, (old) => {
        if (!old) return old;
        const newP = { ...old.p };
        if (newSubject.state === null) {
          delete newP[newSubject.codigo];
        } else {
          newP[newSubject.codigo] = {
            s: newSubject.state as 'a' | 'pr' | 'r' | 'c',
            ...(newSubject.grade !== undefined ? { n: newSubject.grade } : {}),
            ...(newSubject.year  !== undefined ? { y: newSubject.year  } : {}),
          };
        }
        return { ...old, p: newP };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // ── updateSubjectStatus: convierte UI → Firestore ────────────────────────────
  const updateSubjectStatus = ({
    id,
    status,
    grade,
    year,
  }: UpdateSubjectArgs) => {
    const firestoreState = uiStateToFirestore(status);
    mutation.mutate({ codigo: id, state: firestoreState, grade, year });
  };

  // ── switchCareer: cambia/agrega carrera activa ────────────────────────────────
  const switchCareer = (careerId: string) => {
    if (!rawData) return;
    const isAlreadyEnrolled = rawData.enrolledCareers.includes(careerId);
    const newEnrolled = isAlreadyEnrolled
      ? rawData.enrolledCareers
      : [...rawData.enrolledCareers, careerId].slice(0, 2);

    queryClient.setQueryData<ProgressData>(queryKey, (old) =>
      old ? { ...old, activeCareer: careerId, enrolledCareers: newEnrolled } : old
    );

    progressService
      .bulkSave(user!.id!, {
        activeCareer:    careerId,
        enrolledCareers: newEnrolled,
        p:               rawData.p,
      })
      .catch(() => queryClient.invalidateQueries({ queryKey }));
  };

  // ── removeCareer: elimina carrera del plan ────────────────────────────────────
  const removeCareer = (careerId: string) => {
    if (!rawData) return;
    const newEnrolled = rawData.enrolledCareers.filter((c) => c !== careerId);
    const newActive   = newEnrolled[0] ?? null;

    queryClient.setQueryData<ProgressData>(queryKey, (old) =>
      old
        ? { ...old, activeCareer: newActive, enrolledCareers: newEnrolled }
        : old
    );

    progressService
      .bulkSave(user!.id!, {
        activeCareer:    newActive,
        enrolledCareers: newEnrolled,
        p:               rawData.p,
      })
      .catch(() => queryClient.invalidateQueries({ queryKey }));
  };

  return {
    data,
    isLoading,
    isError,
    updateSubjectStatus,
    switchCareer,
    removeCareer,
  };
};
