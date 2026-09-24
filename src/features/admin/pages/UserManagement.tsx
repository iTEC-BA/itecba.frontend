// @\features\admin\pages\UserManagement.tsx
import React from "react";
import { useAdminData } from "../hooks/useAdminData";
import { UserSearchBox } from "../components/molecules/UserSearchBox";
import { AdminTable } from "../components/organisms/AdminTable";
import { Button } from "@/components/ui/Button";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { Users } from "lucide-react";

export const UserManagement: React.FC = () => {
  const {
    admins,
    isLoadingAdmins,
    authorized,
    isLoadingAuthorized,
  } = useAdminData();
  const [isAddAdminOpen, setIsAddAdminOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted mb-1">
          Gestión de Roles
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-itec-red" />
            Usuarios
          </h2>
          <Button
            onClick={() => setIsAddAdminOpen(true)}
            variant="danger"
            hierarchy="solid"
          >
            Gestionar acceso
          </Button>
        </div>
        <p className="text-xs text-itec-muted mt-1">
          Buscá alumnos y administrá sus permisos para dar accesos a la
          plataforma.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.8fr] items-start">
        <div>
          <AdminTable
            nameTable="Admins - Moderadores"
            persons={admins}
            isLoading={isLoadingAdmins}
          />
        </div>
        <div>
          <AdminTable
            nameTable="Cuentas Autorizadas"
            persons={authorized}
            isLoading={isLoadingAuthorized}
          />
        </div>
      </div>

      <LayoutModal
        isOpen={isAddAdminOpen}
        onClose={() => setIsAddAdminOpen(false)}
        title="Gestionar acceso de usuario"
        description="Buscá una cuenta o autorizá un correo externo."
        maxWidth="max-w-lg"
      >
        <div className="p-4">
          <UserSearchBox />
        </div>
      </LayoutModal>
    </div>
  );
};
