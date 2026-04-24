import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@context/AuthContext';
import { CAREERS_DATA } from '@data/carreras';
import { calculateSubjectStatus, calculateStressLevel } from '../utils/academicLogic';
import type { ProgressMetrics, Subject, CareerProgress } from '../types/progress';

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
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.enrolledCareers || parsed.enrolledCareers.length === 0) parsed.enrolledCareers = [parsed.activeCareer || parsed.careerId || 'sistemas'];
        if (!parsed.activeCareer) parsed.activeCareer = parsed.enrolledCareers[0];
        if (!parsed.progress) {
          parsed.progress = {
            [parsed.activeCareer]: { passedIds: parsed.passedIds || [], regularIds: parsed.regularIds || [], cursandoIds: [], grades: parsed.grades || {}, years: parsed.years || {} }
          }
        }
        return parsed;
      } catch (e) { console.error("Error parseando data", e); }
    }
    return {
      activeCareer: 'sistemas',
      enrolledCareers: ['sistemas'],
      progress: { 'sistemas': { passedIds: [], regularIds: [], cursandoIds: [], grades: {}, years: {} } }
    };
  };

  const query = useQuery<CareerProgress>({
    queryKey: ['progress', user?.uid],
    queryFn: () => {
      const userData = loadUserData();
      const activeCareerId = userData.activeCareer;
      const careerDef = CAREERS_DATA[activeCareerId];
      
      if (!careerDef) throw new Error("Carrera no encontrada");

      const pData = userData.progress[activeCareerId] || {};
      const passedIds = pData.passedIds || [];
      const regularIds = pData.regularIds || [];
      const cursandoIds = pData.cursandoIds || [];
      const grades = pData.grades || {};
      const years = pData.years || {};

      let totalGrade = 0, gradedCount = 0, horasCursada = 0;
      const vencimientos: Subject[] = [];

      const subjects: Subject[] = careerDef.map((sub: any) => {
        const status = calculateSubjectStatus(sub, passedIds, regularIds, cursandoIds);
        const yearReg = years[sub.id];

        if (status.includes('regular') && yearReg && (new Date().getFullYear() - yearReg >= 3)) {
          vencimientos.push({ ...sub, status, yearRegularized: yearReg } as Subject);
        }

        const weeklyHours = sub.weeklyHours || (sub.level > 2 ? 6 : 4);
        if (status === 'cursando') horasCursada += weeklyHours;

        if (status === 'aprobada' && grades[sub.id]) {
          totalGrade += Number(grades[sub.id]);
          gradedCount++;
        }

        return { ...sub, status, grade: grades[sub.id], yearRegularized: yearReg, metrics: { weeklyHours } } as Subject;
      });

      const metrics: ProgressMetrics = {
        total: careerDef.length,
        aprobadas: passedIds.length,
        regulares: regularIds.length,
        cursando: cursandoIds.length,
        porcentajeAvance: careerDef.length > 0 ? Math.round((passedIds.length / careerDef.length) * 100) : 0,
        promedio: gradedCount > 0 ? (totalGrade / gradedCount).toFixed(2) : '-',
        horasSemanales: horasCursada,
        nivelEstres: calculateStressLevel(horasCursada),
        vencimientosProximos: vencimientos
      };

      return { activeCareerId, enrolledCareers: userData.enrolledCareers, careerName: CAREER_NAMES[activeCareerId] || 'Carrera Desconocida', metrics, subjects };
    },
    enabled: !!user,
  });

  const updateSubjectStatus = useMutation({
    mutationFn: async ({ id, status, grade, year }: { id: string, status: string, grade?: number, year?: number }) => {
      const uData = loadUserData();
      const p = uData.progress[uData.activeCareer];
      
      p.passedIds = (p.passedIds || []).filter((x: string) => x !== id);
      p.regularIds = (p.regularIds || []).filter((x: string) => x !== id);
      p.cursandoIds = (p.cursandoIds || []).filter((x: string) => x !== id);
      p.grades = p.grades || {};
      p.years = p.years || {};

      if (status === 'aprobada') p.passedIds.push(id);
      if (status === 'regular' || status === 'habilitada_rendir' || status === 'regular_bloqueada') p.regularIds.push(id);
      if (status === 'cursando') p.cursandoIds.push(id);

      if (status === 'aprobada') {
        if (grade !== undefined) p.grades[id] = grade;
        if (year !== undefined) p.years[id] = year;
      } else if (status.includes('regular')) {
        delete p.grades[id];
        if (year !== undefined) p.years[id] = year;
      } else {
        delete p.grades[id];
        delete p.years[id];
      }

      localStorage.setItem(storageKey, JSON.stringify(uData));
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress', user?.uid] })
  });

  const switchCareer = useMutation({
    mutationFn: async (careerId: string) => {
      const uData = loadUserData();
      if (!uData.enrolledCareers.includes(careerId)) uData.enrolledCareers.push(careerId);
      if (!uData.progress[careerId]) uData.progress[careerId] = { passedIds: [], regularIds: [], cursandoIds: [], grades: {}, years: {} };
      uData.activeCareer = careerId;
      localStorage.setItem(storageKey, JSON.stringify(uData));
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress', user?.uid] })
  });

  // NUEVA MUTACIÓN: Eliminar Carrera
  const removeCareer = useMutation({
    mutationFn: async (careerId: string) => {
      const uData = loadUserData();
      uData.enrolledCareers = uData.enrolledCareers.filter((id: string) => id !== careerId);
      
      if (uData.enrolledCareers.length === 0) {
        // Siempre debe haber al menos una carrera, por defecto sistemas
        uData.enrolledCareers = ['sistemas'];
        uData.activeCareer = 'sistemas';
        if (!uData.progress['sistemas']) uData.progress['sistemas'] = { passedIds: [], regularIds: [], cursandoIds: [], grades: {}, years: {} };
      } else if (uData.activeCareer === careerId) {
        // Si eliminamos la carrera activa, cambiamos a la primera disponible
        uData.activeCareer = uData.enrolledCareers[0];
      }

      localStorage.setItem(storageKey, JSON.stringify(uData));
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress', user?.uid] })
  });

  return { ...query, updateSubjectStatus: updateSubjectStatus.mutate, switchCareer: switchCareer.mutate, removeCareer: removeCareer.mutate };
};