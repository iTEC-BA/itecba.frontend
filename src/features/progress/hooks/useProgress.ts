import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { CAREERS_DATA, type SubjectDef } from '@/data/carreras';

export type CalculatedSubject = SubjectDef & {
  status: 'aprobada' | 'regular' | 'disponible' | 'bloqueada';
  grade?: number;
  year?: number;
};

export interface ProgressMetrics {
  total: number;
  aprobadas: number;
  regulares: number;
  porcentajeAprobadas: number;
  porcentajeRegulares: number;
}

// Mapa de nombres para la UI
export const CAREER_NAMES: Record<string, string> = {
  sistemas: 'Ingeniería en Sistemas de Información',
  mecanica: 'Ingeniería Mecánica',
  electronica: 'Ingeniería Electrónica',
  electrica: 'Ingeniería Eléctrica',
  civil: 'Ingeniería Civil',
  industrial: 'Ingeniería Industrial',
  quimica: 'Ingeniería Química',
  naval: 'Ingeniería Naval',
  textil: 'Ingeniería Textil'
};

export const useProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const storageKey = `itec_progress_${user?.uid}`;

  const loadUserData = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migración automática si viene de la versión anterior (1 sola carrera)
      if (parsed.careerId && !parsed.enrolledCareers) {
        return {
          activeCareer: parsed.careerId,
          enrolledCareers: [parsed.careerId],
          progress: {
            [parsed.careerId]: {
              passedIds: parsed.passedIds || [],
              regularIds: parsed.regularIds || [],
              grades: parsed.grades || {},
              years: parsed.years || {}
            }
          }
        };
      }
      return parsed;
    }
    // Estado inicial por defecto
    return {
      activeCareer: 'sistemas',
      enrolledCareers: ['sistemas'],
      progress: {
        'sistemas': { passedIds: [], regularIds: [], grades: {}, years: {} }
      }
    };
  };

  const query = useQuery({
    queryKey: ['progress', user?.uid],
    queryFn: () => {
      const userData = loadUserData();
      const activeCareerId = userData.activeCareer;
      const careerDef = CAREERS_DATA[activeCareerId];
      
      if (!careerDef) throw new Error("Carrera no encontrada");

      const progressData = userData.progress[activeCareerId] || { passedIds: [], regularIds: [], grades: {}, years: {} };

      let totalGrade = 0;
      let gradedSubjectsCount = 0;

      const calculatedSubjects: CalculatedSubject[] = careerDef.map((subject) => {
        let status: CalculatedSubject['status'] = 'bloqueada';

        if (progressData.passedIds.includes(subject.id)) {
          status = 'aprobada';
          if (progressData.grades[subject.id]) {
            totalGrade += Number(progressData.grades[subject.id]);
            gradedSubjectsCount++;
          }
        } else if (progressData.regularIds.includes(subject.id)) {
          status = 'regular';
        } else {
          // Lógica de correlativas
          const hasCursadas = subject.reqCursada.every((reqId: string) => 
            progressData.passedIds.includes(reqId) || progressData.regularIds.includes(reqId)
          );
          const hasAprobadas = subject.reqAprobada.every((reqId: string) => 
            progressData.passedIds.includes(reqId)
          );

          if (hasCursadas && hasAprobadas) status = 'disponible';
        }

        return {
          ...subject,
          status,
          grade: progressData.grades[subject.id],
          year: progressData.years[subject.id]
        };
      });

      const metrics: ProgressMetrics = {
        total: careerDef.length,
        aprobadas: progressData.passedIds.length,
        regulares: progressData.regularIds.length,
        porcentajeAprobadas: (progressData.passedIds.length / careerDef.length) * 100,
        porcentajeRegulares: (progressData.regularIds.length / careerDef.length) * 100,
      };

      const averageGrade = gradedSubjectsCount > 0 ? (totalGrade / gradedSubjectsCount).toFixed(2) : '0.00';

      return {
        activeCareerId,
        enrolledCareers: userData.enrolledCareers,
        careerName: CAREER_NAMES[activeCareerId] || 'Carrera Desconocida',
        averageGrade,
        totalProgress: Math.round(metrics.porcentajeAprobadas),
        metrics,
        subjects: calculatedSubjects
      };
    },
    enabled: !!user,
  });

  // Mutación para cambiar el estado de una materia
  const updateSubjectStatus = useMutation({
    mutationFn: async ({ id, newStatus, grade, year }: { id: string, newStatus: string, grade?: number, year?: number }) => {
      const userData = loadUserData();
      const p = userData.progress[userData.activeCareer];

      p.passedIds = p.passedIds.filter((item: string) => item !== id);
      p.regularIds = p.regularIds.filter((item: string) => item !== id);

      if (newStatus === 'aprobada') p.passedIds.push(id);
      if (newStatus === 'regular') p.regularIds.push(id);

      if (newStatus === 'disponible') {
        delete p.grades[id];
        delete p.years[id];
      } else {
        if (grade !== undefined) p.grades[id] = grade;
        else delete p.grades[id]; // Si es regular, nos aseguramos de borrar la nota
        if (year !== undefined) p.years[id] = year;
      }

      localStorage.setItem(storageKey, JSON.stringify(userData));
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress', user?.uid] })
  });

  // Mutación para agregar/cambiar de carrera
  const switchCareer = useMutation({
    mutationFn: async (careerId: string) => {
      const userData = loadUserData();
      if (!userData.enrolledCareers.includes(careerId)) {
        userData.enrolledCareers.push(careerId);
        userData.progress[careerId] = { passedIds: [], regularIds: [], grades: {}, years: {} };
      }
      userData.activeCareer = careerId;
      localStorage.setItem(storageKey, JSON.stringify(userData));
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress', user?.uid] })
  });

  return { ...query, updateSubjectStatus: updateSubjectStatus.mutate, switchCareer: switchCareer.mutate };
};