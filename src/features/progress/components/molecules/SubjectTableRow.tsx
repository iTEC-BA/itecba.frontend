import React from 'react';
import type { Subject, SubjectStatus } from '../../types/progress';

interface Props {
  sub: Subject;
  allSubjects: Subject[];
  onActionClick: (subject: Subject, action: string) => void;
}

const getStatusStyles = (status: SubjectStatus) => {
  // Ajuste milimétrico a la paleta de tailwind.config.js de Itec.
  switch (status) {
    case 'aprobada': 
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'habilitada_rendir': 
      return 'bg-itec-primary/20 text-itecBlue border-itec-primary/40'; // Usa Itec Primary y Blue
    case 'regular_bloqueada': 
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'cursando': 
      return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'; // Contraste sutil para cursada
    case 'habilitada_cursar': 
      return 'bg-itec-gray/30 text-itec-text border-itec-gray/50';
    case 'bloqueada': 
    default: 
      return 'bg-transparent text-gray-500 border-dashed border-gray-700/50 opacity-50';
  }
};

const getStatusLabel = (status: SubjectStatus) => {
  switch (status) {
    case 'aprobada': return 'Final Aprobado';
    case 'habilitada_rendir': return 'Regularizada';
    case 'regular_bloqueada': return 'Reg. Sin Final';
    case 'cursando': return 'Cursando Ahora';
    case 'habilitada_cursar': return 'Habilitada Cursar';
    case 'bloqueada': default: return 'Bloqueada';
  }
};

export const SubjectTableRow: React.FC<Props> = ({ sub, allSubjects, onActionClick }) => {
  const isBloqueada = sub.status === 'bloqueada';
  const lacksFinalReq = sub.status === 'regular_bloqueada' || sub.status === 'habilitada_cursar' || sub.status === 'cursando';

  return (
    <tr className={`hover:bg-itec-gray/10 transition-colors group ${isBloqueada ? 'bg-black/10' : ''}`}>
      <td className="px-5 py-4 text-center font-mono text-xs text-gray-500">{sub.code || '-'}</td>
      <td className="px-5 py-4">
        <div className={`font-semibold text-sm ${isBloqueada ? 'text-itec-text' : 'text-itec-text'}`}>{sub.name}</div>
        {sub.grade !== undefined && (
          <div className="text-xs text-green-400 font-mono mt-1 font-bold">Nota: {sub.grade}</div>
        )}
      </td>
      <td className="px-5 py-4 text-xs text-itec-text">
        <div className="flex flex-col gap-1">
          {sub.reqCursada?.length > 0 && <div><span className="font-semibold text-gray-500">Cursada:</span> {sub.reqCursada.map(id => allSubjects.find(s => s.id === id)?.name).join(', ')}</div>}
          {sub.reqAprobada?.length > 0 && <div><span className="font-semibold text-gray-500">Final:</span> {sub.reqAprobada.map(id => allSubjects.find(s => s.id === id)?.name).join(', ')}</div>}
          {(!sub.reqCursada?.length && !sub.reqAprobada?.length) && <span className="text-gray-600 italic">Ninguna</span>}
        </div>
      </td>
      <td className="px-5 py-4 text-center">
        <span className={`px-3 py-1 rounded-md text-xs font-bold border tracking-wide inline-block ${getStatusStyles(sub.status)}`}>
          {getStatusLabel(sub.status)}
        </span>
      </td>
      <td className="px-5 py-4 text-right pr-6">
        <select 
          value={sub.status.includes('regular') ? 'regular' : sub.status} 
          onChange={(e) => onActionClick(sub, e.target.value)}
          disabled={isBloqueada}
          className={`border text-xs font-medium rounded-md px-3 py-2 w-full max-w-[150px] outline-none transition-colors ${
            isBloqueada 
            ? 'bg-transparent text-gray-600 border-gray-700/50 cursor-not-allowed' 
            : 'bg-itec-bg border-itec-gray text-itec-text hover:border-itecBlue cursor-pointer'
          }`}
        >
          {isBloqueada && <option value="bloqueada">Faltan Correlativas</option>}
          {!isBloqueada && <option value="habilitada_cursar">Sin Cursar</option>}
          {!isBloqueada && <option value="cursando">En Curso</option>}
          {!isBloqueada && <option value="regular">Regularicé</option>}
          {!isBloqueada && <option value="aprobada" disabled={lacksFinalReq}>Aprobé el Final</option>}
        </select>
      </td>
    </tr>
  );
};