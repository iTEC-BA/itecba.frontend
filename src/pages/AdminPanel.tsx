import React, { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { UserManagement } from '../features/admin/components/organisms/UserManagement';
import { NewsManagement } from '../features/admin/components/organisms/NewsManagement';

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'news'>('users');

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center p-12 bg-itec-surface/50 border border-red-500/10 rounded-[2rem] max-w-md shadow-2xl">
            <span className="text-5xl block mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">🔒</span>
            <h2 className="text-xl font-bold text-white mb-2 tracking-wide">Acceso Restringido</h2>
            <p className="text-gray-400 text-sm leading-relaxed">No tienes los privilegios necesarios para acceder a la configuración global del sistema.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto pb-20 pt-8 px-6 lg:px-0 animate-fade-in">
        
        {/* Encabezado Clean */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-400 text-sm font-medium">Control de accesos y comunicaciones globales.</p>
          </div>

          {/* Segmented Control (Pestañas estilo iOS/SaaS) */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner w-fit">
            <button 
              onClick={() => setActiveTab('users')} 
              className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 outline-none ${
                activeTab === 'users' 
                  ? 'bg-itec-surface text-white shadow-md border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Privilegios
            </button>
            <button 
              onClick={() => setActiveTab('news')} 
              className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 outline-none ${
                activeTab === 'news' 
                  ? 'bg-itec-surface text-white shadow-md border border-white/10' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Avisos Web
            </button>
          </div>
        </header>

        {/* Vista Dinámica */}
        <main className="transition-all duration-500 ease-in-out">
          {activeTab === 'users' ? <UserManagement /> : <NewsManagement />}
        </main>

      </div>
    </DashboardLayout>
  );
};