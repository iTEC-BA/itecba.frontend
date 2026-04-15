import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/atoms/Icons'; 
import type { CalculatedSubject } from '../../hooks/useProgress';

interface Props {
  sub: CalculatedSubject;
  allSubjects: CalculatedSubject[];
  onActionClick: (subject: CalculatedSubject, action: 'aprobada' | 'regular' | 'disponible') => void;
}

export const SubjectTableRow: React.FC<Props> = ({ sub, allSubjects, onActionClick }) => {
  const getSubjectCode = (id: string) => allSubjects.find(s => s.id === id)?.code || id;
  const isLocked = sub.status === 'bloqueada';

  const statusStyles = {
    aprobada: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', label: 'Aprobada' },
    regular: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500', border: 'border-fuchsia-500/20', label: 'Regularizada' },
    disponible: { bg: 'bg-itec-blue/10', text: 'text-itec-blue-skye', border: 'border-itec-blue/20', label: 'Disponible' },
    bloqueada: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20', label: 'Bloqueada' },
  };

  const style = statusStyles[sub.status];

  return (
    <tr className={`transition-colors hover:bg-white/[0.02] ${isLocked ? 'bg-itec-bg/30 opacity-70' : ''}`}>
      <td className="px-4 py-4 text-xs font-mono font-bold text-gray-500 text-center">{sub.code}</td>
      <td className="px-4 py-4">
        <p className={`font-semibold text-sm ${isLocked ? 'text-gray-400' : 'text-white'}`}>{sub.name}</p>
      </td>
      <td className="px-4 py-4">
        {sub.reqCursada.length > 0 && (
          <div className="text-[11px] text-gray-400 mb-1">
            <span className="text-fuchsia-400 font-semibold mr-1">Regularizar:</span>
            {sub.reqCursada.map(getSubjectCode).join(' - ')}
          </div>
        )}
        {sub.reqAprobada.length > 0 && (
          <div className="text-[11px] text-gray-400">
            <span className="text-green-400 font-semibold mr-1">Aprobar:</span>
            {sub.reqAprobada.map(getSubjectCode).join(' - ')}
          </div>
        )}
        {sub.reqCursada.length === 0 && sub.reqAprobada.length === 0 && (
           <span className="text-gray-600 text-xs italic">Sin requisitos</span>
        )}
      </td>
      <td className="px-4 py-4 text-center">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
          {style.label} {sub.grade ? `(${sub.grade})` : ''}
        </span>
      </td>
      <td className="px-4 py-4 pr-6 text-right">
        {isLocked ? (
          <span className="text-gray-600 text-xs">🔒 Pendiente</span>
        ) : (
          <div className="flex items-center justify-end gap-2">
            {sub.status === 'disponible' && (
              <button onClick={() => onActionClick(sub, 'regular')} className="px-3 py-1.5 rounded-lg bg-itec-bg hover:bg-fuchsia-500/10 text-gray-400 hover:text-fuchsia-400 text-[11px] font-bold border border-itec-gray">Regularizar</button>
            )}
            {sub.status !== 'aprobada' && (
              <button onClick={() => onActionClick(sub, 'aprobada')} className="px-3 py-1.5 rounded-lg bg-itec-bg hover:bg-green-500/10 text-gray-400 hover:text-green-400 text-[11px] font-bold border border-itec-gray">Aprobar / Promocionar</button>
            )}
            {(sub.status === 'aprobada' || sub.status === 'regular') && (
              <button onClick={() => onActionClick(sub, 'disponible')} className="w-8 h-8 rounded-lg bg-itec-bg hover:bg-red-500/10 text-gray-500 hover:text-red-400 border border-itec-gray" title="Deshacer estado">↺</button>
            )}
            {(sub.status === 'regular' || sub.status === 'disponible') && (
              <Link to={`/cursos?search=${encodeURIComponent(sub.name)}`} className="w-8 h-8 flex items-center justify-center rounded-lg bg-itec-blue/10 hover:bg-itec-blue text-itec-blue-skye hover:text-white border border-itec-blue/30">
                <div className="w-3 h-3"><Icons type="playFill" /></div>
              </Link>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};