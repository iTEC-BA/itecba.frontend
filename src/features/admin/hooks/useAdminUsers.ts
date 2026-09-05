import { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import type { User } from '@/stores/authStore';

export const useAdminUsers = (isAdmin: boolean) => {
  // Estado de Admins
  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

  // Estado del Buscador
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); 

  const loadAdmins = async () => {
    setIsLoadingAdmins(true);
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (e) {
      console.error("Error cargando admins");
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAdmins();
  }, [isAdmin]);

  const searchUser = async (email: string) => {
    if (!email) return;
    setIsSearching(true);
    setError(null);
    try {
      const user = await adminService.searchUserByEmail(email);
      if (user) setSearchedUser(user);
      else {
        setSearchedUser(null);
        setError("Usuario no encontrado.");
      }
    } catch (err) {
      setError("Error en la búsqueda.");
    } finally {
      setIsSearching(false);
    }
  };

  const changeUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    const actionText =
      newRole === "admin"
        ? "ASCENDER a Administrador"
        : "REVOCAR permisos de Admin";

    if (!window.confirm(`¿Confirmas ${actionText} a este usuario?`)) return;

    setIsUpdating(userId);
    try {
      await adminService.updateUserRole(userId, newRole);

      // Actualizamos los estados locales sin recargar la página
      if (searchedUser?.id === userId) {
        setSearchedUser({ ...searchedUser, role: newRole });
      }

      if (newRole === "student") {
        setAdmins((prev) => prev.filter((a) => a.id !== userId));
      } else {
        // Si lo hicimos admin y no está en la lista, recargamos la lista
        loadAdmins();
      }
    } catch (e) {
      alert("Error de permisos.");
    } finally {
      setIsUpdating(null);
    }
  };

  const clearSearch = () => {
    setSearchedUser(null);
    setError(null);
  };

  return {
    admins,
    isLoadingAdmins,
    searchedUser,
    isSearching,
    error,
    isUpdating,
    searchUser,
    changeUserRole,
    clearSearch,
  };
};
