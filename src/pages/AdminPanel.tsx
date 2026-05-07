import React, { useState, lazy } from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { useAuth } from '@context/AuthContext';

// Importaciones Lazy
const UserManagement = lazy(() => import("@features/admin/components/organisms/UserManagement").then(m => ({ default: m.UserManagement })));
const NewsManagement = lazy(() => import("@features/admin/components/organisms/NewsManagement").then(m => ({ default: m.NewsManagement })));
const RewardsManagement = lazy(() => import("@features/admin/components/organisms/RewardsManagement").then(m => ({ default: m.RewardsManagement })));
const AdminRedemptions = lazy(() => import("@features/admin/components/organisms/AdminRedemptions").then(m => ({ default: m.AdminRedemptions }))); // <-- NUEVO
const AdminMaterias = lazy(() => import("@features/admin/components/organisms/AdminMaterias").then(m => ({ default: m.AdminMaterias })));

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  // Agregamos 'redemptions' a los tabs
  const [activeTab, setActiveTab] = useState<'users' | 'news' | 'rewards' | 'redemptions' | 'materias'>('users');

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center p-12 bg-itec-box/50 border border-red-500/10 rounded-[2rem] max-w-md shadow-2xl">
            <span className="text-5xl block mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">🔒</span>
            <h2 className="text-xl font-bold text-itec-textmb-2 tracking-wide">Acceso Restringido</h2>
            <p className="text-itec-text text-sm leading-relaxed">No tienes los privilegios necesarios para acceder a la configuración global del sistema.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1100px] mx-auto pb-20 pt-8 px-6 lg:px-0 animate-fade-in">
        
        {/* Encabezado Clean */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-itec-texttracking-tight mb-2">
              Panel de Administración
            </h1>
            <p className="text-itec-text text-sm font-medium">Control de accesos y comunicaciones globales.</p>
          </div>

          {/* Segmented Control (Pestañas estilo iOS/SaaS) */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner w-fit overflow-x-auto">
            <button 
              onClick={() => setActiveTab('users')} 
              className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 outline-none whitespace-nowrap ${
                activeTab === 'users' 
                  ? 'bg-itec-box text-itec-textshadow-md border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Privilegios
            </button>
            <button 
              onClick={() => setActiveTab('news')} 
              className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 outline-none whitespace-nowrap ${
                activeTab === 'news' 
                  ? 'bg-itec-box text-itec-textshadow-md border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Avisos Web
            </button>
            <button 
              onClick={() => setActiveTab('rewards')} 
              className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 outline-none whitespace-nowrap ${
                activeTab === 'rewards' 
                  ? 'bg-itec-box text-itec-textshadow-md border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Beneficios
            </button>
            <button 
              onClick={() => setActiveTab('redemptions')} 
              className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 outline-none whitespace-nowrap ${
                activeTab === 'redemptions' ? 'bg-itec-box text-itec-textshadow-md border border-white/10' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Historial de Canjes
            </button>
            <button 
              onClick={() => setActiveTab('materias')} 
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'materias' ? 'bg-white/10 text-white shadow-md' : 'text-itec-text/60 hover:text-white hover:bg-white/5'}`}
            >
              Académico
            </button>
          </div>
        </header>

        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'news' && <NewsManagement />}
          {activeTab === 'rewards' && <RewardsManagement />}
          {activeTab === 'redemptions' && <AdminRedemptions />}
          {activeTab === 'materias' && <AdminMaterias />}
        </div>

      </div>
    </MainLayout>
  );
};