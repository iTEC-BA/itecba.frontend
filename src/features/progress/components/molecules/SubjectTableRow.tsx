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
