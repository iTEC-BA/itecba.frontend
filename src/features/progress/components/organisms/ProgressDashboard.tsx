import React, { useState, useEffect } from "react";
import { ProgressTable } from "../molecules/ProgressTable";
import { GradeModal } from "../molecules/GradeModal";
import { Button } from "@components/ui/Button";
import { CustomSelect } from "@components/ui/CustomSelect";
import { Icons } from "@components/ui/icons/Icons";
import { subjectsService } from "@/services/subjectsService";
import type { CareerProgress, Subject, UpdateSubjectArgs } from "../../types/progress";

interface Props {
  data: CareerProgress;
  onUpdateStatus: (args: UpdateSubjectArgs) => void;
  onSwitchCareer: (careerId: string) => void;
  onRemoveCareer: (careerId: string) => void;
}

const FILTER_TABS = [
  { id: 'sin_cursar', title: 'Sin Cursar', desc: 'Aún te falta cursar o te faltan materias correlativas promocionadas para poder cursar.', keys: ['bloqueada'], color: 'text-itec-gray', bg: 'bg-white/5', border: 'border-white/10' },
  { id: 'cursar', title: 'Para Cursar', desc: 'Materias que ya podés iniciar a cursar.', keys: ['habilitada_cursar'], color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
  { id: 'cursando', title: 'Cursando', desc: 'Estás cursando la materia actualmente.', keys: ['cursando'], color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
  { id: 'regularizada', title: 'Regularizada', desc: 'Menos de 8 en los 2 parciales y tenés que rendir mesa de finales.', keys: ['habilitada_rendir', 'regular_bloqueada'], color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'promocionada', title: 'Promocionado', desc: 'Sacaste 8 o más en los 2 parciales y no rendís final, o ya rendiste el final con más de 6.', keys: ['aprobada', 'promocionada'], color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const DashboardContent: React.FC<Props> = ({ data, onUpdateStatus, onSwitchCareer, onRemoveCareer }) => {
  const [modal, setModal] = useState<any>({ isOpen: false });
  const [dbCareers, setDbCareers] = useState<{value: string, label: string}[]>([]);
  const [activeTab, setActiveTab] = useState('cursando');
  const { subjects } = data;

  useEffect(() => {
    subjectsService.getCarreras().then(res => {
      setDbCareers(res.filter(c => !data.enrolledCareers.includes(c)).map(c => ({ value: c, label: c })));
    }).catch(() => {});
  }, [data.enrolledCareers]);

  const handleActionClick = (subject: Subject, action: string) => {
    if (["aprobada", "regular", "promocionada"].includes(action)) {
      setModal({ isOpen: true, subject, targetStatus: action });
      return;
    }
    onUpdateStatus({ id: subject.id, status: action });
  };

  const activeTabObj = FILTER_TABS.find(t => t.id === activeTab)!;
  const filteredSubjects = subjects.filter(s => activeTabObj.keys.includes(s.status));

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-itec-text tracking-tight mb-2">Progreso Académico</h1>
          <p className="text-itec-gray text-sm">Gestioná tu avance en {data.careerName}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {data.enrolledCareers.map((c) => (
            <Button key={c} onClick={() => onSwitchCareer(c)} variant="primary" hierarchy={c === data.activeCareerId ? "solid" : "outline"} text={c.toUpperCase()} />
          ))}
          {dbCareers.length > 0 && (
            <div className="w-48">
              <CustomSelect value="" options={dbCareers} onChange={(v) => onSwitchCareer(v)} placeholder="+ Agregar carrera" />
            </div>
          )}
          {data.enrolledCareers.length > 1 && (
            <Button onClick={() => onRemoveCareer(data.activeCareerId)} variant="danger" hierarchy="ghost" text="Quitar" icon={<Icons type="trash" />} />
          )}
        </div>
      </div>

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
                  onClick={() => setActiveTab(tab.id)} 
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
            <Icons type="info" className={`size-5 mt-0.5 ${activeTabObj.color}`} />
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
