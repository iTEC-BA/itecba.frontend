// src/pages/AdminPanel.tsx
import React, { lazy, Suspense } from "react";
import { MainLayout } from "@components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { useAdminSidebar } from "@features/admin/hooks/useAdminSidebar";
import { AdminSidebar } from "@features/admin/components/organisms/AdminSidebar";
import { AdminDashboard } from "@features/admin/components/organisms/AdminDashboard";
import { HamburgerButton } from "@features/admin/components/atoms/HamburgerButton";
import { Button } from "@components/ui/Button";
import { usePageTitle } from "@hooks/usePageTitle";

// Lazy imports de secciones...
const UserManagement = lazy(() => import("@features/admin/components/organisms/UserManagement").then((m) => ({ default: m.UserManagement })));
const NewsManagement = lazy(() => import("@features/admin/components/organisms/NewsManagement").then((m) => ({ default: m.NewsManagement })));
const RewardsManagement = lazy(() => import("@features/admin/components/organisms/RewardsManagement").then((m) => ({ default: m.RewardsManagement })));
const AdminRedemptions = lazy(() => import("@features/admin/components/organisms/AdminRedemptions").then((m) => ({ default: m.AdminRedemptions })));
const AdminMaterias = lazy(() => import("@features/admin/components/organisms/AdminMaterias").then((m) => ({ default: m.AdminMaterias })));
const BenefitsManagement = lazy(() => import("@features/admin/components/organisms/BenefitsManagement").then((m) => ({ default: m.BenefitsManagement })));
const TutoriasSection = lazy(() => import("@features/admin/components/organisms/TutoriasSection").then((m) => ({ default: m.TutoriasSection })));

// 1. Skeleton Simple (sin colores estridentes)
const SectionSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse pt-4">
    <div className="h-8 w-64 rounded-xl bg-white/5 border border-itec-border" />
    <div className="h-4 w-48 rounded-lg bg-white/5" />
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-white/5 border border-itec-border" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  </div>
);

// 2. Pantalla de Acceso Denegado (Hermosa, limpia y centrada)
const AccessDenied: React.FC = () => (
  <MainLayout>
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm p-8 text-center border border-itec-border bg-itec-box rounded-3xl shadow-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-itec-border bg-itec-bg text-2xl">
          🔒
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Acceso restringido</h2>
        <p className="mt-2 mb-6 text-sm text-itec-muted leading-relaxed">
          No tienes los privilegios necesarios para acceder a esta área de administración.
        </p>
        <Button 
          variant="slate" 
          hierarchy="outline" 
          fullWidth 
          onClick={() => window.location.href = '/'}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  </MainLayout>
);

export const AdminPanel: React.FC = () => {
  usePageTitle("Admin — ITEC");
  const { isAdmin } = useAuth();
  const { active, navigate, isOpen, toggle, close } = useAdminSidebar();

  if (!isAdmin) return <AccessDenied />;

  return (
    <MainLayout>
      <div className="relative min-h-[calc(100vh-4rem)] bg-itec-bg">
        
        {/* Header Superior - Siempre visible (Desktop y Mobile) */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-itec-border bg-itec-bg/80 px-5 py-3 backdrop-blur-xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Gestión ITEC</span>
            <h1 className="text-sm font-bold capitalize text-white">{active}</h1>
          </div>
          
          <div className="p-1 rounded-xl border border-itec-border hover:bg-white/5 transition-colors">
            <HamburgerButton open={isOpen} onToggle={toggle} />
          </div>
        </header>

        {/* El Sidebar ahora es un overlay, no ocupa espacio en el grid */}
        <AdminSidebar active={active} onNavigate={navigate} isOpen={isOpen} onClose={close} />

        {/* Contenido que siempre ocupa el 100% del ancho */}
        <main className="mx-auto max-w-350 px-4 py-8 sm:px-8 lg:px-12">
          <Suspense fallback={<SectionSkeleton />}>
            {active === "dashboard" && <AdminDashboard onNavigate={navigate} />}
            {active === "users" && <UserManagement />}
            {active === "news" && <NewsManagement />}
            {active === "benefits" && <BenefitsManagement />}
            {active === "rewards" && <RewardsManagement />}
            {active === "redemptions" && <AdminRedemptions />}
            {active === "materias" && <AdminMaterias />}
            {active === "tutorias" && <TutoriasSection />}
          </Suspense>
        </main>
      </div>
    </MainLayout>
  );
};