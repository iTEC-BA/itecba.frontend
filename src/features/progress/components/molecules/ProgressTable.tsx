import React from 'react';
import { SubjectTableRow } from './SubjectTableRow';
import type { CalculatedSubject } from '../../hooks/useProgress';

interface Props {
  level: number;
  subjects: CalculatedSubject[];
  allSubjects: CalculatedSubject[];
  onActionClick: (subject: CalculatedSubject, action: 'aprobada' | 'regular' | 'disponible') => void;
}

export const ProgressTable: React.FC<Props> = ({ level, subjects, allSubjects, onActionClick }) => {
  if (subjects.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white bg-itec-surface border border-itec-gray px-4 py-1.5 rounded-lg">Nivel {level}</h2>
        <div className="flex-1 h-px bg-itec-gray"></div>
      </div>
      <div className="bg-itec-surface border border-itec-gray rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-itec-bg/50 border-b border-itec-gray text-xs uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3 font-semibold w-16 text-center">Cód</th>
                <th className="px-4 py-3 font-semibold w-64">Materia</th>
                <th className="px-4 py-3 font-semibold w-48">Requisitos</th>
                <th className="px-4 py-3 font-semibold text-center w-32">Estado</th>
                <th className="px-4 py-3 font-semibold text-right pr-6 w-64">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-gray">
              {subjects.map((sub) => (
                <SubjectTableRow key={sub.id} sub={sub} allSubjects={allSubjects} onActionClick={onActionClick} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};