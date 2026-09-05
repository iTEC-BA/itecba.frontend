import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProgressTable } from "../molecules/ProgressTable";
import { GradeModal } from "../molecules/GradeModal";
import { Button } from "@components/ui/Button";
import { Icons } from "@components/ui/icons/Icons";
import type { CareerProgress, Subject, UpdateSubjectArgs } from "../../types/progress";
import { CAREER_NAMES } from "../../data/careers.data";

interface Props {
  data: CareerProgress;
  onUpdateStatus: (args: UpdateSubjectArgs) => void;
  onSwitchCareer: (careerId: string) => void;
  onRemoveCareer: (careerId: string) => void; // Mantenemos la firma por compatibilidad, aunque no se use acá
}

// Configuración adaptada a los parámetros URL solicitados
const FILTER_TABS = [
  { id: 'promocionado', title: 'Promocionado', desc: 'Materias promocionadas.', keys: ['aprobada', 'promocionada'], color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', hex: '#34d399' },
  { id: 'regularizadas', title: 'Regularizadas', desc: 'Materias regularizadas.', keys: ['habilitada_rendir', 'regular_bloqueada'], color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', hex: '#fb923c' },
  { id: 'cursando', title: 'Cursando', desc: 'Estás cursando la materia actualmente.', keys: ['cursando'], color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', hex: '#e879f9' },
  { id: 'sincursar', title: 'Sin Cursar', desc: 'Aquellas habilitadas que tengo para cursar porque tengo materias promocionadas y regularizadas.', keys: ['habilitada_cursar'], color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', hex: '#ffffff' },
  { id: 'para_cursar', title: 'Para Cursar', desc: 'Las que están para cursar pero faltan correlativas.', keys: ['bloqueada'], color: 'text-itec-gray', bg: 'bg-white/5', border: 'border-white/10', hex: '#475569' },
];

const DashboardContent: React.FC<Props> = ({ data, onUpdateStatus, onSwitchCareer }) => {
  const [modal, setModal] = useState<any>({ isOpen: false });
  const { subjects } = data;

  // Lógica de URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status")?.trim().toLowerCase() || "cursando";
  
  // Validamos que el parámetro de la URL exista en nuestras tabs, si no, fallback a "cursando"
  const activeTab = FILTER_TABS.find(t => t.id === statusParam) ? statusParam : "cursando";

  const handleActionClick = (subject: Subject, action: string) => {
    if (["aprobada", "regular", "promocionada"].includes(action)) {
      setModal({ isOpen: true, subject, targetStatus: action });
      return;
    }
    onUpdateStatus({ id: subject.id, status: action });
  };

  const handleTabClick = (tabId: string) => {
    setSearchParams({ status: tabId }, { replace: true });
  };

  const activeTabObj = FILTER_TABS.find(t => t.id === activeTab)!;
  const filteredSubjects = subjects.filter(s => activeTabObj.keys.includes(s.status));

  // Lógica para el gráfico de pastel (Donut Chart)
  const total = subjects.length || 1;
  let currentPercentage = 0;
  const gradientStops = FILTER_TABS.map(tab => {
    const count = subjects.filter(s => tab.keys.includes(s.status)).length;
    const percentage = (count / total) * 100;
    const stop = `${tab.hex} ${currentPercentage}% ${currentPercentage + percentage}%`;
    currentPercentage += percentage;
    return stop;
  }).join(", ");

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* HEADER: Sin agregar/quitar carreras. Nombres formateados. */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-itec-text tracking-tight mb-2">Progreso Académico</h1>
          <p className="text-itec-gray text-sm">Gestioná tu avance en {data.careerName}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {data.enrolledCareers.map((c) => (
            <Button 
              key={c} 
              onClick={() => onSwitchCareer(c)} 
              variant="primary" 
              hierarchy={c === data.activeCareerId ? "solid" : "outline"} 
              text={CAREER_NAMES[c] || c} 
            />
          ))}
        </div>
      </div>

      {/* PANEL DE INSTRUCCIONES Y GRÁFICO */}
      {subjects.length > 0 && (
        <div className="flex relative flex-col md:flex-row items-center gap-6 bg-itec-box border border-itec-border rounded-2xl p-6">
          <div className="flex-1 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Icons type="info" className="size-5 text-itec-blue-skye" />
              ¿Cómo funciona esta sección?
            </h2>
            <p className="text-sm text-itec-text/80 leading-relaxed">
              Llevá el control de tu carrera de forma visual. Seleccioná cualquiera de las <strong>5 tarjetas</strong> de abajo para filtrar las materias según su estado.
            </p>
            <ul className="text-sm text-itec-text/80 leading-relaxed list-disc list-inside space-y-1 ml-1">
              <li>Cambiá el estado de una materia usando el menú <strong>"Mi Seguimiento"</strong> en la tabla.</li>
              <li>Al marcar una materia como <span className="text-emerald-400 font-bold">Promocionada</span> o <span className="text-orange-400 font-bold">Regularizada</span>, el sistema automáticamente destrabará las materias correlativas.</li>
            </ul>
          </div>
          
          {/* GRÁFICO PASTEL (DONUT FLAT) */}
          <div className="relative shrink-0 flex items-center justify-center flex-col gap-3 p-4 bg-black/20 rounded-2xl border border-white/5 w-full md:w-auto">
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${gradientStops})` }}>
              <div className="w-20 h-20 bg-itec-box rounded-full flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white leading-none">{data.metrics.porcentajeAvance}%</span>
                <span className="text-[9px] text-itec-gray uppercase tracking-widest mt-1">Avance</span>
              </div>
            </div>
          </div>

          <img
              src="/mascot/TEC-Euforico.webp"
              alt="TEC eufórico"
              className="absolute -bottom-0 -right-0 size-30 md:size-25 z-2 object-contain"
            />
        </div>
      )}

      {subjects.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 border border-dashed border-itec-border bg-itec-box rounded-2xl">
           <span className="text-4xl mb-4">📋</span>
           <p className="text-itec-text font-semibold text-lg">Plan no disponible aún</p>
         </div>
      ) : (
        <>
          {/* TABS INTERACTIVOS (BENTO STYLE) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {FILTER_TABS.map(tab => {
              const count = subjects.filter(s => tab.keys.includes(s.status)).length;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)} 
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${isActive ? `${tab.bg} ${tab.border} scale-[1.02] shadow-sm` : 'bg-itec-box border-itec-border opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                >
                  <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${tab.color}`}>{count}</span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-itec-text mt-2">{tab.title}</span>
                </button>
              )
            })}
          </div>

          {/* DESCRIPCIÓN DEL ESTADO ACTIVO */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${activeTabObj.bg} ${activeTabObj.border}`}>
            <Icons type="info" className={`size-5 mt-0.5 shrink-0 ${activeTabObj.color}`} />
            <p className="text-sm text-itec-text/90 leading-relaxed">
              <strong className="font-bold mr-2 text-white">{activeTabObj.title}:</strong> 
              {activeTabObj.desc}
            </p>
          </div>

          {/* TABLA FILTRADA */}
          <ProgressTable subjects={filteredSubjects} allSubjects={subjects} onActionClick={handleActionClick} />
        </>
      )}

      {modal.isOpen && (
        <GradeModal subject={modal.subject} targetStatus={modal.targetStatus} onClose={() => setModal({ isOpen: false })} onConfirm={(id, st, gr, yr) => { onUpdateStatus({ id, status: st, grade: gr, year: yr }); setModal({ isOpen: false }); }} />
      )}
    </div>
  );
};

export const ProgressDashboard: React.FC<Props> = (props) => <DashboardContent key={props.data.activeCareerId} {...props} />;
