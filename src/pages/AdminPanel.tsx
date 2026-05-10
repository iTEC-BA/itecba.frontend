// src/pages/AdminPanel.tsx
import React, { lazy, Suspense } from "react";
import { MainLayout } from "@components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { useAdminSidebar } from "@features/admin/hooks/useAdminSidebar";
const AdminSidebar = lazy(() => import("@features/admin/components/organisms/AdminSidebar").then((m) => ({ default: m.AdminSidebar })));
const AdminDashboard = lazy(() => import("@features/admin/components/organisms/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
import { HamburgerButton } from "@features/admin/components/atoms/HamburgerButton";
import { Button } from "@components/ui/Button";
import { usePageTitle } from "@hooks/usePageTitle";

const UserManagement   = lazy(() => import("@features/admin/components/organisms/UserManagement").then((m) => ({ default: m.UserManagement })));
const NewsManagement   = lazy(() => import("@features/admin/components/organisms/NewsManagement").then((m) => ({ default: m.NewsManagement })));
const RewardsManagement = lazy(() => import("@features/admin/components/organisms/RewardsManagement").then((m) => ({ default: m.RewardsManagement })));
const AdminRedemptions = lazy(() => import("@features/admin/components/organisms/AdminRedemptions").then((m) => ({ default: m.AdminRedemptions })));
const AdminMaterias    = lazy(() => import("@features/admin/components/organisms/AdminMaterias").then((m) => ({ default: m.AdminMaterias })));
const BenefitsManagement = lazy(() => import("@features/admin/components/organisms/BenefitsManagement").then((m) => ({ default: m.BenefitsManagement })));
const TutoriasSection  = lazy(() => import("@features/admin/components/organisms/TutoriasSection").then((m) => ({ default: m.TutoriasSection })));

const SectionSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse pt-4">
    <div className="h-8 w-64 rounded-3xl bg-white/5 border border-itec-border" />
    <div className="h-4 w-48 rounded-2xl bg-white/5" />
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 rounded-3xl bg-white/5 border border-itec-border" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  </div>
);

// SVG lock inline — sin emojis
const LockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="h-6 w-6 text-itec-muted"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const AccessDenied: React.FC = () => (
  <MainLayout>
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-4xl border border-itec-border bg-itec-box p-8 text-center shadow-glass">
        {/* glow sutil */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-itec-accent/5 blur-3xl" />
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-itec-border bg-itec-surface backdrop-blur-sm">
          <LockIcon />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Acceso restringido</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-itec-text">Área privada</h2>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-itec-muted">
          No tenés los privilegios necesarios para acceder a este panel de administración.
        </p>
        <Button variant="slate" hierarchy="outline" fullWidth onClick={() => (window.location.href = "/")}>
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
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-itec-border bg-itec-bg/80 px-5 py-3 backdrop-blur-xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-itec-muted">Gestión ITEC</span>
            <h1 className="text-sm font-bold capitalize text-itec-text">{active}</h1>
          </div>
          <div className="rounded-2xl border border-itec-border p-1 transition-colors hover:bg-white/5">
            <HamburgerButton open={isOpen} onToggle={toggle} />
          </div>
        </header>

        <AdminSidebar active={active} onNavigate={navigate} isOpen={isOpen} onClose={close} />

        <main className="mx-auto max-w-350 px-4 py-8 sm:px-8 lg:px-12">
          <Suspense fallback={<SectionSkeleton />}>
            {active === "dashboard"   && <AdminDashboard onNavigate={navigate} />}
            {active === "users"       && <UserManagement />}
            {active === "news"        && <NewsManagement />}
            {active === "benefits"    && <BenefitsManagement />}
            {active === "rewards"     && <RewardsManagement />}
            {active === "redemptions" && <AdminRedemptions />}
            {active === "materias"    && <AdminMaterias />}
            {active === "tutorias"    && <TutoriasSection />}
          </Suspense>
        </main>
      </div>
    </MainLayout>
  );
};
