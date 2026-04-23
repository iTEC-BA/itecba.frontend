import React from 'react';
import { SubjectTableRow } from './SubjectTableRow';
import type { Subject } from '../../types/progress';

interface Props {
  level: number;
  subjects: Subject[];
  allSubjects: Subject[];
  onActionClick: (subject: Subject, action: string) => void;
}

export const ProgressTable: React.FC<Props> = ({ subjects, allSubjects, onActionClick }) => {
  if (subjects.length === 0) return null;

  return (
    <div className="bg-itec-surface border border-itec-gray/50 rounded-b-xl rounded-tr-xl overflow-hidden shadow-lg animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-itec-bg/80 border-b border-itec-gray text-xs uppercase tracking-widest text-gray-400">
              <th className="px-5 py-4 font-bold w-16 text-center">Cód</th>
              <th className="px-5 py-4 font-bold w-64">Materia</th>
              <th className="px-5 py-4 font-bold w-48">Correlativas Req.</th>
              <th className="px-5 py-4 font-bold text-center w-40">Estado de Materia</th>
              <th className="px-5 py-4 font-bold text-right pr-6 w-64">Mi Seguimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-itec-gray/30">
            {subjects.map((sub) => (
              <SubjectTableRow key={sub.id} sub={sub} allSubjects={allSubjects} onActionClick={onActionClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};