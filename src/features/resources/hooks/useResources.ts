import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesService, type ResourceData } from '../services/resourcesService';

/* ── QUERIES ─────────────────────────────────────────────────────────────── */
export const useResources = () =>
  useQuery({
    queryKey: ['resources', 'approved'],
    queryFn: () => resourcesService.getApprovedResources(),
    staleTime: 1000 * 60 * 30,
  });

export const usePendingResources = (isAdmin: boolean) =>
  useQuery({
    queryKey: ['resources', 'pending'],
    queryFn: () => resourcesService.getPendingResources(),
    enabled: isAdmin,
    staleTime: 1000 * 60 * 2,
  });

/* ── MUTATIONS ───────────────────────────────────────────────────────────── */
export const useSubmitResource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      isDirectPublish,
    }: {
      data: Omit<ResourceData, 'id'>;
      isDirectPublish: boolean;
    }) => resourcesService.submitNewResource(data, isDirectPublish),
    onSuccess: (_, { isDirectPublish }) => {
      qc.invalidateQueries({
        queryKey: ['resources', isDirectPublish ? 'approved' : 'pending'],
      });
    },
  });
};

export const useApprovePendingResource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (resource: ResourceData) =>
      resourcesService.approvePendingResource(resource),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resources', 'pending'] });
      qc.invalidateQueries({ queryKey: ['resources', 'approved'] });
    },
  });
};

export const useRejectPendingResource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resourcesService.rejectPendingResource(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resources', 'pending'] });
    },
  });
};
