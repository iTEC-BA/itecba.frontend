import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAdminSidebar, type AdminSection } from "@features/admin/hooks/useAdminSidebar";
import { AdminSidebar } from "@features/admin/components/organisms/AdminSidebar";
import { HamburgerButton } from "@features/admin/components/atoms";

const AdminDashboard = lazy(() => import("@features/admin/pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import("@features/admin/pages/UserManagement").then(m => ({ default: m.UserManagement })));
const NewsManagement = lazy(() => import("@features/admin/pages/NewsManagement").then(m => ({ default: m.NewsManagement })));
const BenefitManagement = lazy(() => import("@features/admin/pages/BenefitManagement").then(m => ({ default: m.BenefitManagement })));
const AdminRedemptions = lazy(() => import("@features/admin/pages/AdminRedemptions").then(m => ({ default: m.AdminRedemptions })));
const PageAccessManagement = lazy(() => import("@features/admin/pages/PageAccessManagement").then(m => ({ default: m.PageAccessManagement })));
const ContentModeration = lazy(() => import("@features/admin/pages/ContentModeration").then(m => ({ default: m.ContentModeration })));
const TutoriasSection = lazy(() => import("@features/admin/pages/TutoriasSection").then(m => ({ default: m.TutoriasSection })));

interface AdminOutletContext {
  navigate: (section: AdminSection) => void;
}

const AdminLayout: React.FC = () => {
  const { active, navigate, isOpen, toggle, close } = useAdminSidebar();

  return (
    <div className="flex h-dvh w-full bg-itec-bg text-itec-text overflow-hidden">
      <AdminSidebar active={active} onNavigate={navigate} isOpen={isOpen} onClose={close} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-white/5 bg-itec-sidebar shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-itec-muted">Panel</p>
            <h1 className="text-sm font-bold text-white">Administración</h1>
          </div>
          <HamburgerButton open={isOpen} onToggle={toggle} />
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Suspense fallback={
              <div className="flex h-40 w-full items-center justify-center">
                <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin" />
              </div>
            }>
              <Outlet context={{ navigate }} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardRoute = () => {
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
      <Route path="beneficios" element={<BenefitManagement />} />
      <Route path="canjes" element={<AdminRedemptions />} />
      <Route path="moderacion" element={<ContentModeration />} />
      <Route path="tutorias" element={<TutoriasSection />} />
      <Route path="paginas" element={<PageAccessManagement />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Routes>
);

export default AdminPanel;
