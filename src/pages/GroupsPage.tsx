import React, { useState, Suspense } from 'react';
import { MainLayout } from '@components/templates/MainLayout';
import { PageHeader } from '@components/ui/PageHeader';
import { Icons } from '@components/ui/icons/Icons';
import { useAuth } from '@context/AuthContext';
import { usePendingGroups, useGroupStats } from '@features/groups/hooks/useGroups';
import { useGroupSearch } from '@features/groups/hooks/useGroupFilters';
import { GroupFilters } from '@features/groups/components/organisms/GroupFilters';
import { GroupResults } from '@features/groups/components/organisms/GroupResults';
import { SpecialtyGrid } from '@features/groups/components/organisms/SpecialtyGrid';
import { GroupsStatsBar } from '@features/groups/components/molecules/GroupsStatsBar';
import { usePageTitle } from '@hooks/usePageTitle';
import { Button } from '@/components/ui/Button';

const AddGroupModal = React.lazy(() =>
  import('@features/groups/components/organisms/AddGroupModal').then(m => ({ default: m.AddGroupModal }))
);
const AdminPendingGroupsModal = React.lazy(() =>
  import('@features/groups/components/organisms/AdminPendingGroupsModal').then(m => ({ default: m.AdminPendingGroupsModal }))
);
const AdminMateriasModal = React.lazy(() =>
  import('@features/groups/components/organisms/AdminMateriasModal').then(m => ({ default: m.AdminMateriasModal }))
);

export const GroupsPage: React.FC = () => {
  usePageTitle('Grupos de WhatsApp');
  const { isAdmin, user } = useAuth();

  // Stats globales solo para admin (endpoint liviano)
  const { data: groupStats } = useGroupStats(!!isAdmin);
  // Pendientes para badge del botón de moderación
  const { data: pendingGroups = [] } = usePendingGroups(!!isAdmin);

  const [isAddOpen,      setIsAddOpen]      = useState(false);
  const [isAdminOpen,    setIsAdminOpen]    = useState(false);
  const [isMateriasOpen, setIsMateriasOpen] = useState(false);

  const {
    filters,
    filteredResults,
    pagination,
    hasSearched,
    isSearching,
    searchError,
    handlePageChange,
    handleSpecialtyClick,
  } = useGroupSearch();

  return (
    <MainLayout>
      <PageHeader
        title="Grupos de WhatsApp"
        description="Comunidades de materias y comisiones de la UTN FRBA. Encontrá tu grupo o sumá uno nuevo."
        iconType="users"
        colorTheme="green"
      >
        {/* Botón aportar */}
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 text-xs font-bold bg-itec-groups hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-[0_0_15px_rgba(0,136,84,0.3)] active:scale-95"
        >
          <Icons type="plus" className="w-3.5 h-3.5" />
          Aportar grupo
        </Button>

        {isAdmin && (
          <>
            <Button
              onClick={() => setIsMateriasOpen(true)}
              className="flex items-center gap-2 text-xs font-bold bg-itec-box border border-itec-border hover:border-itec-groups/40 text-itec-gray hover:text-itec-text px-4 py-2.5 rounded-xl transition-all"
            >
              <Icons type="book" className="w-3.5 h-3.5" />
              Materias
            </Button>

            <div className="relative">
              <Button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-2 text-xs font-bold bg-itec-box border border-itec-border hover:border-itec-groups/40 text-itec-gray hover:text-itec-text px-4 py-2.5 rounded-xl transition-all"
              >
                <Icons type="settings" className="w-3.5 h-3.5" />
                Moderación
              </Button>
              {pendingGroups.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-itec-red text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-itec-bg animate-pulse">
                  {pendingGroups.length}
                </span>
              )}
            </div>
          </>
        )}
      </PageHeader>

      {/* Stats bar (admin, cargadas desde endpoint liviano) */}
      {isAdmin && groupStats && <GroupsStatsBar stats={groupStats} />}

      {/* Filtros de búsqueda */}
      <GroupFilters filters={filters} isLoading={isSearching} />

      {/* Resultados o grid de especialidades */}
      {hasSearched ? (
        <GroupResults
          results={filteredResults}
          onClear={filters.handleClear}
          onAddClick={() => setIsAddOpen(true)}
          isLoading={isSearching}
          searchError={searchError}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      ) : (
        <SpecialtyGrid onSpecialtyClick={handleSpecialtyClick} />
      )}

      {/* Modales */}
      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />}>
        {isAddOpen && (
          <AddGroupModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            isAdmin={!!isAdmin}
            userEmail={user?.email || ''}
            existingGroups={[]}
          />
        )}
        {isAdminOpen && isAdmin && (
          <AdminPendingGroupsModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        )}
        {isMateriasOpen && isAdmin && (
          <AdminMateriasModal isOpen={isMateriasOpen} onClose={() => setIsMateriasOpen(false)} />
        )}
      </Suspense>
    </MainLayout>
  );
};
