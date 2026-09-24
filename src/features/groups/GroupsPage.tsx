// src/pages/GroupsPage.tsx
import React, { useState, Suspense } from "react";
import { MainLayout }       from "@components/templates/MainLayout";
import { PageHeader }       from "@components/ui/PageHeader";
import { Icons }            from "@components/ui/icons/Icons";
import { Button }           from "@/components/ui/Button";
import { useAuthStore } from '@/stores/authStore';
import { usePendingGroups, useGroupStats } from "@features/groups/hooks/useGroups";
import { useGroupSearch }   from "@features/groups/hooks/useGroupFilters";
import { GroupFilters }     from "@features/groups/components/organisms/GroupFilters";
import { GroupResults }     from "@features/groups/components/organisms/GroupResults";
import { WhatsAppGroupsList }    from "@/features/groups/components/organisms/WhatsAppGroupsList";
import { GroupsStatsBar }   from "@features/groups/components/molecules/GroupsStatsBar";
import { usePageTitle }     from "@hooks/usePageTitle";
import { ToastProvider }    from "@features/notifications/components/atoms/Toast";

const AddGroupModal = React.lazy(() =>
  import("@features/groups/components/organisms/AddGroupModal").then((m) => ({ default: m.AddGroupModal }))
);
const AdminPendingGroupsModal = React.lazy(() =>
  import("@features/groups/components/organisms/AdminPendingGroupsModal").then((m) => ({ default: m.AdminPendingGroupsModal }))
);
const AdminMateriasModal = React.lazy(() =>
  import("@features/groups/components/organisms/AdminMateriasModal").then((m) => ({ default: m.AdminMateriasModal }))
);

const PendingBadge: React.FC<{ count: number }> = ({ count }) =>
  count > 0 ? (
    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-itec-red text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-itec-bg animate-pulse">
      {count}
    </span>
  ) : null;

const GroupsPageContent: React.FC = () => {
  usePageTitle("Grupos de WhatsApp");
  const { isAdmin, user } = useAuthStore();
  const { data: groupStats }         = useGroupStats(!!isAdmin);
  const { data: pendingGroups = [] } = usePendingGroups(!!isAdmin);

  const [isAddOpen,      setIsAddOpen]      = useState(false);
  const [isAdminOpen,    setIsAdminOpen]    = useState(false);
  const [isMateriasOpen, setIsMateriasOpen] = useState(false);

  const { filters, filteredResults, pagination, hasSearched, isSearching, searchError, handlePageChange } = useGroupSearch();

  return (
    <MainLayout>
      <PageHeader title="Grupos de WhatsApp" description="Comunidades de materias y comisiones de la UTN FRBA." iconType="users" colorTheme="green" >
        <Button onClick={() => setIsAddOpen(true)} className="flex items-center bg-itec-groups hover:bg-emerald-500 active:scale-95">
          <Icons type="plus" className="size-4" />Aportar grupo
        </Button>
        {isAdmin && (
          <>
            <Button onClick={() => setIsMateriasOpen(true)} variant="danger" hierarchy="solid">
              <Icons type="book" className="w-3.5 h-3.5" />Materias
            </Button>
            <div className="relative">
              <Button onClick={() => setIsAdminOpen(true)} variant="danger" hierarchy="solid">
                <Icons type="settings" className="w-3.5 h-3.5" />Moderación
              </Button>
              <PendingBadge count={pendingGroups.length} />
            </div>
          </>
        )}
      </PageHeader>

      {isAdmin && groupStats && <GroupsStatsBar stats={groupStats} />}
      <GroupFilters filters={filters} isLoading={isSearching} />

      {hasSearched ? (
        <GroupResults results={filteredResults} onClear={filters.handleClear} onAddClick={() => setIsAddOpen(true)} isLoading={isSearching} searchError={searchError} pagination={pagination} onPageChange={handlePageChange} />
      ) : (
        <WhatsAppGroupsList />
      )}

      {isAddOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60 " />}>
          <AddGroupModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} isAdmin={!!isAdmin} userEmail={user?.email ?? ""} existingGroups={[]} />
        </Suspense>
      )}
      {isAdminOpen && isAdmin && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60 " />}>
          <AdminPendingGroupsModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </Suspense>
      )}
      {isMateriasOpen && isAdmin && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60 " />}>
          <AdminMateriasModal isOpen={isMateriasOpen} onClose={() => setIsMateriasOpen(false)} />
        </Suspense>
      )}
    </MainLayout>
  );
};

export const GroupsPage: React.FC = () => (
  <ToastProvider><GroupsPageContent /></ToastProvider>
);
