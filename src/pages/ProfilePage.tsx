// ProfilePage.tsx — reescrito por fix-profile.sh
// Todos los organismos pesados se cargan con lazy + Suspense para no bloquear
// la navegación inicial.
import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";
import { usePageTitle } from "@hooks/usePageTitle";

// ── Lazy imports — ningún organismo bloquea el bundle inicial ─────────────────
const ProfileHeader = lazy(() =>
  import("@features/profile/components/organisms/ProfileHeader").then((m) => ({
    default: m.ProfileHeader,
  })),
);

const TarjeTec = lazy(() =>
  import("@features/profile/components/organisms/TarjeTec").then((m) => ({
    default: m.TarjeTec,
  })),
);

const ProfileStatsWidget = lazy(() =>
  import("@features/profile/components/organisms/ProfileStatsWidget").then(
    (m) => ({
      default: m.ProfileStatsWidget,
    }),
  ),
);

const ProfileForm = lazy(() =>
  import("@features/profile/components/organisms/ProfileForm").then((m) => ({
    default: m.ProfileForm,
  })),
);

// ── Page ──────────────────────────────────────────────────────────────────────
export const ProfilePage: React.FC = () => {
  usePageTitle("Perfil");
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();

  // El perfil está "completo" cuando el usuario tiene DNI cargado
  const hasCard = isAuthenticated && user && user.dni && user.dni.trim() !== "";

  // Mantiene la URL sincronizada con el email del usuario autenticado
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const expected = user.email.split("@")[0];
      if (username !== expected)
        navigate(`/perfil/${expected}`, { replace: true });
    } else if (!isAuthenticated && username) {
      navigate("/perfil", { replace: true });
    }
  }, [isAuthenticated, user, username, navigate]);

  // ── Estados de carga / sin perfil ──────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  // Usuario autenticado pero sin TarjeTEC → mostrar formulario de alta
  if (isAuthenticated && !hasCard) {
    return (
      <MainLayout>
        <Suspense fallback={<LoadingState />}>
          <ProfileForm />
        </Suspense>
      </MainLayout>
    );
  }

  // ── Vista normal del perfil ─────────────────────────────────────────────────
  return (
    <MainLayout>
      {/* Header: avatar, nombre, carreras, botones de acción */}
      <Suspense fallback={<LoadingState />}>
        <ProfileHeader />
      </Suspense>

      {/* Cuerpo: TarjeTEC + estadísticas */}
      <div className="flex flex-col gap-6 my-4">
        {/* TarjeTEC — solo se muestra si el usuario existe y tiene datos */}
        {user && (
          <Suspense fallback={<LoadingState />}>
            <TarjeTec user={user} />
          </Suspense>
        )}

        {/* Estadísticas: puntos, beneficios, estado, carreras */}
        <Suspense fallback={<LoadingState />}>
          <ProfileStatsWidget />
        </Suspense>
      </div>
    </MainLayout>
  );
};
