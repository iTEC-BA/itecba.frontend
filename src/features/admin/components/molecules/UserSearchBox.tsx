import React, { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { User } from "@context/AuthContext";
import { Icons } from "@/components/ui/icons/Icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-itec-box p-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-white">Buscar Alumno</h3>
        <p className="text-xs text-itec-muted">Gestión individual por correo institucional.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Icons type="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@frba.utn.edu.ar"
            className="w-full bg-itec-bg border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm font-mono focus:border-itec-red/50"
          />
        </div>
        <Button 
          type="submit" 
          variant="danger" 
          hierarchy="solid"
          fullWidth
          disabled={!email.trim() || searchMutation.isPending}
          text={searchMutation.isPending ? "Buscando..." : "Buscar Usuario"}
        />
      </form>

      {searchMutation.isSuccess && searchMutation.data && (
        <div className="mt-2 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <img src={searchMutation.data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(searchMutation.data.name)}&background=171717&color=fff`} alt="avatar" className="h-10 w-10 rounded-lg border border-white/10 object-cover bg-black" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{searchMutation.data.name}</p>
              <p className="text-[10px] text-itec-muted truncate font-mono">{searchMutation.data.email}</p>
            </div>
          </div>
          <Button
            onClick={() => {
              if (window.confirm("¿Confirmar cambio de rol?")) {
                toggleMutation.mutate({ userId: searchMutation.data!.id!, role: searchMutation.data!.role === "admin" ? "student" : "admin" });
              }
            }}
            disabled={toggleMutation.isPending}
            fullWidth
            variant={searchMutation.data.role === "admin" ? "danger" : "success"}
            hierarchy="outline"
            text={searchMutation.data.role === "admin" ? "Revocar Permisos" : "Hacer Administrador"}
          />
        </div>
      )}
    </div>
  );
};
