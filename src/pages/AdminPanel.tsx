import React, { lazy, Suspense } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { useAdminSidebar } from "@features/admin/hooks/useAdminSidebar";
import { AdminSidebar } from "@features/admin/components/organisms/AdminSidebar";
import { AdminDashboard } from "@features/admin/components/organisms/AdminDashboard";
import { HamburgerButton } from "@features/admin/components/atoms/HamburgerButton";
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { usePageTitle } from "@hooks/usePageTitle";
import { cn } from "@/lib/utils";

const UserManagement = lazy(() => import("@features/admin/components/organisms/UserManagement").then((m) => ({ default: m.UserManagement })));
const NewsManagement = lazy(() => import("@features/admin/components/organisms/NewsManagement").then((m) => ({ default: m.NewsManagement })));
const RewardsManagement = lazy(() => import("@features/admin/components/organisms/RewardsManagement").then((m) => ({ default: m.RewardsManagement })));
const AdminRedemptions = lazy(() => import("@features/admin/components/organisms/AdminRedemptions").then((m) => ({ default: m.AdminRedemptions })));
const AdminMaterias = lazy(() => import("@features/admin/components/organisms/AdminMaterias").then((m) => ({ default: m.AdminMaterias })));
const BenefitsManagement = lazy(() => import("@features/admin/components/organisms/BenefitsManagement").then((m) => ({ default: m.BenefitsManagement })));
const TutoriasSection = lazy(() => import("@features/admin/components/organisms/TutoriasSection").then((m) => ({ default: m.TutoriasSection })));

const SectionSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 w-64 rounded-2xl bg-itec-surface" />
    <div className="h-4 w-48 rounded-xl bg-itec-border" />
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 rounded-[1.6rem] bg-itec-surface" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  </div>
);

const AccessDenied: React.FC = () => (
  <MainLayout>
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <GlassCard variant="elevated" className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border border-itec-border bg-itec-surface text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-black tracking-tight text-itec-text">Acceso restringido</h2>
        <p className="mt-2 text-sm leading-relaxed text-itec-muted">
          No tenés los privilegios necesarios para acceder al panel de administración.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-itec-border bg-itec-surface px-5 py-3 text-sm font-bold text-itec-text transition-all hover:bg-itec-box2"
          >
            ← Volver al inicio
          </a>
        </div>
      </GlassCard>
    </div>
  </MainLayout>
);

export const AdminPanel: React.FC = () => {
  usePageTitle("Panel Admin — ITEC");
  const { isAdmin } = useAuth();
  const { active, navigate, mobileOpen, closeMobile, toggleMobile } = useAdminSidebar();

  if (!isAdmin) return <AccessDenied />;

  return (
    <MainLayout>
      <div className="relative flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar active={active} onNavigate={navigate} mobileOpen={mobileOpen} onClose={closeMobile} />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className={cn(
            "sticky top-0 z-30 flex items-center gap-3 border-b border-itec-border",
            "bg-itec-sidebar/90 px-4 py-3 backdrop-blur-xl lg:hidden"
          )}>
            <HamburgerButton open={mobileOpen} onToggle={toggleMobile} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">Panel admin</p>
              <p className="text-sm font-black capitalize text-itec-text">{active}</p>
            </div>
          </div>

          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
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
          </div>
        </main>
      </div>
    </MainLayout>
  );
};
