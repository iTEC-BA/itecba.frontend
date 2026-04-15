import React, { useState, useMemo, Suspense } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Button } from '../components/atoms/Button';
import { useAuth } from '../context/AuthContext';

import { ResourceFilters } from '../features/resources/components/organisms/ResourceFilters';
import { ResourcesTable } from '../features/resources/components/organisms/ResourcesTable';
import { PageHeader } from '../components/molecules/PageHeader';

// Importamos los hooks de caché
import { useResources, usePendingResources } from '../features/resources/hooks/useResources';

const AddResourceModal = React.lazy(() => import('../features/resources/components/organisms/AddResourceModal').then(m => ({ default: m.AddResourceModal })));
const AdminPendingResourcesModal = React.lazy(() => import('../features/resources/components/organisms/AdminPendingResourcesModal').then(m => ({ default: m.AdminPendingResourcesModal })));

export const ResourcesPage: React.FC = () => {
  const { isAdmin } = useAuth();

  //  Adiós useEffects. Hola caché.
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

  // Ordenamos los recursos recientes primero y luego filtramos
  const filteredResources = useMemo(() => {
    // 1. Ordenar (Lo que antes hacías en el .then del fetch)
    const sorted = [...rawResources].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    
    // 2. Filtrar
    return sorted.filter(r => {
      const matchText = searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCarrera = carrera === '' || r.carrera === carrera;
      const matchNivel = nivel === '' || r.nivel === nivel;
      const matchMateria = materia === '' || r.materia.toLowerCase().includes(materia.toLowerCase());
      return matchText && matchCarrera && matchNivel && matchMateria;
    });
  }, [rawResources, searchQuery, carrera, nivel, materia]);

  return (
    <DashboardLayout>
        <PageHeader 
          title="Explorar Aportes"
          description="Resúmenes, parciales y guías compartidas por la comunidad de LA UTN."
          iconType="documentFill"
          colorTheme="orange"
         >
           <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="text-xs bg-orange-600/20 text-orange-500 border-none hover:bg-orange-600 hover:text-white transition-all">
             + Aportar Archivo (+1 Punto)
           </Button>
           {isAdmin && (
            <Button variant="primary" onClick={() => setIsAdminModalOpen(true)} className="relative text-xs bg-itec-surface border-itec-gray hover:bg-itec-gray transition-all shadow-lg">
              Moderar Archivos
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 text-white text-[10px] items-center justify-center font-bold">{pendingCount}</span>
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
            // 🔴 ELIMINADO: onResourceAdded (El invalidateQueries lo hace solo)
          />
        )}
        
        {isAdminModalOpen && isAdmin && (
          <AdminPendingResourcesModal 
            isOpen={isAdminModalOpen} 
            onClose={() => setIsAdminModalOpen(false)} 
            // 🔴 ELIMINADO: onResourceApproved
          />
        )}
      </Suspense>

    </DashboardLayout>
  );
};