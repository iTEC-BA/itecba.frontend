#!/bin/bash
echo "Aplicando rediseño interactivo y simplificado de Progreso..."

# 1. Actualizar ProgressDashboard para usar las 5 tarjetas como filtros principales
cat << 'EOF' > src/features/progress/components/organisms/ProgressDashboard.tsx
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
EOF

# 2. Actualizar ProgressTable para agrupar por años visualmente las materias filtradas
cat << 'EOF' > src/features/progress/components/molecules/ProgressTable.tsx
import React from 'react';
import { SubjectTableRow } from './SubjectTableRow';
import type { Subject } from '../../types/progress';

interface Props {
  subjects:      Subject[];
  allSubjects:   Subject[];
  onActionClick: (subject: Subject, action: string) => void;
}

export const ProgressTable: React.FC<Props> = ({ subjects, allSubjects, onActionClick }) => {
  if (subjects.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-itec-border rounded-2xl bg-itec-box">
        <p className="text-itec-muted text-sm">No hay materias en este estado actualmente.</p>
      </div>
    );
  }

  const levels = Array.from(new Set(subjects.map(s => s.level))).sort((a, b) => a - b);

  return (
    <div className="bg-itec-box border border-itec-border rounded-2xl overflow-hidden shadow-sm animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-black/20 border-b border-itec-border text-[10px] uppercase tracking-widest text-itec-muted">
              <th className="px-5 py-4 font-bold w-16 text-center">Cód</th>
              <th className="px-5 py-4 font-bold w-64">Materia</th>
              <th className="px-5 py-4 font-bold w-48">Correlativas Req.</th>
              <th className="px-5 py-4 font-bold text-center w-40">Estado</th>
              <th className="px-5 py-4 font-bold text-right pr-6 w-56">Mi Seguimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-itec-border">
            {levels.map(lvl => (
              <React.Fragment key={lvl}>
                <tr className="bg-white/[0.02] border-y border-white/10">
                  <td colSpan={5} className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-itec-gray bg-gradient-to-r from-transparent to-transparent">
                    {lvl === 0 ? 'Ingreso' : `Año ${lvl}`}
                  </td>
                </tr>
                {subjects.filter(s => s.level === lvl).map(sub => (
                  <SubjectTableRow key={sub.id} sub={sub} allSubjects={allSubjects} onActionClick={onActionClick} />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
EOF

# 3. Actualizar SubjectTableRow para simplificar las opciones a tus 5 conceptos
cat << 'EOF' > src/features/progress/components/molecules/SubjectTableRow.tsx
import React, { useMemo } from 'react';
import { CustomSelect } from '@components/ui/CustomSelect';
import { StatusBadge } from '../atoms/StatusBadge';
import type { Subject, SubjectStatus } from '../../types/progress';

interface Props {
  sub: Subject;
  allSubjects: Subject[];
  onActionClick: (subject: Subject, action: string) => void;
}

const STATUS_OPTIONS_BASE = [
  { value: 'habilitada_cursar', label: 'Sin Cursar' },
  { value: 'cursando',          label: 'Cursando' },
  { value: 'regular',           label: 'Regularizada' },
  { value: 'promocionada',      label: 'Promocionado' },
];

const BLOCKED_OPTIONS = [
  { value: 'bloqueada', label: 'Bloqueada (Faltan Req.)' },
];

const statusToDropdownValue = (status: SubjectStatus): string => {
  if (status === 'aprobada' || status === 'promocionada') return 'promocionada';
  if (status === 'habilitada_rendir' || status === 'regular_bloqueada') return 'regular';
  if (status === 'cursando') return 'cursando';
  if (status === 'bloqueada') return 'bloqueada';
  return 'habilitada_cursar';
};

export const SubjectTableRow: React.FC<Props> = ({ sub, allSubjects, onActionClick }) => {
  const isBloqueada = sub.status === 'bloqueada';

  const options = useMemo(() => {
    return isBloqueada ? BLOCKED_OPTIONS : STATUS_OPTIONS_BASE;
  }, [isBloqueada]);

  const currentValue = statusToDropdownValue(sub.status);

  return (
    <tr className={`hover:bg-white/[0.03] transition-colors group ${isBloqueada ? 'opacity-60' : ''}`}>
      <td className="px-5 py-4 text-center font-mono text-xs text-itec-muted">{sub.code || '—'}</td>
      <td className="px-5 py-4">
        <div className="font-semibold text-sm text-itec-text">{sub.name}</div>
        {sub.grade !== undefined && (
          <div className="text-xs text-emerald-400 font-mono mt-1 font-bold">
            Nota final: {sub.grade}
          </div>
        )}
      </td>
      <td className="px-5 py-4 text-xs text-itec-muted">
        <div className="flex flex-col gap-1">
          {sub.reqCursada?.length > 0 && (
            <div><span className="font-semibold">Cursada: </span>{sub.reqCursada.map((id) => allSubjects.find((s) => s.id === id)?.code ?? id).join(', ')}</div>
          )}
          {sub.reqAprobada?.length > 0 && (
            <div><span className="font-semibold">Final: </span>{sub.reqAprobada.map((id) => allSubjects.find((s) => s.id === id)?.code ?? id).join(', ')}</div>
          )}
          {!sub.reqCursada?.length && !sub.reqAprobada?.length && <span className="italic opacity-50">Ninguna</span>}
        </div>
      </td>
      <td className="px-5 py-4 text-center"><StatusBadge status={sub.status} /></td>
      <td className="px-5 py-4 text-right pr-6">
        <CustomSelect
          value={currentValue}
          options={options}
          onChange={(val) => { if (val !== currentValue) onActionClick(sub, val); }}
          disabled={isBloqueada}
          placeholder="Seleccionar..."
        />
      </td>
    </tr>
  );
};
EOF

# 4. Actualizar StatusBadge para unificar nomenclaturas y colores
cat << 'EOF' > src/features/progress/components/atoms/StatusBadge.tsx
import React from 'react';
import type { SubjectStatus } from '../../types/progress';

interface Props { status: SubjectStatus }

const cfg: Record<SubjectStatus, { label: string; cls: string }> = {
  aprobada:          { label: 'Promocionado',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  promocionada:      { label: 'Promocionado',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  habilitada_rendir: { label: 'Regularizada',     cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  regular_bloqueada: { label: 'Regularizada',     cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  cursando:          { label: 'Cursando',         cls: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' },
  habilitada_cursar: { label: 'Para Cursar',      cls: 'bg-white/10 text-itec-text border-white/20' },
  bloqueada:         { label: 'Sin Cursar',       cls: 'bg-transparent text-gray-500 border-dashed border-white/10' },
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const { label, cls } = cfg[status] ?? cfg.bloqueada;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold border ${cls}`}>
      {label}
    </span>
  );
};
EOF

echo "✅ Rediseño de progreso completado. Ahora los usuarios filtrarán mediante clicks en las 5 opciones unificadas."