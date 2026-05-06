import React, { useState, useMemo, Suspense } from 'react';
import { PageHeader } from '@components/ui/PageHeader';
import { MainLayout } from '@/components/templates/MainLayout';
import { Button } from '@components/ui/Button';
import { useAuth } from '@context/AuthContext';

import { ResourceFilters } from '@features/resources/components/organisms/ResourceFilters';
import { ResourcesTable } from '@features/resources/components/organisms/ResourcesTable';

// Importamos los hooks de caché
import { useResources, usePendingResources } from '@features/resources/hooks/useResources';

const AddResourceModal = React.lazy(() => import('@features/resources/components/organisms/AddResourceModal').then(m => ({ default: m.AddResourceModal })));
const AdminPendingResourcesModal = React.lazy(() => import('@features/resources/components/organisms/AdminPendingResourcesModal').then(m => ({ default: m.AdminPendingResourcesModal })));

export const ResourcesPage: React.FC = () => {
  const { isAdmin } = useAuth();

  //  React Query: Para usar la cache del usuario
  const { data: rawResources = [], isLoading } = useResources();
  const { data: pendingResources = [] } = usePendingResources(isAdmin);
  const pendingCount = pendingResources.length;

  // Estados de Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');

  // Estados de Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleClearFilters = () => {
    setSearchQuery(''); setCarrera(''); setNivel(''); setMateria('');
  };

  const filteredResources = useMemo(() => {
    const sorted = [...rawResources].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    return sorted.filter(r => {
      const matchText = searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCarrera = carrera === '' || r.carrera === carrera;
      const matchNivel = nivel === '' || r.nivel === nivel;
      const matchMateria = materia === '' || r.materia.toLowerCase().includes(materia.toLowerCase());
      return matchText && matchCarrera && matchNivel && matchMateria;
    });
  }, [rawResources, searchQuery, carrera, nivel, materia]);

  return (
    <MainLayout>
        <PageHeader 
          title="Explorar Aportes"
          description="Resúmenes, parciales y guías compartidas por la comunidad de LA UTN."
          iconType="documentFill"
          colorTheme="orange"
         >
           <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="text-xs bg-orange-600/20 text-orange-500 border-none hover:bg-orange-600 hover:text-itec-texttransition-all">
             + Aportar Archivo (+1 Punto)
           </Button>
           {isAdmin && (
            <Button variant="primary" onClick={() => setIsAdminModalOpen(true)} className="relative text-xs bg-itec-box border-itec-gray hover:bg-itec-gray transition-all shadow-lg">
              Moderar Archivos
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 text-itec-texttext-[10px] items-center justify-center font-bold">{pendingCount}</span>
                </span>
              )}
            </Button>
          )}
        </PageHeader>

        <ResourceFilters 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          carrera={carrera} setCarrera={setCarrera}
          nivel={nivel} setNivel={setNivel}
          materia={materia} setMateria={setMateria}
          onClear={handleClearFilters}
        />

        <ResourcesTable 
          resources={filteredResources} 
          isLoading={isLoading} 
          onAddClick={() => setIsAddModalOpen(true)} 
        />

      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
        {isAddModalOpen && (
          <AddResourceModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            isAdmin={isAdmin}
          />
        )}
        
        {isAdminModalOpen && isAdmin && (
          <AdminPendingResourcesModal 
            isOpen={isAdminModalOpen} 
            onClose={() => setIsAdminModalOpen(false)}
          />
        )}
      </Suspense>

    </MainLayout>
  );
};