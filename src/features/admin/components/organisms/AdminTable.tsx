import React from "react";
import type { User } from "@/context/AuthContext";
import { SUPER_ADMIN_EMAIL } from "@/context/AuthContext";
import type { UseMutationResult } from "@tanstack/react-query";
import { ShieldOff, ShieldAlert, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  admins: User[];
  isLoading: boolean;
  currentUserEmail?: string | null;
  toggleMutation: UseMutationResult<void, Error, { userId: string; role: "admin" | "student" }, unknown>;
}

export const AdminTable: React.FC<Props> = ({ admins, isLoading, currentUserEmail, toggleMutation }) => {
  return (
    <div className="flex flex-col rounded-xl border border-itec-border bg-itec-box overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-itec-border px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-itec-text">Personal autorizado</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-itec-muted mt-0.5">Administradores activos</p>
        </div>
        <span className="rounded-full border border-itec-red/20 bg-itec-red/10 px-3 py-1 text-[10px] font-bold text-itec-red tracking-widest uppercase">
          {admins.length} cuentas
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-itec-surface/50 border-b border-itec-border">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-itec-muted">Perfil</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-itec-muted">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-itec-border/50">
            {isLoading ? (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-xs text-itec-muted animate-pulse">Cargando datos...</td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-xs text-itec-muted">Sin administradores activos.</td>
              </tr>
            ) : (
              admins.map((admin) => {
                const isSuperAdmin = admin.email === SUPER_ADMIN_EMAIL;
                const isMe = currentUserEmail === admin.email;

                return (
                  <tr key={admin.id} className="group hover:bg-itec-surface/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={admin.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name ?? "A")}&background=171717&color=fff`}
                            className="h-9 w-9 rounded-full border border-itec-border object-cover bg-itec-box"
                            alt="avatar"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-itec-box bg-itec-red" />
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-xs font-bold text-itec-text">
                            {admin.name}
                            {isMe && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[8px] font-bold text-itec-muted uppercase tracking-wider border border-white/10">Tú</span>}
                            {isSuperAdmin && <Crown className="w-3 h-3 text-itec-rewards" />}
                          </p>
                          <p className="truncate font-mono text-[10px] text-itec-muted mt-0.5">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => toggleMutation.mutate({ userId: admin.id!, role: "student" })}
                        disabled={isSuperAdmin || toggleMutation.isPending}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                          isSuperAdmin 
                            ? "bg-transparent text-itec-muted cursor-not-allowed" 
                            : "bg-transparent border border-transparent text-itec-muted hover:text-itec-red hover:bg-itec-red/10 hover:border-itec-red/20 disabled:opacity-50"
                        )}
                      >
                        {isSuperAdmin ? (
                          <><ShieldAlert className="w-3 h-3" /> Fijo</>
                        ) : (
                          <><ShieldOff className="w-3 h-3" /> Revocar</>
                        )}
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
