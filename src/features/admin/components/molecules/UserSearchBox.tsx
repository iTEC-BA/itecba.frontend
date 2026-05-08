import React, { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { User } from "@context/AuthContext";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";

interface Props {
  searchMutation: UseMutationResult<User | null, Error, string, unknown>;
  toggleMutation: UseMutationResult<void, Error, { userId: string; role: "admin" | "student" }, unknown>;
}

export const UserSearchBox: React.FC<Props> = ({ searchMutation, toggleMutation }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) searchMutation.mutate(email);
  };

  const handleToggle = (user: User) => {
    const newRole = user.role === "admin" ? "student" : "admin";
    if (window.confirm(`¿Cambiar rol a ${newRole.toUpperCase()}?`)) {
      toggleMutation.mutate({ userId: user.id!, role: newRole }, {
        onSuccess: () => {
          setEmail("");
          searchMutation.reset();
        },
      });
    }
  };

  return (
    <GlassCard className="p-5 sm:p-6 lg:p-7" variant="elevated" glow="sky">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">Usuarios</p>
        <h3 className="mt-1 text-xl font-bold text-itec-text">Buscar usuario</h3>
        <p className="mt-2 text-sm text-itec-muted">Encontrá un alumno por correo para revisar o ajustar su rol.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@frba.utn.edu.ar"
          fullWidth
        />
        <Button variant="primary" hierarchy="solid" type="submit" isLoading={searchMutation.isPending} disabled={!email.trim()}>
          Buscar
        </Button>
      </form>

      {searchMutation.isError && (
        <div className="mt-4 rounded-2xl border border-itec-accent/20 bg-itec-accent/10 px-4 py-3 text-sm text-rose-200">
          Usuario no encontrado en la base de datos.
        </div>
      )}

      {searchMutation.isSuccess && searchMutation.data && (
        <div className="mt-5 rounded-[1.4rem] border border-itec-border bg-itec-surface/60 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={searchMutation.data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(searchMutation.data.name)}`}
                alt="avatar"
                className="h-12 w-12 rounded-full border border-itec-border object-cover"
              />
              <div>
                <p className="text-sm font-bold text-itec-text">{searchMutation.data.name}</p>
                <p className="text-xs text-itec-muted">{searchMutation.data.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${searchMutation.data.role === "admin" ? "border-itec-accent/20 bg-itec-accent/10 text-itec-accent" : "border-itec-sky/20 bg-itec-sky/10 text-itec-sky"}`}>
                Rol: {searchMutation.data.role}
              </span>
              <Button
                variant={searchMutation.data.role === "admin" ? "danger" : "primary"}
                hierarchy="solid"
                isLoading={toggleMutation.isPending}
                onClick={() => handleToggle(searchMutation.data!)}
              >
                {searchMutation.data.role === "admin" ? "Revocar admin" : "Hacer admin"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
