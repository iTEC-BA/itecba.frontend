// src/pages/AdminPanel.tsx
// Panel de administración basado en subrutas (/admin/*): cada sección vive en
// su propia URL (ej: /admin/usuarios, /admin/avisos) y es accesible de forma
// directa. La navegación se controla íntegramente vía react-router-dom
// (useNavigate/useLocation dentro de useAdminSidebar + <Outlet/> acá abajo).
import React from "react";
import { Routes, Route, Navigate, Outlet, useOutletContext } from "react-router-dom";
import { MainLayout } from "@components/templates/MainLayout";
import { HamburgerButton } from "@features/admin/components/atoms";
import {
  AdminSidebar,
  TutoriasSection,
} from "@features/admin/components/organisms";
import { AdminDashboard } from "@features/admin/pages/AdminDashboard";
import { UserManagement } from "@features/admin/pages/UserManagement";
import { NewsManagement } from "@features/admin/pages/NewsManagement";
import { BenefitsManagement } from "@features/admin/pages/BenefitsManagement";
import { RewardsManagement } from "@/features/admin/pages/RewardsManagement";
import { AdminRedemptions } from "@features/admin/pages/AdminRedemptions";
import { useAdminSidebar, type AdminSection } from "@features/admin/hooks/useAdminSidebar";

interface AdminOutletContext {
  navigate: (section: AdminSection) => void;
}

// ── Layout compartido: header móvil + sidebar (drawer) + contenido de la subruta activa ──
const AdminLayout: React.FC = () => {
  const { active, navigate, isOpen, toggle, close } = useAdminSidebar();

  return (
    <MainLayout>
      <div className="relative flex flex-col gap-6">
        {/* Header: abre/cierra el drawer del sidebar de admin */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-itec-muted">
              Admin
            </p>
            <h1 className="text-xl font-bold text-itec-text">Panel de control</h1>
          </div>
          <HamburgerButton open={isOpen} onToggle={toggle} />
        </div>

        <AdminSidebar active={active} onNavigate={navigate} isOpen={isOpen} onClose={close} />

        <div className="flex-1">
          <Outlet context={{ navigate }} />
        </div>
      </div>
    </MainLayout>
  );
};

// AdminDashboard necesita "onNavigate" para sus accesos rápidos: lo toma del
// contexto que expone el <Outlet/> de AdminLayout.
const DashboardRoute: React.FC = () => {
  const { navigate } = useOutletContext<AdminOutletContext>();
  return <AdminDashboard onNavigate={navigate} />;
};

export const AdminPanel: React.FC = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardRoute />} />
      <Route path="usuarios" element={<UserManagement />} />
      <Route path="avisos" element={<NewsManagement />} />
      <Route path="beneficios" element={<BenefitsManagement />} />
      <Route path="recompensas" element={<RewardsManagement />} />
      <Route path="canjes" element={<AdminRedemptions />} />
      <Route path="tutorias" element={<TutoriasSection />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Routes>
);

export default AdminPanel;
