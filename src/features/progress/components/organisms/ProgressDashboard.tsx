import React, { useState, useMemo } from 'react';
import { ProgressTable } from '../molecules/ProgressTable';
import { GradeModal } from '../molecules/GradeModal';
import { CAREER_NAMES } from '../../hooks/useProgress';
import type { CareerProgress } from '../../types/progress';
import type { ProgressMetrics, CalculatedSubject } from '../../hooks/useProgress';

interface Props {
  data: CareerProgress & { activeCareerId: string, enrolledCareers: string[], metrics: ProgressMetrics; subjects: CalculatedSubject[] };
  onUpdateStatus: (args: { id: string, newStatus: string, grade?: number, year?: number }) => void;
  onSwitchCareer: (careerId: string) => void;
}

export const ProgressDashboard: React.FC<Props> = ({ data, onUpdateStatus, onSwitchCareer }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean, subject: CalculatedSubject | null, targetStatus: 'aprobada' | 'regular' | null }>({
    isOpen: false, subject: null, targetStatus: null
  });

  const levels = useMemo(() => Array.from(new Set(data.subjects.map(s => s.level))).sort((a, b) => a - b), [data.subjects]);

  const handleActionClick = (subject: CalculatedSubject, action: 'aprobada' | 'regular' | 'disponible') => {
    if (action === 'disponible') {
      onUpdateStatus({ id: subject.id, newStatus: action });
    } else {
      setModalState({ isOpen: true, subject, targetStatus: action });
    }
  };

  const handleModalConfirm = (id: string, status: string, grade?: number, year?: number) => {
    onUpdateStatus({ id, newStatus: status, grade, year });
    setModalState({ isOpen: false, subject: null, targetStatus: null });
  };

  // Carreras que el usuario aún NO está cursando
  const availableCareersToAdd = Object.keys(CAREER_NAMES).filter(c => !data.enrolledCareers.includes(c));

  return (
    <div className="flex flex-col gap-8">
      
      {/* NAVEGACIÓN MULTI-CARRERA */}
      <div className="flex flex-wrap items-center gap-2 border-b border-itec-gray pb-4">
        {data.enrolledCareers.map(careerId => (
          <button 
            key={careerId}
            onClick={() => onSwitchCareer(careerId)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${data.activeCareerId === careerId ? 'bg-itec-blue text-white shadow-lg shadow-itec-blue/20' : 'text-gray-400 hover:text-white hover:bg-itec-surface border border-transparent hover:border-itec-gray'}`}
          >
            {CAREER_NAMES[careerId]}
          </button>
        ))}
        
        {availableCareersToAdd.length > 0 && (
          <select 
            onChange={(e) => { if(e.target.value) onSwitchCareer(e.target.value) }}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-transparent text-fuchsia-400 border border-fuchsia-500/30 hover:bg-fuchsia-500/10 transition-all outline-none cursor-pointer"
            value=""
          >
            <option value="" disabled>+ Añadir Carrera</option>
            {availableCareersToAdd.map(c => (
              <option key={c} value={c}>{CAREER_NAMES[c]}</option>
            ))}
          </select>
        )}
      </div>

      {/* HEADER DE MÉTRICAS */}
      <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Progreso Académico</h1>
          <p className="text-itec-blue-skye font-medium flex items-center gap-2">🎓 {data.careerName}</p>
        </div>
        <div className="flex items-center gap-6 bg-itec-bg border border-itec-gray rounded-xl p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Promedio General</span>
            <span className="text-2xl font-black text-green-400">{data.averageGrade}</span>
          </div>
          <div className="w-px h-10 bg-itec-gray"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Avance del Plan</span>
            <span className="text-2xl font-black text-white">{data.totalProgress}%</span>
          </div>
        </div>
      </div>

      {/* BARRA DE ESTADO */}
      <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3 text-sm font-medium">
          <span className="text-white">Materias</span>
          <span className="text-gray-400">{data.metrics.total - data.metrics.aprobadas} pendientes para graduarse</span>
        </div>
        <div className="w-full bg-itec-bg rounded-full h-2.5 flex overflow-hidden border border-itec-gray">
          <div className="bg-green-500 transition-all duration-700" style={{ width: `${data.metrics.porcentajeAprobadas}%` }} title="Aprobadas" />
          <div className="bg-fuchsia-500 transition-all duration-700" style={{ width: `${data.metrics.porcentajeRegulares}%` }} title="Regulares" />
        </div>
      </div>

      {/* TABLAS */}
      <div className="space-y-10">
        {levels.map((level) => (
          <ProgressTable 
            key={`level-${level}`} 
            level={level} 
            subjects={data.subjects.filter(s => s.level === level)} 
            allSubjects={data.subjects} 
            onActionClick={handleActionClick} 
          />
        ))}
      </div>

      {/* MODAL */}
      {modalState.isOpen && modalState.subject && modalState.targetStatus && (
        <GradeModal 
          subject={modalState.subject} 
          targetStatus={modalState.targetStatus} 
          onClose={() => setModalState({ isOpen: false, subject: null, targetStatus: null })}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};