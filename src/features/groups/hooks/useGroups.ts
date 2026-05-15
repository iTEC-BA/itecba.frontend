import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsService, type GroupData } from '../services/groupsService';

export const useGroupStats = (enabled: boolean) =>
  useQuery({
    queryKey: ['groups', 'stats'],
    queryFn:  () => groupsService.getStats(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

export const usePendingGroups = (isAdmin: boolean) =>
  useQuery({
    queryKey: ['groups', 'pending'],
    queryFn:  () => groupsService.getPendingGroups(),
    enabled:  isAdmin,
    staleTime: 1000 * 60 * 2,
  });

export const useReportedGroups = (isAdmin: boolean) =>
  useQuery({
    queryKey: ['groups', 'reported'],
    queryFn:  () => groupsService.getReportedGroups(),
    enabled:  isAdmin,
    staleTime: 1000 * 60 * 2,
  });

export const useSubmitGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, isDirectPublish }: { data: Omit<GroupData, 'id'>; isDirectPublish: boolean }) =>
      groupsService.submitNewGroup(data, isDirectPublish),
    onSuccess: (_, vars) => {
      if (vars.isDirectPublish) qc.invalidateQueries({ queryKey: ['groups'] });
      else qc.invalidateQueries({ queryKey: ['groups', 'pending'] });
    },
  });
};

export const useApprovePendingGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (group: GroupData) => groupsService.approvePendingGroup(group),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups', 'pending'] });
      qc.invalidateQueries({ queryKey: ['groups', 'stats'] });
    },
  });
};

export const useRejectPendingGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupsService.rejectPendingGroup(groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups', 'pending'] });
      qc.invalidateQueries({ queryKey: ['groups', 'stats'] });
    },
  });
};

export const useUpdateGroupLink = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, link }: { id: string; link: string }) => groupsService.updateGroupLink(id, link),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups', 'reported'] });
    },
  });
};

export const useReportGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason, email }: { id: string; reason: string; email?: string }) =>
      groupsService.reportGroup(id, reason, email),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups', 'stats'] }),
  });
};
