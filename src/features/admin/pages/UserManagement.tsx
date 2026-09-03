import React from "react";
import { useAdminData } from "../hooks/useAdminData";
import { useAuth } from "@/context/AuthContext";
import { UserSearchBox } from "../components/molecules/UserSearchBox";
import { AdminTable } from "../components/organisms/AdminTable";
import { Icons } from "@components/ui/icons/Icons";

export const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { admins, isLoadingAdmins, searchUserMutation, toggleRoleMutation } = useAdminData();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted mb-1">Gestión de Roles</p>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Icons type="users" className="w-6 h-6 text-itec-red" />
          Usuarios
        </h2>
        <p className="text-xs text-itec-muted mt-1">
          Buscá alumnos y administrá sus permisos de acceso al panel de control.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.8fr] items-start">
        <UserSearchBox searchMutation={searchUserMutation} toggleMutation={toggleRoleMutation} />
        <AdminTable
          admins={admins}
          isLoading={isLoadingAdmins}
          currentUserEmail={currentUser?.email}
          toggleMutation={toggleRoleMutation}
        />
      </div>
    </div>
  );
};
