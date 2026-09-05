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
