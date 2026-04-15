import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesService, type ResourceData } from '../services/resourcesService';

// 1. LECTURAS
export const useResources = () => {
  return useQuery({
    queryKey: ['resources', 'approved'],
    queryFn: () => resourcesService.getApprovedResources(),
    staleTime: 1000 * 60 * 30, // Caché de 30 minutos (los apuntes no se borran casi nunca)
  });
};

export const usePendingResources = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['resources', 'pending'],
    queryFn: () => resourcesService.getPendingResources(),
    enabled: isAdmin, // Solo consumimos base de datos si el usuario es Admin
    staleTime: 1000 * 60 * 2, // Caché de 2 minutos para pendientes
  });
};

// 2. ESCRITURAS (Mutaciones)
export const useSubmitResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, isDirectPublish }: { data: Omit<ResourceData, 'id'>, isDirectPublish: boolean }) => 
      resourcesService.submitNewResource(data, isDirectPublish),
    onSuccess: (_, variables) => {
      // Invalida la lista correspondiente según si se publicó directo o fue a revisión
      if (variables.isDirectPublish) {
        queryClient.invalidateQueries({ queryKey: ['resources', 'approved'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['resources', 'pending'] });
      }
    },
  });
};

export const useApprovePendingResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resource: ResourceData) => resourcesService.approvePendingResource(resource),
    onSuccess: () => {
      // Pasa mágicamente de pendientes a aprobados en toda la app
      queryClient.invalidateQueries({ queryKey: ['resources', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['resources', 'approved'] });
    },
  });
};

export const useRejectPendingResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resourcesService.rejectPendingResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', 'pending'] });
    },
  });
};