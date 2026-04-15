// src/features/groups/hooks/useGroups.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService, type GroupData } from '../services/groupsService';

// 1. LECTURAS
export const useApprovedGroups = () => {
  return useQuery({
    queryKey: ['groups', 'approved'],
    queryFn: () => groupsService.getApprovedGroups(),
    staleTime: 1000 * 60 * 30, // Caché de 30 minutos
  });
};

export const usePendingGroups = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['groups', 'pending'],
    queryFn: () => groupsService.getPendingGroups(),
    enabled: isAdmin, // 🔴 OPTIMIZACIÓN: Solo hace fetch si el usuario es Admin
    staleTime: 1000 * 60 * 2, // Caché de 2 minutos
  });
};

// 2. ESCRITURAS (Mutaciones)
export const useSubmitGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, isDirectPublish }: { data: Omit<GroupData, 'id'>, isDirectPublish: boolean }) => 
      groupsService.submitNewGroup(data, isDirectPublish),
    onSuccess: (_, variables) => {
      // Si se publicó directo, actualizamos aprobados. Si no, actualizamos pendientes.
      if (variables.isDirectPublish) {
        queryClient.invalidateQueries({ queryKey: ['groups', 'approved'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['groups', 'pending'] });
      }
    },
  });
};

export const useApprovePendingGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (group: GroupData) => groupsService.approvePendingGroup(group),
    onSuccess: () => {
      // Al aprobar, invalidamos ambas listas para que pasen de una a otra mágicamente
      queryClient.invalidateQueries({ queryKey: ['groups', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'approved'] });
    },
  });
};

export const useRejectPendingGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => groupsService.rejectPendingGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'pending'] });
    },
  });
};