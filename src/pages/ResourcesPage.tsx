import React, { useState, useMemo, Suspense } from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { PageHeader } from '@components/ui/PageHeader';
import { Button } from '@components/ui/Button';
import { useAuth } from '@context/AuthContext';
import { usePageTitle } from '@hooks/usePageTitle';
import { ResourceFilters } from '@features/resources/components/organisms/ResourceFilters';
import { ResourcesTable } from '@features/resources/components/organisms/ResourcesTable';
import { useResources, usePendingResources } from '@features/resources/hooks/useResources';

const AddResourceModal = React.lazy(() =>
  import('@features/resources/components/organisms/AddResourceModal')
    .then(m => ({ default: m.AddResourceModal }))
);
const AdminPendingResourcesModal = React.lazy(() =>
  import('@features/resources/components/organisms/AdminPendingResourcesModal')
    .then(m => ({ default: m.AdminPendingResourcesModal }))
);

export const ResourcesPage: React.FC = () => {
  usePageTitle('Aportes de la Comunidad');
  const { isAdmin } = useAuth();

  const { data: rawResources = [], isLoading } = useResources();
  const { data: pendingResources = [] } = usePendingResources(isAdmin);

  const [searchQuery, setSearchQuery] = useState('');
  const [carrera, setCarrera]         = useState('');
  const [nivel, setNivel]             = useState('');
  const [materia, setMateria]         = useState('');
  const [isAddOpen, setIsAddOpen]       = useState(false);
  const [isAdminOpen, setIsAdminOpen]   = useState(false);

  const clearFilters = () => { setSearchQuery(''); setCarrera(''); setNivel(''); setMateria(''); };

  const filteredResources = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return [...rawResources]
      .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      .filter(r =>
        (!q        || r.title.toLowerCase().includes(q)) &&
        (!carrera  || r.carrera === carrera) &&
        (!nivel    || r.nivel === nivel) &&
        (!materia  || r.materia.toLowerCase().includes(materia.toLowerCase()))
      );
  }, [rawResources, searchQuery, carrera, nivel, materia]);

  return (
    <MainLayout>
      <PageHeader
        title="BiblioTEC"
        description="Apuntes, parciales y guías compartidos por la comunidad de la UTN FRBA."
        iconType="folder"
        colorTheme="orange"
      >
        <Button
          onClick={() => setIsAddOpen(true)}
          className="text-sm bg-orange-600 hover:bg-orange-500 border-none text-itec-text font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-900/30"
        >
          Aportar · +1 Punto
        </Button>

        {isAdmin && (
          <div className="relative">
            <Button
              onClick={() => setIsAdminOpen(true)}
              className="text-sm bg-itec-box border border-itec-gray/40 hover:border-orange-500/50 text-itec-text px-4 py-2 rounded-xl transition-all"
            >
              Moderar Aportes
            </Button>
            {pendingResources.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 text-itec-text text-[10px] font-bold items-center justify-center">
                  {pendingResources.length}
                </span>
              </span>
            )}
          </div>
        )}
      </PageHeader>

      {/* ── Filtros ─────────────────────────────────────────────────────────── */}
      <ResourceFilters
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        carrera={carrera}         setCarrera={setCarrera}
        nivel={nivel}             setNivel={setNivel}
        materia={materia}         setMateria={setMateria}
        onClear={clearFilters}
        totalVisible={filteredResources.length}
      />

      {/* ── Lista / Tabla ───────────────────────────────────────────────────── */}
      <ResourcesTable
        resources={filteredResources}
        isLoading={isLoading}
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* ── Modales (lazy) ──────────────────────────────────────────────────── */}
      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
        {isAddOpen && (
          <AddResourceModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} isAdmin={isAdmin} />
        )}
        {isAdminOpen && isAdmin && (
          <AdminPendingResourcesModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        )}
      </Suspense>
    </MainLayout>
  );
};
