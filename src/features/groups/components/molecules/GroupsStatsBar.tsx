import React from 'react';
import { Icons } from '@components/ui/icons/Icons';
import type { GroupStats } from '../../services/groupsService';

interface Props { stats: GroupStats; }

export const GroupsStatsBar: React.FC<Props> = ({ stats }) => {
  const items = [
    { label: 'Grupos',     value: stats.total,     icon: 'users', color: 'text-emerald-400' },
    { label: 'Oficiales',  value: stats.oficiales,  icon: 'check', color: 'text-itec-blue-skye' },
    { label: 'Carreras',   value: stats.carreras,   icon: 'degree', color: 'text-itec-rewards' },
    { label: 'Reportados', value: stats.reportados, icon: 'close', color: 'text-itec-red' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
      {items.map(s => (
        <div key={s.label} className="bg-itec-box border border-white/[0.07] rounded-xl p-3.5 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${s.color}`}>
            <Icons type={s.icon} className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-lg font-bold leading-none ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-itec-gray mt-0.5">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
