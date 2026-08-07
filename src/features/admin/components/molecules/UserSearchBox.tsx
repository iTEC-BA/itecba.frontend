import React, { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { User } from "@context/AuthContext";
import { Search, ShieldAlert, ShieldCheck, Mail } from "lucide-react";
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
    <div className="flex flex-col gap-4 rounded-xl border border-itec-border bg-itec-box p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-itec-text">Buscar alumno</h3>
        <p className="text-xs text-itec-muted">Buscá por correo institucional para revisar o cambiar su rol.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@frba.utn.edu.ar"
            className="w-full bg-itec-surface border border-itec-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-itec-text focus:outline-none focus:border-itec-red focus:ring-1 focus:ring-itec-red transition-all"
          />
        </div>
        <button 
          type="submit" 
          disabled={!email.trim() || searchMutation.isPending}
          className="flex items-center justify-center gap-2 w-full bg-itec-red hover:bg-itec-red-skye text-white text-xs font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searchMutation.isPending ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Buscar usuario
        </button>
      </form>

      {searchMutation.isError && (
        <div className="rounded-lg border border-itec-red/20 bg-itec-red/10 px-4 py-3 text-xs text-itec-red font-medium">
          Usuario no encontrado en la base de datos.
        </div>
      )}

      {searchMutation.isSuccess && searchMutation.data && (
        <div className="mt-2 flex flex-col gap-4 rounded-lg border border-itec-border bg-itec-surface p-4">
          <div className="flex items-center gap-3">
            <img
              src={searchMutation.data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(searchMutation.data.name)}&background=171717&color=fff`}
              alt="avatar"
              className="h-10 w-10 rounded-full border border-itec-border object-cover bg-itec-box"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-itec-text truncate">{searchMutation.data.name}</p>
              <p className="text-[10px] text-itec-muted truncate">{searchMutation.data.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-itec-border/50 pt-3">
            <span className={cn(
              "px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md border",
              searchMutation.data.role === "admin" 
                ? "border-itec-red/20 bg-itec-red/10 text-itec-red" 
                : "border-itec-sky/20 bg-itec-sky/10 text-itec-sky"
            )}>
              {searchMutation.data.role}
            </span>
            
            <button
              onClick={() => handleToggle(searchMutation.data!)}
              disabled={toggleMutation.isPending}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50",
                searchMutation.data.role === "admin"
                  ? "bg-itec-surface border border-itec-border text-itec-red hover:bg-itec-red/10"
                  : "bg-itec-surface border border-itec-border text-itec-emerald hover:bg-itec-emerald/10"
              )}
            >
              {searchMutation.data.role === "admin" ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {searchMutation.data.role === "admin" ? "Revocar" : "Hacer Admin"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
