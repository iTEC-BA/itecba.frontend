import React, { useState } from 'react';
import { AnonAvatar } from '../atoms/AnonAvatar';

const SUGGESTIONS = [
  { id: 1, name: 'IngenieroK#4521', sub: 'Sugerencia · 2 días' },
  { id: 2, name: 'AM2Survivor#9933', sub: 'Sugerencia · 4 días' },
  { id: 3, name: 'UTNdev#1102', sub: 'Sugerencia · 6 días' },
  { id: 4, name: 'ExamenFinal#3344', sub: 'Sugerencia · 1 semana' },
  { id: 5, name: 'LabRedes#2231', sub: 'Sugerencia · 2 semanas' },
];

const FollowBtn: React.FC = () => {
  const [following, setFollowing] = useState(false);
  return (
    <button
      onClick={() => setFollowing(f => !f)}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex-shrink-0 ${
        following
          ? 'bg-itect-red bg-itec-red text-white'
          : 'border-itec-border text-itec-text hover:border-purple-500 hover:text-purple-400'
      }`}
    >
      {following ? 'Siguiendo' : 'Seguir'}
    </button>
  );
};

export const ActivityPanel: React.FC = () => (
  <div>
    <div className="px-4 pt-4 pb-2">
      <span className="text-[11px] font-bold text-itec-muted uppercase tracking-widest">Sugerencias</span>
    </div>

    {/* Sistema notif */}
    <div className="flex gap-3 px-4 py-3 border-b border-itec-border hover:bg-white/1.5 transition-colors cursor-pointer">
      <div className="w-11 h-11 rounded-xl bg-itect-red/20 border border-purple-500/20 flex items-center justify-center text-lg shrink-0">
        🎓
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-itec-text leading-snug">
          Bienvenido al Foro Anónimo de iTEC UTN BA. Respetá a todos los miembros de la comunidad.
        </p>
        <p className="text-xs text-itec-muted mt-1">Administración iTEC</p>
      </div>
    </div>

    {SUGGESTIONS.map(s => (
      <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b border-itec-border hover:bg-white/1.5 transition-colors">
        <AnonAvatar pseudonym={s.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-itec-text truncate">{s.name.split('#')[0]}</p>
          <p className="text-xs text-itec-muted">{s.sub}</p>
        </div>
        <FollowBtn />
      </div>
    ))}
  </div>
);
