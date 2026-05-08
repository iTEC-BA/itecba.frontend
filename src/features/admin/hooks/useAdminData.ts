import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { adminService } from "../services/adminService";

const getToken = async () => {
  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error("No autenticado");
  return token;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const useAdminData = () => {
  const queryClient = useQueryClient();

  // 1. Lista de administradores
  const { data: admins = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["adminUsers"],
    queryFn:  adminService.getAdmins,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Avisos activos
  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ["adminAnnouncements"],
    queryFn:  adminService.getActiveAnnouncements,
  });

  // 3. Stats de recompensas y canjes (endpoint real)
  const { data: rewardsStats } = useQuery({
    queryKey: ["adminRewardsStats"],
    queryFn: async () => {
      const token = await getToken();
      const [rRes, cRes] = await Promise.allSettled([
        fetch(`${API_URL}/rewards/all`,          { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/rewards/redemptions`,  { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const rewards     = rRes.status === "fulfilled" && rRes.value.ok ? await rRes.value.json() : [];
      const redemptions = cRes.status === "fulfilled" && cRes.value.ok ? await cRes.value.json() : [];
      return {
        totalRewards:  Array.isArray(rewards)     ? rewards.length     : 0,
        totalRedeemed: Array.isArray(redemptions) ? redemptions.length : 0,
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // 4. Mutación: buscar usuario por email
  const searchUserMutation = useMutation({
    mutationFn: (email: string) => adminService.searchUserByEmail(email),
  });

  // 5. Mutación: cambiar rol
  const toggleRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "admin" | "student" }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  // 6. Mutación: crear aviso
  const createAnnouncementMutation = useMutation({
    mutationFn: ({
      title, message, hours, isCritical,
    }: { title: string; message: string; hours: number; isCritical: boolean }) =>
      adminService.createAnnouncement(title, message, hours, isCritical),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", "active"] });
    },
    onError: (err) => {
      console.error("Error al crear el aviso:", err);
      alert("Hubo un error al crear el aviso. Revisá la consola.");
    },
  });

  // 7. Mutación: borrar aviso
  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", "active"] });
    },
  });

  const stats = {
    totalUsers:    admins.length,
    totalRewards:  rewardsStats?.totalRewards  ?? 0,
    totalRedeemed: rewardsStats?.totalRedeemed ?? 0,
    totalNews:     announcements.length,
  };

  const loading = isLoadingAdmins || isLoadingAnnouncements;

  return {
    admins,
    isLoadingAdmins,
    announcements,
    isLoadingAnnouncements,
    stats,
    loading,
    searchUserMutation,
    toggleRoleMutation,
    createAnnouncementMutation,
    deleteAnnouncementMutation,
  };
};
