// src/pages/ProfilePage.tsx
// Rediseño radical: Bento Grid + Glassmorphism + Multi-carrera
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";
import { usePageTitle } from "@hooks/usePageTitle";

// Organismos del perfil
import { ProfileHeader } from "@features/profile/components/organisms/ProfileHeader";
import { TarjeTec } from "@features/profile/components/organisms/TarjeTec";
import { ProfileStatsWidget } from "@features/profile/components/organisms/ProfileStatsWidget";
import { BenefitsGrid } from "@features/profile/components/organisms/BenefitsGrid";
import { ProfileForm } from "@features/profile/components/organisms/ProfileForm";

// Moléculas
import { ProfileQuickLinks } from "@features/profile/components/molecules/ProfileQuickLinks";

// Atoms
import { GlassCard } from "@features/profile/components/atoms/GlassCard";
import { useMultiCareer } from "@features/profile/hooks/useMultiCareer";

// ── Sub-componente: Bento hero section ────────────────────────────────────────
const ProfileBentoHero: React.FC = () => {
  const { user } = useAuth();
  const { careers, isDoubleMajor } = useMultiCareer();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* TarjeTEC — ocupa 1 columna en md */}
      <div
        className="md:col-span-1 animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        {user && <TarjeTec user={user} />}
      </div>

      <div
        className="md:col-span-2 flex flex-col gap-4 animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <ProfileStatsWidget />
        <ProfileQuickLinks />
      </div>
    </div>
  );
};

// ── Sub-componente: Panel de carrera (doble título) ───────────────────────────
const CareerPanel: React.FC = () => {
  const { careers, isDoubleMajor, startYear } = useMultiCareer();
  if (careers.length === 0) return null;

  return (
    <GlassCard
      className="p-5 mb-6 animate-fade-up"
      style={{ animationDelay: "200ms" } as React.CSSProperties}
    >
      <h3 className="text-[10px] font-black text-itec-muted uppercase tracking-widest mb-3">
        Mi Carrera{isDoubleMajor ? "s" : ""}
      </h3>
      <div className="flex flex-col gap-3">
        {careers.map((c, idx) => (
          <div key={c.code} className="flex items-center gap-3">
            <div
              className={`w-1.5 h-12 rounded-full ${idx === 0 ? "bg-itec-sky" : "bg-itec-purple"}`}
            />
            <div>
              <p className="text-sm font-black text-itec-text">
                {idx === 0 ? "🎓 Carrera Principal" : "📘 Segunda Carrera"}
              </p>
              <p className="text-xs text-itec-muted">Ing. {c.name}</p>
              {startYear && idx === 0 && (
                <p className="text-[10px] text-itec-muted mt-0.5">
                  Desde {startYear} · {new Date().getFullYear() - startYear + 1}
                  ° año aprox.
                </p>
              )}
            </div>
            <span className="ml-auto text-2xl font-black text-itec-border opacity-40">
              {c.code}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
export const ProfilePage: React.FC = () => {
  usePageTitle("Perfil");
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();

  const hasCard = isAuthenticated && user && user.dni && user.dni.trim() !== "";

  // Redirect amigable
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

  // Vista 1: Necesita llenar datos
  if (isAuthenticated && !hasCard) {
    return (
      <MainLayout>
        <ProfileForm />
      </MainLayout>
    );
  }

  // Vista 2: No autenticado
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh] px-4">
          <GlassCard
            variant="elevated"
            className="max-w-sm w-full p-10 text-center"
          >
            <span className="text-5xl block mb-5">🔒</span>
            <h2 className="text-xl font-black text-itec-text mb-2">
              Iniciá sesión para ver tu perfil
            </h2>
            <p className="text-sm text-itec-muted mb-6">
              Accedé con tu cuenta de Google de la UTN.
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 bg-itec-sky text-white font-bold px-6 py-2.5 rounded-2xl hover:bg-itec-blue transition-all"
            >
              Iniciar Sesión
            </a>
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  // Vista 3: Perfil completo — Bento Grid
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto pb-20 pt-6 px-4 lg:px-0">
        {/* Header (avatar + nombre + carreras + editar) */}
        <div className="animate-fade-up" style={{ animationDelay: "50ms" }}>
          <ProfileHeader />
        </div>

        {/* Bento hero: TarjeTEC + Stats + Quick Links */}
        <ProfileBentoHero />

        {/* Panel de carreras */}
        <CareerPanel />

        {/* Beneficios desde DB */}
        <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
          <BenefitsGrid />
        </div>
      </div>
    </MainLayout>
  );
};
