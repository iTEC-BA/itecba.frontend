import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";
import { usePageTitle } from "@hooks/usePageTitle";
import { ProfileHeader } from "@features/profile/components/organisms/ProfileHeader";
import { TarjeTec } from "@features/profile/components/organisms/TarjeTec";
import { ProfileStatsWidget } from "@features/profile/components/organisms/ProfileStatsWidget";
import { BenefitsGrid } from "@features/profile/components/organisms/BenefitsGrid";
import { ProfileForm } from "@features/profile/components/organisms/ProfileForm";
import { ProfileQuickLinks } from "@features/profile/components/molecules/ProfileQuickLinks";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";
import { cn } from "@/lib/utils";

const ProfileBentoHero: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="grid gap-4 2xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {user && <TarjeTec user={user} />}
        <ProfileStatsWidget />
      </div>

      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">
              Función rápida
            </p>
            <h3 className="mt-1 text-sm font-black text-itec-text">
              Accesos directos
            </h3>
          </div>
        </div>
        <ProfileQuickLinks />

        <CareerPanel />
      </div>
      <button onClick={logout}>Cerrrar Session</button>
    </div>
  );
};

const CareerPanel: React.FC = () => {
  const { careers, isDoubleMajor, startYear } = useMultiCareer();
  if (careers.length === 0) return null;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">
            Carreras
          </p>
          <h3 className="mt-1 text-sm font-black text-itec-text">
            Trayectoria académica
          </h3>
        </div>
        <span className="rounded-full border border-itec-border bg-itec-surface px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-itec-muted">
          {isDoubleMajor ? "Doble" : "Simple"}
        </span>
      </div>

      <div className="space-y-3">
        {careers.map((career, idx) => (
          <div
            key={career.code}
            className={cn(
              "flex items-center gap-3 rounded-[1.3rem] border border-itec-border bg-itec-surface/55 p-3",
              idx === 0 && "ring-1 ring-itec-sky/15",
            )}
          >
            <div
              className={cn(
                "h-12 w-1.5 rounded-full",
                idx === 0 ? "bg-itec-sky" : "bg-itec-purple",
              )}
            />
            <div className="min-w-0">
              <p className="text-sm font-black text-itec-text">
                {idx === 0 ? "Carrera principal" : "Segunda carrera"}
              </p>
              <p className="truncate text-xs text-itec-muted">
                Ing. {career.name}
              </p>
              {startYear && idx === 0 && (
                <p className="mt-0.5 text-[10px] text-itec-muted">
                  Desde {startYear} · {new Date().getFullYear() - startYear + 1}
                  ° año aprox.
                </p>
              )}
            </div>
            <span className="ml-auto text-xl font-black text-itec-border/70">
              {career.code}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export const ProfilePage: React.FC = () => {
  usePageTitle("Perfil");
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();

  const hasCard = isAuthenticated && user && user.dni && user.dni.trim() !== "";

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const expected = user.email.split("@")[0];
      if (username !== expected)
        navigate(`/perfil/${expected}`, { replace: true });
    } else if (!isAuthenticated && username) {
      navigate("/perfil", { replace: true });
    }
  }, [isAuthenticated, user, username, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  if (isAuthenticated && !hasCard) {
    return (
      <MainLayout>
        <ProfileForm />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_55%)]" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_360px]">
          <div className="space-y-6">
            <ProfileHeader />
            <ProfileBentoHero />
            <BenefitsGrid />
          </div>

          <aside className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">
              Funciones
            </p>
            <h3 className="mt-1 text-sm font-black text-itec-text">
              Navegación rápida
            </h3>
            <div className="mt-4">
              <ProfileQuickLinks />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-itec-muted">
              Panel de estado
            </p>
            <div className="mt-3 space-y-3 text-sm text-itec-muted">
              <div className="flex items-center justify-between rounded-2xl border border-itec-border bg-itec-surface/60 px-4 py-3">
                <span>Puntos</span>
                <span className="font-black text-itec-amber">
                  {(user?.points ?? 0).toLocaleString("es-AR")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-itec-border bg-itec-surface/60 px-4 py-3">
                <span>Estado</span>
                <span className="font-black text-itec-emerald">Activo</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-itec-border bg-itec-surface/60 px-4 py-3">
                <span>Perfil</span>
                <span className="font-black text-itec-sky">Completo</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};
