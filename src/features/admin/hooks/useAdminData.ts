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

  // 5. Mutación: Crear Aviso
  const createAnnouncementMutation = useMutation({
    mutationFn: ({ title, message, hours }: { title: string, message: string, hours: number }) =>
      adminService.createAnnouncement(title, message, hours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
    },
  });

  // 6. Mutación: Borrar Aviso
  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
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