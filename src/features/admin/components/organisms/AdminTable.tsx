import React from "react";
import { useAuthStore, type User } from '@/stores/authStore';

interface Props {
  nameTable: string;
  persons: User[];
  isLoading: boolean;
}

export const AdminTable: React.FC<Props> = ({nameTable, persons, isLoading }) => {
  const {user} = useAuthStore();

  return (
    <div className="flex flex-col rounded-xl border border-itec-border/50 bg-itec-box overflow-hidden">
      <div className="flex items-center justify-between border-b border-itec-border/50 px-4 py-3 bg-white/2">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">{nameTable}</h3>
        <span className="rounded-md border border-itec-border/50 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
          {persons.length} cuentas
        </span>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-125 text-left text-xs whitespace-nowrap">
          <thead className="bg-white/5 border-b border-itec-border/50">
            <tr>
              <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-itec-muted">Usuario</th>
              <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-itec-muted">Permisos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-itec-muted animate-pulse">Cargando datos...</td></tr>
            ) : persons.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-itec-muted">Sin {nameTable}.</td></tr>
            ) : (
              persons.map((person) => {
                const isMe = user?.email === person.email;
                return (
                  <tr key={person.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={person.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name ?? "A")}&background=171717&color=fff`} className="h-7 w-7 rounded border border-itec-border/50 bg-itec-bg object-cover" alt="avatar" />
                        <div>
                          <p className="font-bold text-white">{person.name} {isMe && <span className="text-[8px] text-itec-muted uppercase border border-itec-border/50 px-1 rounded ml-1">Tú</span>}</p>
                          <p className="text-[10px] font-mono text-itec-muted">{person.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                       <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border border-itec-red/20 bg-itec-red/10 text-itec-red">
                         {person?.role}
                       </span>
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
