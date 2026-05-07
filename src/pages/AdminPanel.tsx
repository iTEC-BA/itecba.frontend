// src/pages/AdminPanel.tsx
// Rediseño radical: Sidebar/Hamburger + Bento Dashboard + Glassmorphism
import React, { lazy, Suspense } from "react";
import { MainLayout }          from "@/components/templates/MainLayout";
import { useAuth }             from "@context/AuthContext";
import { useAdminSidebar }     from "@features/admin/hooks/useAdminSidebar";
import { AdminSidebar }        from "@features/admin/components/organisms/AdminSidebar";
import { AdminDashboard }      from "@features/admin/components/organisms/AdminDashboard";
import { HamburgerButton }     from "@features/admin/components/atoms/HamburgerButton";
import { GlassCard }           from "@features/profile/components/atoms/GlassCard";
import { usePageTitle }        from "@hooks/usePageTitle";
import { cn }                  from "@/lib/utils";

// ── Lazy imports de secciones ──────────────────────────────────────────────────
const UserManagement    = lazy(() => import("@features/admin/components/organisms/UserManagement")    .then((m) => ({ default: m.UserManagement    })));
const NewsManagement    = lazy(() => import("@features/admin/components/organisms/NewsManagement")    .then((m) => ({ default: m.NewsManagement    })));
const RewardsManagement = lazy(() => import("@features/admin/components/organisms/RewardsManagement") .then((m) => ({ default: m.RewardsManagement })));
const AdminRedemptions  = lazy(() => import("@features/admin/components/organisms/AdminRedemptions")  .then((m) => ({ default: m.AdminRedemptions  })));
const AdminMaterias     = lazy(() => import("@features/admin/components/organisms/AdminMaterias")     .then((m) => ({ default: m.AdminMaterias     })));
const BenefitsManagement = lazy(() => import("@features/admin/components/organisms/BenefitsManagement").then((m) => ({ default: m.BenefitsManagement })));
const TutoriasSection   = lazy(() => import("@features/admin/components/organisms/TutoriasSection")  .then((m) => ({ default: m.TutoriasSection   })));

// ── Skeleton de carga ─────────────────────────────────────────────────────────
const SectionSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 w-64 bg-itec-surface rounded-2xl" />
    <div className="h-4 w-48 bg-itec-border rounded-xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 bg-itec-surface rounded-3xl" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  </div>
);

// ── Vista denegada ─────────────────────────────────────────────────────────────
const AccessDenied: React.FC = () => (
  <MainLayout>
    <div className="flex items-center justify-center h-[70vh] px-4">
      <GlassCard variant="elevated" className="max-w-md w-full p-12 text-center">
        <span className="text-6xl block mb-6 drop-shadow-[0_0_20px_rgba(212,19,19,0.4)]">
          🔒
        </span>
        <h2 className="text-2xl font-black text-itec-text mb-3 tracking-tight">
          Acceso Restringido
        </h2>
        <p className="text-itec-muted text-sm leading-relaxed mb-6">
          No tenés los privilegios necesarios para acceder al panel de administración.
          Contactá a un administrador si creés que esto es un error.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-itec-surface border border-itec-border text-itec-text text-sm font-bold px-5 py-2.5 rounded-2xl hover:bg-itec-box2 transition-all"
        >
          ← Volver al inicio
        </a>
      </GlassCard>
    </div>
  </MainLayout>
);

// ── Panel principal ────────────────────────────────────────────────────────────
export const AdminPanel: React.FC = () => {
  usePageTitle("Panel Admin — ITEC");
  const { isAdmin }                                           = useAuth();
  const { active, navigate, mobileOpen, closeMobile, toggleMobile } = useAdminSidebar();

  if (!isAdmin) return <AccessDenied />;

  return (
    <MainLayout>
      {/* Layout: sidebar + main */}
      <div className="flex min-h-[calc(100vh-4rem)] relative">

        {/* ── Sidebar ── */}
        <AdminSidebar
          active={active}
          onNavigate={navigate}
          mobileOpen={mobileOpen}
          onClose={closeMobile}
        />

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Topbar mobile */}
          <div className={cn(
            "lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3",
            "bg-itec-sidebar/95 backdrop-blur-md border-b border-itec-border"
          )}>
            <HamburgerButton open={mobileOpen} onToggle={toggleMobile} />
            <div>
              <p className="text-[10px] font-black text-itec-muted uppercase tracking-widest">
                Panel Admin
              </p>
              <p className="text-sm font-black text-itec-text capitalize">
                {active}
              </p>
            </div>
          </div>

          {/* Content area */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] animate-fade-in">
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
          </div>
        </main>
      </div>
    </MainLayout>
  );
};
