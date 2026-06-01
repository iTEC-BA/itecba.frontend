// src/features/progress/components/molecules/SubjectTableRow.tsx
// Usa CustomSelect (componente global) en lugar de <select> HTML crudo.
import React, { useMemo }   from 'react';
import { CustomSelect }     from '@components/ui/CustomSelect';
import { StatusBadge }      from '../atoms/StatusBadge';
import type { Subject, SubjectStatus } from '../../types/progress';

interface Props {
  sub:           Subject;
  allSubjects:   Subject[];
  onActionClick: (subject: Subject, action: string) => void;
}

const STATUS_OPTIONS_BASE = [
  { value: 'habilitada_cursar', label: 'Sin Cursar'      },
  { value: 'cursando',          label: 'En Curso'        },
  { value: 'regular',           label: 'Regularicé'      },
  { value: 'aprobada',          label: 'Aprobé el Final' },
  { value: 'promocionada',      label: 'Promocioné ✦'    },
];

const BLOCKED_OPTIONS = [
  { value: 'bloqueada', label: 'Faltan Correlativas' },
];

const statusToDropdownValue = (status: SubjectStatus): string => {
  if (status === 'aprobada' || status === 'promocionada') return status;
  if (status === 'habilitada_rendir' || status === 'regular_bloqueada') return 'regular';
  if (status === 'cursando') return 'cursando';
  if (status === 'bloqueada') return 'bloqueada';
  return 'habilitada_cursar';
};

export const SubjectTableRow: React.FC<Props> = ({
  sub,
  allSubjects,
  onActionClick,
}) => {
  const isBloqueada   = sub.status === 'bloqueada';
  const lacksFinalReq =
    sub.status === 'regular_bloqueada' ||
    sub.status === 'habilitada_cursar'  ||
    sub.status === 'cursando';

  const options = useMemo(() => {
    if (isBloqueada)   return BLOCKED_OPTIONS;
    if (lacksFinalReq) {
      return STATUS_OPTIONS_BASE.filter(
        (o) => o.value !== 'aprobada' && o.value !== 'promocionada'
      );
    }
    return STATUS_OPTIONS_BASE;
  }, [isBloqueada, lacksFinalReq]);

  const currentValue = statusToDropdownValue(sub.status);

  return (
    <tr className={`hover:bg-itec-gray/10 transition-colors group ${isBloqueada ? 'bg-black/10' : ''}`}>
      <td className="px-5 py-4 text-center font-mono text-xs text-gray-500">
        {sub.code || '—'}
      </td>

      <td className="px-5 py-4">
        <div className="font-semibold text-sm text-itec-text">{sub.name}</div>
        {sub.grade !== undefined && (
          <div className="text-xs text-green-400 font-mono mt-1 font-bold">
            Nota: {sub.grade}
            {sub.status === 'promocionada' && (
              <span className="text-emerald-300 ml-1">✦ Prom.</span>
            )}
          </div>
        )}
      </td>

      <td className="px-5 py-4 text-xs text-itec-text">
        <div className="flex flex-col gap-1">
          {sub.reqCursada?.length > 0 && (
            <div>
              <span className="font-semibold text-gray-500">Cursada: </span>
              {sub.reqCursada
                .map((id) => allSubjects.find((s) => s.id === id)?.name ?? id)
                .join(', ')}
            </div>
          )}
          {sub.reqAprobada?.length > 0 && (
            <div>
              <span className="font-semibold text-gray-500">Final: </span>
              {sub.reqAprobada
                .map((id) => allSubjects.find((s) => s.id === id)?.name ?? id)
                .join(', ')}
            </div>
          )}
          {!sub.reqCursada?.length && !sub.reqAprobada?.length && (
            <span className="text-gray-600 italic">Ninguna</span>
          )}
        </div>
      </td>

      <td className="px-5 py-4 text-center">
        <StatusBadge status={sub.status} />
      </td>

      <td className="px-5 py-4 text-right pr-6">
        <CustomSelect
          value={currentValue}
          options={options}
          onChange={(val) => {
            if (val !== currentValue) onActionClick(sub, val);
          }}
          disabled={isBloqueada}
          placeholder="Seleccionar..."
        />
      </td>
    </tr>
  );
};
