import React, { lazy, Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";
import { usePageTitle } from "@hooks/usePageTitle";
import { Card } from "@components/atoms/Card";

// Imports perezosos para no bloquear la carga principal
const ProfileHeader = lazy(() => import("@features/profile/components/organisms/ProfileHeader").then((m) => ({ default: m.ProfileHeader })));
const TarjeTec = lazy(() => import("@features/profile/components/organisms/TarjeTec").then((m) => ({ default: m.TarjeTec })));
const ProfileStatsWidget = lazy(() => import("@features/profile/components/organisms/ProfileStatsWidget").then((m) => ({ default: m.ProfileStatsWidget })));
const ProfileForm = lazy(() => import("@features/profile/components/organisms/ProfileForm").then((m) => ({ default: m.ProfileForm })));

export const ProfilePage: React.FC = () => {
  usePageTitle("Perfil");
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();

  // Se considera que tiene TarjeTEC si ya cargó su DNI
  const hasCard = isAuthenticated && user && user.dni && user.dni.trim() !== "";

  // Sincronización de URL con el usuario
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const expected = user.email.split("@")[0];
      if (username !== expected) navigate(`/perfil/${expected}`, { replace: true });
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

  return (
    <MainLayout>
      <Suspense fallback={<LoadingState />}>
        <ProfileHeader />
      </Suspense>

      <div className="flex flex-col gap-6 my-1">
        {/* Lógica de TarjeTEC Opcional */}
        {user && (
          <Suspense fallback={<LoadingState />}>
            {hasCard ? (
              <div className="relative flex flex-col items-center mt-4">
                {/* Mascota asomándose por encima de la TarjeTEC */}
                <img 
                  src="/mascot/TEC-Saludando.webp" 
                  alt="TEC Saludando" 
                  className="w-28 h-28 object-contain -mb-8 relative z-10 transition-transform hover:scale-110 duration-500" 
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="w-full relative z-20">
                  <TarjeTec user={user} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Recordatorio usando el componente Card global */}
                <Card className="bg-itec-red/5 border-itec-red/20 sm:flex-row sm:text-left sm:justify-start">
                  <img 
                    src="/mascot/TEC-respuesta.png" 
                    alt="¿TarjeTEC?" 
                    className="w-20 h-20 object-contain drop-shadow-md shrink-0 transition-transform hover:scale-105 duration-300" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      ¿TarjeTEC?
                    </h3>
                    <p className="text-sm text-itec-text/80 leading-relaxed">
                      Aún no solicitaste tu credencial. Recordá que es totalmente <strong>opcional</strong>, pero si completás el formulario de abajo vas a poder acceder a beneficios exclusivos, buscar aulas rápidamente y seguir tu carrera académica de forma inteligente.
                    </p>
                  </div>
                </Card>
                
                {/* Formulario (Que ya cuenta con TEC-Euforico en la izquierda) */}
                <ProfileForm />
              </div>
            )}
          </Suspense>
        )}

        <Suspense fallback={<LoadingState />}>
          <ProfileStatsWidget />
        </Suspense>
      </div>
    </MainLayout>
  );
};
