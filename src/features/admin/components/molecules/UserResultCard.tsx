import React from "react";
import type { User } from "@context/AuthContext";
import { Button } from "@components/ui/Button";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";

interface Props {
  user: User;
  isUpdating: boolean;
  onToggleRole: (id: string, role: string) => void;
}

export const UserResultCard: React.FC<Props> = ({ user, isUpdating, onToggleRole }) => {
  const isAdmin = user.role === "admin";

  return (
    <GlassCard className="overflow-hidden p-5 sm:p-6" variant="elevated">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? "User")}&background=0D8ABC&color=fff`}
              alt="Avatar"
              className="h-16 w-16 rounded-2xl border border-itec-border object-cover"
            />
            <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-itec-box ${isAdmin ? "bg-itec-accent" : "bg-itec-emerald"}`} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-itec-text">{user.name}</h3>
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${isAdmin ? "border-itec-accent/20 bg-itec-accent/10 text-itec-accent" : "border-itec-sky/20 bg-itec-sky/10 text-itec-sky"}`}>
                {user.role}
              </span>
            </div>
            <p className="mt-1 truncate font-mono text-sm text-itec-muted">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button
            variant={isAdmin ? "danger" : "primary"}
            hierarchy="solid"
            isLoading={isUpdating}
            onClick={() => onToggleRole(user.id!, user.role)}
          >
            {isAdmin ? "Revocar acceso admin" : "Hacer administrador"}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};
