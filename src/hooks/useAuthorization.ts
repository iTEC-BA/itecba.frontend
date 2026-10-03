import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { auth } from "@lib/firebase";
import type { Role } from "@/stores/authStore";

export type Permission = string;

const permissionsByRole: Record<Role, readonly Permission[]> = {
  admin: [
    "admin.panel",
    "courses.edit",
    "courses.manage",
    "resources.manage",
    "users.manage",
    "roles.manage",
    "publications.manage",
    "announcements.manage",
  ],
  moderator: [
    "admin.panel",
    "courses.edit",
    "courses.manage",
    "resources.manage",
    "users.manage",
    "roles.manage",
    "publications.manage",
    "announcements.manage",
  ],
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
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadPermissions = async () => {
      if (!isAuthenticated) {
        setPermissions([]);
        setPermissionsLoaded(false);
        return;
      }
      try {
        await auth.authStateReady();
        const token = await auth.currentUser?.getIdToken();
        if (!token) {
          setPermissionsLoaded(false);
          return;
        }
        const base = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
        const response = await fetch(`${base}/roles/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json() as { permissions?: string[] };
        if (!cancelled) {
          setPermissions((data.permissions || []) as Permission[]);
          setPermissionsLoaded(true);
        }
      } catch (error) {
        console.error("No se pudieron cargar los permisos del usuario:", error);
        if (!cancelled) {
          setPermissions([]);
          setPermissionsLoaded(false);
        }
      }
    };
    loadPermissions();
    return () => { cancelled = true; };
  }, [isAuthenticated, user?.role]);

  const can = (permission: Permission) =>
    isAuthenticated && (permissionsLoaded ? permissions.includes(permission) : hasPermission(user?.role, permission));

  return {
    role: user?.role ?? null,
    isAuthenticated,
    permissions,
    permissionsLoaded,
    can,
  };
};
