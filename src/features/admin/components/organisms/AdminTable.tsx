import React from 'react';
import type { User } from '@/context/AuthContext';
import type { UseMutationResult } from '@tanstack/react-query';

interface Props {
  admins: User[];
  isLoading: boolean;
  currentUserEmail?: string | null;
  toggleMutation: UseMutationResult<void, Error, { userId: string; role: "admin" | "student" }, unknown>;
}

export const AdminTable: React.FC<Props> = ({ admins, isLoading, currentUserEmail, toggleMutation }) => {
  return (
    <div className="bg-itec-surface/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold">Personal Autorizado</h3>
          <p className="text-gray-500 text-xs mt-1">Usuarios con nivel de Administrador.</p>
        </div>
        <span className="bg-itecBlue/10 text-itecBlue text-xs font-bold px-3 py-1">
          {admins.length} Activos
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/20">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Perfil</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={2} className="px-8 py-10 text-center text-gray-500 text-sm animate-pulse">Cargando datos...</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan={2} className="px-8 py-10 text-center text-gray-500 text-sm">Sin administradores.</td></tr>
            ) : (
              admins.map((admin) => {
                const isSuperAdmin = admin.email === 'jtumiricuellar@frba.utn.edu.ar';
                const isMe = currentUserEmail === admin.email;

                return (
                  <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-4 flex items-center gap-4">
                      <div className="relative">
                        <img src={admin.photoURL || `https://ui-avatars.com/api/?name=${admin.name}`} className="w-10 h-10 rounded-full border border-white/10" alt="avatar" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-itec-surface rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          {admin.name} 
                          {isMe && <span className="bg-white/10 text-gray-300 text-[9px] px-1.5 py-0.5 rounded">TÚ</span>}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{admin.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => toggleMutation.mutate({ userId: admin.id!, role: 'student' })}
                        disabled={isSuperAdmin || toggleMutation.isPending}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all outline-none ${
                          isSuperAdmin 
                            ? 'text-gray-600 cursor-not-allowed' 
                            : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        {isSuperAdmin ? 'Inamovible' : 'Revocar'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};