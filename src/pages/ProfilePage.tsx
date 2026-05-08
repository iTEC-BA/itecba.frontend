import React, { lazy, useEffect, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";
import { usePageTitle } from "@hooks/usePageTitle";
import { ProfileHeader } from "@features/profile/components/organisms/ProfileHeader";
import { TarjeTec } from "@features/profile/components/organisms/TarjeTec";
import { ProfileStatsWidget } from "@features/profile/components/organisms/ProfileStatsWidget";

const ProfileForm = lazy(() =>
  import("@features/profile/components/organisms/ProfileForm").then(
    (module) => ({ default: module.ProfileForm })
  )
);

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
        <Suspense fallback={<LoadingState />}>
          <ProfileForm />
        </Suspense>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ProfileHeader />
          <div className="flex flex-col">
            {user && <TarjeTec user={user} />}
            <ProfileStatsWidget />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
