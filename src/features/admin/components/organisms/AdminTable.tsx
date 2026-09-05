import React from "react";
import type { User } from '@/stores/authStore';
import { SUPER_ADMIN_EMAIL } from '@/stores/authStore';
import type { UseMutationResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface Props {
  admins: User[];
  isLoading: boolean;
  currentUserEmail?: string | null;
  toggleMutation: UseMutationResult<void, Error, { userId: string; role: "admin" | "student" }, unknown>;
}

export const AdminTable: React.FC<Props> = ({ admins, isLoading, currentUserEmail, toggleMutation }) => {
  return (
    <div className="flex flex-col rounded-xl border border-white/5 bg-itec-box overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/[0.02]">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Personal Autorizado</h3>
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
          {admins.length} cuentas
        </span>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[500px] text-left text-xs whitespace-nowrap">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-itec-muted">Usuario</th>
              <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-itec-muted">Permisos</th>
              <th className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-widest text-itec-muted">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-itec-muted animate-pulse">Cargando datos...</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-itec-muted">Sin administradores.</td></tr>
            ) : (
              admins.map((admin) => {
                const isSuperAdmin = admin.email === SUPER_ADMIN_EMAIL;
                const isMe = currentUserEmail === admin.email;

                return (
                  <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={admin.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name ?? "A")}&background=171717&color=fff`} className="h-7 w-7 rounded border border-white/10 bg-itec-bg object-cover grayscale" alt="avatar" />
                        <div>
                          <p className="font-bold text-white">{admin.name} {isMe && <span className="text-[8px] text-itec-muted uppercase border border-white/10 px-1 rounded ml-1">Tú</span>}</p>
                          <p className="text-[10px] font-mono text-itec-muted">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                       <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border border-itec-red/20 bg-itec-red/10 text-itec-red">
                         {isSuperAdmin ? "Super" : "Admin"}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleMutation.mutate({ userId: admin.id!, role: "student" })}
                        disabled={isSuperAdmin || toggleMutation.isPending}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border",
                          isSuperAdmin 
                            ? "bg-transparent border-transparent text-itec-muted cursor-not-allowed opacity-50" 
                            : "bg-transparent border-white/10 text-white hover:border-itec-red/30 hover:bg-itec-red/10 hover:text-itec-red"
                        )}
                      >
                        {isSuperAdmin ? "Fijo" : "Revocar"}
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
