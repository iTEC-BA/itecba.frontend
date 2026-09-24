import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/stores/authStore";

export type Permission =
  | "admin.panel"
  | "courses.edit"
  | "courses.manage"
  | "resources.manage"
  | "users.manage";

const permissionsByRole: Record<Role, readonly Permission[]> = {
  admin: ["admin.panel", "courses.edit", "courses.manage", "resources.manage", "users.manage"],
  moderator: ["admin.panel", "courses.edit", "users.manage"],
  student: [],
  ingresante: [],
  afiliado: [],
  profesor: [],
};

export const hasPermission = (
  role: Role | null | undefined,
  permission: Permission,
): boolean => Boolean(role && permissionsByRole[role]?.includes(permission));

export const useAuthorization = () => {
  const { user, isAuthenticated } = useAuthStore();

  const can = (permission: Permission) =>
    isAuthenticated && hasPermission(user?.role, permission);

  return {
    role: user?.role ?? null,
    isAuthenticated,
    can,
  };
};
