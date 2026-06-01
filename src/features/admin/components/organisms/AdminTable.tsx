import React from "react";
import type { User } from "@/context/AuthContext";
import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@components/ui/Button";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";

interface Props {
  admins: User[];
  isLoading: boolean;
  currentUserEmail?: string | null;
  toggleMutation: UseMutationResult<void, Error, { userId: string; role: "admin" | "student" }, unknown>;
}

export const AdminTable: React.FC<Props> = ({ admins, isLoading, currentUserEmail, toggleMutation }) => {
  return (
    <GlassCard className="overflow-hidden" variant="elevated">
      <div className="flex items-center justify-between gap-4 border-b border-itec-border px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Usuarios</p>
          <h3 className="mt-1 text-sm font-bold text-itec-text">Personal autorizado</h3>
        </div>
        <span className="rounded-full border border-itec-sky/20 bg-itec-sky/10 px-3 py-1 text-xs font-bold text-itec-sky">
          {admins.length} activos
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-itec-box/70">
            <tr>
              <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted sm:px-6">Perfil</th>
              <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted sm:px-6">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-itec-border">
            {isLoading ? (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-sm text-itec-muted animate-pulse sm:px-6">Cargando datos...</td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-5 py-10 text-center text-sm text-itec-muted sm:px-6">Sin administradores.</td>
              </tr>
            ) : (
              admins.map((admin) => {
                const isSuperAdmin = admin.email === "jtumiricuellar@frba.utn.edu.ar";
                const isMe = currentUserEmail === admin.email;

                return (
                  <tr key={admin.id} className="group hover:bg-itec-surface/50">
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={admin.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name ?? "A")}`}
                            className="h-11 w-11 rounded-xl border border-itec-border object-cover"
                            alt="avatar"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-itec-box bg-itec-emerald" />
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-sm font-bold text-itec-text">
                            {admin.name}
                            {isMe && <span className="rounded-md bg-itec-surface px-1.5 py-0.5 text-[9px] font-bold text-itec-muted">TÚ</span>}
                          </p>
                          <p className="truncate font-mono text-xs text-itec-muted">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right sm:px-6">
                      <Button
                        variant="danger"
                        hierarchy="ghost"
                        onClick={() => toggleMutation.mutate({ userId: admin.id!, role: "student" })}
                        disabled={isSuperAdmin || toggleMutation.isPending}
                      >
                        {isSuperAdmin ? "Inamovible" : "Revocar"}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
