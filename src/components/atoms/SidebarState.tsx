import React from "react";
import { useAuthStore } from '@/stores/authStore';

export const SidebarBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="ml-auto text-[10px] font-medium px-1.5 py-[2px] rounded-md bg-itec-red text-white shrink-0">
      {children}
    </span>
  );
};

export const SidebarDivider = () => {
  return <div className="h-px bg-white/5 mx-[14px] my-2"></div>;
};

export const SidebarLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-[10px] font-medium text-[#5a6475] tracking-[0.1em] uppercase px-4 pt-2.5 pb-1">
      {children}
    </div>
  );
};

interface SidebarTagProps {
  children: React.ReactNode;
  color?: "gold" | "green";
}

export const SidebarTag = ({ children, color = "gold" }: SidebarTagProps) => {
  const colorClasses =
    color === "gold"
      ? "bg-itec-rewards/15 text-itec-rewards"
      : "bg-itec-groups/15 text-itec-groups";

  return (
    <span className={`ml-auto text-[10px] font-medium px-1.5 py-[2px] rounded-md shrink-0 ${colorClasses}`}>
      {children}
    </span>
  );
};

// ==========================================
// NUEVO COMPONENTE: PROTECTOR DE RUTAS
// ==========================================
interface SidebarProtectProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export const SidebarProtect = ({ children, requireAuth, requireAdmin }: SidebarProtectProps) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  // Si la ruta es solo para admins y el usuario no lo es, ocultamos el ítem
  if (requireAdmin && !isAdmin) return null;

  // Si la ruta requiere estar logueado y el usuario no lo está, ocultamos el ítem
  if (requireAuth && !isAuthenticated) return null;

  return <>{children}</>;
};