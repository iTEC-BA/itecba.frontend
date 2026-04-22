import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { Icons } from '../../../../components/ui/Icons';

export const ProfileHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-slate-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-sm gap-6">
      <div className="flex items-center gap-6">
        {user?.photoURL ? (
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 p-1 shrink-0 shadow-xl">
              <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover rounded-xl" />
            </div>
        ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 p-1 shrink-0 flex items-center justify-center shadow-xl text-3xl">
              👨‍🎓
            </div>
        )}
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{user?.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded-md border border-white/5"><div className="w-4 h-4 text-sky-400"><Icons type="users" /></div>{user?.specialty}</span>
            <span className="flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded-md border border-white/5"><div className="w-4 h-4 text-sky-400"><Icons type="documentFill" /></div>{user?.dni}</span>
            <span className="flex items-center gap-1.5 bg-slate-950/50 px-2 py-1 rounded-md border border-white/5"><div className="w-4 h-4 text-sky-400"><Icons type="message" /></div>{user?.email}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
          <span className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-2 rounded-xl text-sm font-bold shadow-inner">
            <span className="text-lg">⭐</span> {user?.points || 0} Puntos
          </span>
          <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition-colors font-medium cursor-pointer">
            Cerrar Sesión
          </button>
      </div>
    </div>
  );
};