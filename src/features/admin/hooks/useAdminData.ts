import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useAdminData = () => {
  const queryClient = useQueryClient();

  // 1. Obtener Lista de Administradores
  const { data: admins = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getAdmins,
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });

  // 2. Obtener Lista de Avisos
const { data: announcements = [], isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['adminAnnouncements'],
    queryFn: adminService.getActiveAnnouncements,
  });

  // 3. Mutación: Buscar Usuario por Email
  const searchUserMutation = useMutation({
    mutationFn: (email: string) => adminService.searchUserByEmail(email),
  });

  // 4. Mutación: Cambiar Rol de Usuario
  const toggleRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'admin' | 'student' }) => 
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      // Invalida la lista de admins para que se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

const createAnnouncementMutation = useMutation({
    mutationFn: ({ title, message, hours, isCritical }: { title: string, message: string, hours: number, isCritical: boolean }) =>
      adminService.createAnnouncement(title, message, hours, isCritical),
    onSuccess: () => {
      console.log("✅ Aviso creado con éxito. Refrescando caché...");
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', 'active'] }); // Refresca el home también
    },
    onError: (err) => {
      console.error("❌ Mutación fallida (Crear Aviso):", err);
      alert("Hubo un error al crear el aviso. Revisa la consola.");
    }
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements', 'active'] });
    },
  });
  return {
    admins,
    isLoadingAdmins,
    announcements,
    isLoadingAnnouncements,
    searchUserMutation,
    toggleRoleMutation,
    createAnnouncementMutation,
    deleteAnnouncementMutation
  };
};