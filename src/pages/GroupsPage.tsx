import React, { Suspense, useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Icons } from '@/components/atoms/Icons';

import { useAuth } from '@/context/AuthContext';
import { GroupFilters } from '@features/groups/components/organisms/GroupFilters';
import { SpecialtyGrid } from '@features/groups/components/organisms/SpecialtyGrid';
import { GroupResults } from '@features/groups/components/organisms/GroupResults';
import { PageHeader } from '@/components/molecules/PageHeader';
import { usePageTitle } from '@/hooks/usePageTitle';

import { useApprovedGroups, usePendingGroups } from '@features/groups/hooks/useGroups';
import { useGroupSearch } from '@features/groups/hooks/useGroupFilters';

const AddGroupModal = React.lazy(() => import('@features/groups/components/organisms/AddGroupModal').then(m => ({ default: m.AddGroupModal })));
const AdminPendingGroupsModal = React.lazy(() => import('@features/groups/components/organisms/AdminPendingGroupsModal').then(m => ({ default: m.AdminPendingGroupsModal })));

export const GroupsPage: React.FC = () => {
  usePageTitle("Grupos de WhatsApp | ITEC");
  const { user, isAdmin } = useAuth();

  const { data: allGroups = [], isLoading: isLoadingGroups } = useApprovedGroups();
  const { data: pendingGroups = [] } = usePendingGroups(isAdmin);
  const pendingCount = (pendingGroups || []).length;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // 🟢 Hook que encapsula toda la lógica de negocio y filtros
  const { filters, filteredResults, hasSearched, handleSpecialtyClick } = useGroupSearch(allGroups);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full pb-10">
        
        <PageHeader 
          title="Grupos de Estudio"
          description="Centralizá tu cursada. Encontrá y unite a los grupos oficiales de WhatsApp de tus materias y comisiones al instante."
          iconType="users"
          colorTheme="green"
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="cursor-pointer bg-slate-900/80 backdrop-blur border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <div className="w-4 h-4"><Icons type="plus" /></div>
              Aportar Grupo
            </button>

            {isAdmin && (
              <button 
                onClick={() => setIsAdminModalOpen(true)} 
                className="cursor-pointer relative bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 hover:-translate-y-0.5"
              >
                Panel Admin
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-[10px] items-center justify-center font-bold shadow-lg border-2 border-emerald-500">
                      {pendingCount > 9 ? '+9' : pendingCount}
                    </span>
                  </span>
                )}
              </button>
            )}
          </div>
        </PageHeader>

        <GroupFilters filters={filters} isLoading={isLoadingGroups} />

        {isLoadingGroups ? (
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
            <div className="relative w-20 h-20 flex items-center justify-center mb-5">
               <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
               <Icons type="whatsapp" className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-white font-bold text-lg mb-1">Sincronizando base de datos...</p>
            <p className="text-slate-500 text-sm">Conectando con la red estudiantil</p>
          </div>
        ) : hasSearched ? (
          <GroupResults 
            results={filteredResults} 
            onClear={filters.handleClear} 
            onAddClick={() => setIsAddModalOpen(true)} 
          />
        ) : (
          <SpecialtyGrid onSpecialtyClick={handleSpecialtyClick} />
        )}

      </div>

      <Suspense fallback={<div className="fixed inset-0 z-[100] bg-slate-950/90" />}>
        {isAddModalOpen && (
          <AddGroupModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            isAdmin={isAdmin} 
            userEmail={user?.email || 'invitado'} 
            existingGroups={allGroups}
          />
        )}
        {isAdminModalOpen && isAdmin && (
          <AdminPendingGroupsModal 
            isOpen={isAdminModalOpen} 
            onClose={() => setIsAdminModalOpen(false)} 
          />
        )}
      </Suspense>
    </DashboardLayout>
  );
};