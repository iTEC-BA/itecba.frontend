import React, { useState, useEffect } from 'react';
import { ProgressTable } from '../molecules/ProgressTable';
import { GradeModal } from '../molecules/GradeModal';
import { MetricCard, StressMonitor } from '../atoms/Widgets';
import { CAREER_NAMES } from '../../hooks/useProgress';
import type { CareerProgress, Subject } from '../../types/progress';

interface Props {
  data: CareerProgress;
  onUpdateStatus: (args: { id: string, status: string, grade?: number, year?: number }) => void;
  onSwitchCareer: (careerId: string) => void;
  onRemoveCareer: (careerId: string) => void;
}

export const ProgressDashboard: React.FC<Props> = ({ data, onUpdateStatus, onSwitchCareer, onRemoveCareer }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean, subject: Subject | null, targetStatus: string | null }>({
    isOpen: false, subject: null, targetStatus: null
  });

  const { metrics, subjects } = data;
  const levels = Array.from(new Set(subjects.map(s => s.level))).sort((a, b) => a - b);
  const availableCareersToAdd = Object.keys(CAREER_NAMES).filter(c => !data.enrolledCareers.includes(c));

  // Estado para controlar la pestaña activa (Fichero de Año)
  const [activeLevel, setActiveLevel] = useState<number>(levels[0] || 1);

  // Si cambia de carrera, reseteamos a la pestaña 1
  useEffect(() => {
    if (levels.length > 0 && !levels.includes(activeLevel)) {
      setActiveLevel(levels[0]);
    }
  }, [data.activeCareerId, levels]);

  const handleActionClick = (subject: Subject, action: string) => {
    if (action === 'aprobada' || action.includes('regular')) {
      setModalState({ isOpen: true, subject, targetStatus: action });
    } else {
      onUpdateStatus({ id: subject.id, status: action });
    }
  };

  const handleModalConfirm = (id: string, status: string, grade?: number, year?: number) => {
    onUpdateStatus({ id, status, grade, year });
    setModalState({ isOpen: false, subject: null, targetStatus: null });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Navegación y Gestión de Carreras */}
      <div className="flex flex-wrap items-center gap-3 border-b border-itec-gray pb-4">
        {data.enrolledCareers.map(careerId => {
          const isActive = data.activeCareerId === careerId;
          return (
            <div key={careerId} className={`flex items-center rounded-lg border transition-all ${isActive ? 'bg-itec-primary border-itec-primary text-white shadow-lg shadow-itec-primary/20' : 'bg-transparent border-itec-gray text-gray-400 hover:border-gray-500 hover:text-white'}`}>
              <button onClick={() => onSwitchCareer(careerId)} className="px-4 py-2 text-sm font-semibold outline-none">
                {CAREER_NAMES[careerId]}
              </button>
              {data.enrolledCareers.length > 1 && (
                <button onClick={() => onRemoveCareer(careerId)} className="px-3 py-2 text-xs opacity-50 hover:opacity-100 hover:text-itec-accent border-l border-black/20 outline-none" title="Eliminar Carrera">
                  ✕
                </button>
              )}
            </div>
          );
        })}
        {availableCareersToAdd.length > 0 && (
          <select 
            onChange={(e) => { if(e.target.value) onSwitchCareer(e.target.value) }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-transparent text-gray-400 border border-itec-gray border-dashed hover:border-itecBlue hover:text-itecBlue transition-all outline-none cursor-pointer"
            value=""
          >
            <option value="" disabled>+ Cursar otra Carrera</option>
            {availableCareersToAdd.map(c => <option key={c} value={c} className="bg-itec-bg">{CAREER_NAMES[c]}</option>)}
          </select>
        )}
      </div>

      {/* Header y Alertas */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-itec-text tracking-tight mb-2">Tu Seguimiento</h1>
          <p className="text-itecBlue font-medium flex items-center gap-2">🎓 {data.careerName}</p>
        </div>

        {metrics.vencimientosProximos.length > 0 && (
          <div className="bg-itec-accent/10 border border-itec-accent/30 rounded-xl p-4 flex items-start gap-4 shadow-sm">
            <span className="text-2xl mt-1">⚠️</span>
            <div>
              <h4 className="text-itec-accent font-bold">Atención a tus regularidades</h4>
              <p className="text-sm text-gray-300 mt-1">
                Tenés materias próximas a vencer (3+ años): <span className="font-semibold text-white">{metrics.vencimientosProximos.map(m => m.name).join(', ')}</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Avance Plan" value={`${metrics.porcentajeAvance}%`} subtitle={`${metrics.aprobadas} de ${metrics.total} finales dados`} icon="📈" />
        <MetricCard title="Promedio Gral" value={metrics.promedio} subtitle="Sin aplazos" icon="🎓" highlight="text-itecBlue" />
        <MetricCard title="Cursando Ahora" value={metrics.cursando.toString()} subtitle="Materias anotadas" icon="📚" highlight="text-fuchsia-400" />
        <StressMonitor horas={metrics.horasSemanales} nivel={metrics.nivelEstres} />
      </div>

      {/* CONTENEDOR DE FICHAS / TABS PARA LOS AÑOS */}
      <div className="flex flex-col gap-0 mt-4">
        {/* Pestañas de Navegación */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 border-b-2 border-itec-gray/50">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-widest rounded-t-xl transition-all outline-none whitespace-nowrap
                ${activeLevel === lvl 
                  ? 'bg-itec-gray/20 text-white border-b-2 border-itecBlue' 
                  : 'bg-transparent text-gray-500 hover:bg-itec-gray/10 hover:text-gray-300 border-b-2 border-transparent'
                }
              `}
            >
              Año {lvl}
            </button>
          ))}
        </div>

        {/* Contenido de la Tabla (Solo se renderiza el Año Activo) */}
        <div className="pt-4">
          <ProgressTable 
            level={activeLevel} 
            subjects={subjects.filter(s => s.level === activeLevel)} 
            allSubjects={subjects} 
            onActionClick={handleActionClick} 
          />
        </div>
      </div>

      {modalState.isOpen && modalState.subject && modalState.targetStatus && (
        <GradeModal 
          subject={modalState.subject as any} 
          targetStatus={modalState.targetStatus as any} 
          onClose={() => setModalState({ isOpen: false, subject: null, targetStatus: null })}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};