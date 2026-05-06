import React, { useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { User } from '@context/AuthContext';
import { Button } from '@components/ui/Button';

interface Props {
  searchMutation: UseMutationResult<User | null, Error, string, unknown>;
  toggleMutation: UseMutationResult<void, Error, { userId: string; role: "admin" | "student" }, unknown>;
}

export const UserSearchBox: React.FC<Props> = ({ searchMutation, toggleMutation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) searchMutation.mutate(email);
  };

  const handleToggle = (user: User) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    if (window.confirm(`¿Cambiar rol a ${newRole.toUpperCase()}?`)) {
      toggleMutation.mutate({ userId: user.id!, role: newRole }, {
        onSuccess: () => { setEmail(''); searchMutation.reset(); }
      });
    }
  };

  return (
    <div className="bg-itec-box/40 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
      <h3 className="text-itec-textfont-bold mb-1">Buscar Usuario</h3>
      <p className="text-gray-500 text-xs mb-6">Encuentra un alumno por su correo para modificar sus permisos.</p>

      <form onSubmit={handleSubmit} className="relative flex items-center max-w-md">
        <span className="absolute left-4 text-gray-500">@</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@frba.utn.edu.ar"
          className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 pl-10 pr-24 text-itec-texttext-sm focus:border-itecBlue focus:ring-1 focus:ring-itecBlue/50 outline-none transition-all"
        />
        <button 
          type="submit" 
          disabled={searchMutation.isPending || !email}
          className="absolute right-2 bg-itecBlue hover:bg-blue-600 text-itec-texttext-xs font-bold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
        >
          {searchMutation.isPending ? '...' : 'Buscar'}
        </button>
      </form>

      {searchMutation.isError && (
        <p className="text-red-400 text-xs mt-4 pl-2">Usuario no encontrado en la base de datos.</p>
      )}

      {searchMutation.isSuccess && searchMutation.data && (
        <div className="mt-6 max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <img src={searchMutation.data.photoURL || `https://ui-avatars.com/api/?name=${searchMutation.data.name}`} alt="avatar" className="w-10 h-10 rounded-full border border-white/10" />
            <div>
              <p className="text-itec-texttext-sm font-bold">{searchMutation.data.name}</p>
              <p className="text-gray-500 text-[10px]">{searchMutation.data.email}</p>
            </div>
          </div>
          <Button 
            onClick={() => handleToggle(searchMutation.data!)}
            disabled={toggleMutation.isPending}
            variant={searchMutation.data.role === 'admin' ? 'secondary' : 'primary'}
            className="text-[10px] px-3 py-1.5"
          >
            {searchMutation.data.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
          </Button>
        </div>
      )}
    </div>
  );
};