import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { adminService } from "../services/adminService";

const getToken = async () => {
  const token = await getAuth().currentUser?.getIdToken();
  if (!token) throw new Error("No autenticado");
  return token;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const BASE_URL = API_URL.replace('/api', ''); // Para acceder a /health

export const useAdminData = () => {
  const queryClient = useQueryClient();

  const { data: admins = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["adminUsers"],
    queryFn:  adminService.getAdmins,
    staleTime: 1000 * 60 * 5,
  });

  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ["adminAnnouncements"],
    queryFn:  adminService.getActiveAnnouncements,
  });

  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const token = await getToken();

      const [rRes, cRes, brokenRes, aulasRes, pendingResRes, forumRes, healthRes, usersCountRes] = await Promise.allSettled([
        fetch(`${API_URL}/rewards/all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/rewards/redemptions`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/courses/admin/broken-videos`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/aulas/all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/resources/pending`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/forum/posts`),
        fetch(`${BASE_URL}/health`),
        fetch(`${API_URL}/users/count`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const rewards     = rRes.status === "fulfilled" && rRes.value.ok ? await rRes.value.json() : [];
      const redemptions = cRes.status === "fulfilled" && cRes.value.ok ? await cRes.value.json() : [];
      const brokenData  = brokenRes.status === "fulfilled" && brokenRes.value.ok ? await brokenRes.value.json() : { total: 0 };
      const aulasData   = aulasRes.status === "fulfilled" && aulasRes.value.ok ? await aulasRes.value.json() : { aulas: [] };
      const pendingRes  = pendingResRes.status === "fulfilled" && pendingResRes.value.ok ? await pendingResRes.value.json() : [];
      const forumData   = forumRes.status === "fulfilled" && forumRes.value.ok ? await forumRes.value.json() : { total: 0 };
      const isHealthy   = healthRes.status === "fulfilled" && healthRes.value.ok;
      const healthData  = isHealthy ? await healthRes.value.json().catch(() => null) : null;

      // dbStatus ahora refleja el estado REAL de Mongo (healthData.database.ok),
      // no simplemente "el server contestó". Si el server está caído, ambos
      // se muestran caídos porque no hay forma de saber el estado de la DB.
      const isDbOk = healthData?.database?.ok ?? false;

      const usersCountData = usersCountRes.status === "fulfilled" && usersCountRes.value.ok
        ? await usersCountRes.value.json()
        : { total: null };

      return {
        totalRewards:   Array.isArray(rewards) ? rewards.length : 0,
        totalRedeemed:  Array.isArray(redemptions) ? redemptions.length : 0,
        reportedVideos: brokenData.total ?? 0,
        classrooms:     aulasData.aulas?.length ?? 0,
        reportedFiles:  Array.isArray(pendingRes) ? pendingRes.length : 0,
        questions:      forumData.total ?? 0,
        serverStatus:   isHealthy ? "En línea" : "Caído",
        dbStatus:       !isHealthy ? "Caído" : (isDbOk ? "En línea" : "Inestable"),
        totalUsers:     usersCountData.total ?? null,
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const searchUserMutation = useMutation({
    mutationFn: (email: string) => adminService.searchUserByEmail(email),
  });

  const toggleRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "admin" | "student" }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: ({ title, message, hours, isCritical }: { title: string; message: string; hours: number; isCritical: boolean }) =>
      adminService.createAnnouncement(title, message, hours, isCritical),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", "active"] });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", "active"] });
    },
  });

  const stats = {
    totalAdmins:    admins.length,
    totalRewards:   dashboardStats?.totalRewards  ?? 0,
    totalRedeemed:  dashboardStats?.totalRedeemed ?? 0,
    totalNews:      announcements.length,
    reportedVideos: dashboardStats?.reportedVideos ?? 0,
    classrooms:     dashboardStats?.classrooms ?? 0,
    reportedFiles:  dashboardStats?.reportedFiles ?? 0,
    questions:      dashboardStats?.questions ?? 0,
    serverStatus:   dashboardStats?.serverStatus ?? "Conectando...",
    dbStatus:       dashboardStats?.dbStatus ?? "Conectando...",
    totalUsers:     dashboardStats?.totalUsers ?? 0,

    // Aún requiere de un endpoint futuro en el backend
    webVisits:      15420,
  };

  const loading = isLoadingAdmins || isLoadingAnnouncements || isLoadingStats;

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