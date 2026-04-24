import React from 'react';
import type { User } from '@context/AuthContext';

interface Props {
  user: User;
  isUpdating: boolean;
  onToggleRole: (id: string, role: string) => void;
}

export const UserResultCard: React.FC<Props> = ({ user, isUpdating, onToggleRole }) => {
  const isAdmin = user.role === 'admin';
  
  return (
    <div className="bg-itec-bg border border-itec-gray rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl animate-fade-in relative overflow-hidden">
      {isAdmin && <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>}
      
      <div className="flex items-center gap-5">
        <img 
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} 
          alt="Avatar" 
          className="w-16 h-16 rounded-full border-2 border-itec-gray shadow-md"
        />
        <div>
          <h3 className="text-xl font-bold text-white">{user.name}</h3>
          <p className="text-sm text-gray-400 font-mono mt-1">{user.email}</p>
          <div className="mt-2">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-md border ${
              isAdmin 
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            }`}>
              Rol: {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-col items-end gap-2">
        <button
          onClick={() => onToggleRole(user.id!, user.role)}
          disabled={isUpdating}
          className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg outline-none ${
            isAdmin 
              ? 'bg-itec-surface border border-itec-gray text-white hover:border-red-500 hover:text-red-400' 
              : 'bg-orange-600 hover:bg-orange-500 text-white'
          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? 'Actualizando...' : (isAdmin ? 'Revocar Acceso Admin' : 'Hacer Administrador')}
        </button>
      </div>
    </div>
  );
};