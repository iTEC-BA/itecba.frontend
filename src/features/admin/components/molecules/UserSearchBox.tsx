

import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdminData } from "../../hooks/useAdminData";

export const UserSearchBox: React.FC = () => {
  const {
    searchUserMutation,
    toggleRoleMutation,
    createAuthorizedMutation,
    updateAuthorizedMutation,
  } = useAdminData();
  const [email, setEmail] = useState("");

  const isInstitutionalEmail = (value: string) =>
    value.toLowerCase().endsWith("@frba.utn.edu.ar");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    if (isInstitutionalEmail(normalizedEmail)) {
      searchUserMutation.mutate(normalizedEmail);
      return;
    }

    createAuthorizedMutation.mutate({
      name: normalizedEmail.split("@")[0],
      email: normalizedEmail,
      role: "student",
      authorized: true,
    }, {
      onSuccess: () => {
        searchUserMutation.mutate(normalizedEmail);
      },
    });
  };

  const refreshUser = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail) searchUserMutation.mutate(normalizedEmail);
  };

  const handleToggleRole = () => {
    const user = searchUserMutation.data;
    if (!user?.id) return;

    toggleRoleMutation.mutate(
      {
        userId: user.id,
        role: user.role === "admin" ? "student" : "admin",
      },
      { onSuccess: refreshUser },
    );
  };

  const handleToggleAuthorization = () => {
    const user = searchUserMutation.data;
    if (!user?.id) return;

    const isAuthorized = !user.authorized;
    if (!window.confirm(isAuthorized ? "¿Autorizar este usuario?" : "¿Revocar autorización?")) return;

    updateAuthorizedMutation.mutate(
      {
        userId: user.id,
        data: { authorized: isAuthorized },
      },
      { onSuccess: refreshUser },
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-itec-border/50 bg-itec-box p-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-white">Buscar Alumno</h3>
        <p className="text-xs text-itec-muted">Buscá una cuenta institucional o autorizá un correo externo.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-itec-muted" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@frba.utn.edu.ar"
            className="w-full bg-itec-bg border border-itec-border/50 rounded-lg pl-9 pr-4 py-2.5 text-sm font-mono focus:border-itec-red/50"
          />
        </div>
        <Button 
          type="submit" 
          variant="danger" 
          hierarchy="solid"
          fullWidth
          disabled={!email.trim() || searchUserMutation.isPending || createAuthorizedMutation.isPending}
          text={
            searchUserMutation.isPending
              ? "Buscando..."
              : createAuthorizedMutation.isPending
                ? "Creando..."
                : isInstitutionalEmail(email.trim())
                  ? "Buscar Usuario"
                  : "Autorizar Usuario"
          }
        />
      </form>

      {searchUserMutation.isSuccess && searchUserMutation.data && (
        <div className="mt-2 flex flex-col gap-4 rounded-xl border border-itec-border/50 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <img src={searchUserMutation.data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(searchUserMutation.data.name)}&background=171717&color=fff`} alt="avatar" className="h-10 w-10 rounded-lg border border-itec-border/50 object-cover bg-black" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{searchUserMutation.data.name}</p>
              <p className="text-[10px] text-itec-muted truncate font-mono">{searchUserMutation.data.email}</p>
              {!isInstitutionalEmail(searchUserMutation.data.email) && (
                <p className={`text-[10px] font-semibold ${searchUserMutation.data.authorized ? "text-emerald-400" : "text-amber-400"}`}>
                {searchUserMutation.data.authorized ? "Autorizado" : "Pendiente de autorización"}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleToggleRole}
            disabled={Boolean(searchUserMutation.data.isExternalAuthorization) || toggleRoleMutation.isPending || updateAuthorizedMutation.isPending}
            fullWidth
            variant="slate"
            hierarchy="solid"
            text={searchUserMutation.data.role === "admin" ? "Sacar admin" : "Asignar admin"}
          />
          {!isInstitutionalEmail(searchUserMutation.data.email) && (
            <Button
              onClick={handleToggleAuthorization}
              disabled={toggleRoleMutation.isPending || updateAuthorizedMutation.isPending}
              fullWidth
              variant={searchUserMutation.data.authorized ? "danger" : "slate"}
              hierarchy="solid"
              text={searchUserMutation.data.authorized ? "Revocar Autorización" : "Autorizar Usuario"}
            />
          )}
        </div>
      )}
    </div>
  );
};
