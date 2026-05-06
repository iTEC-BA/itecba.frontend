import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { useAuth } from "@context/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState"; // O el spinner que prefieras usar

import { TarjeTec } from "@features/profile/components/organisms/TarjeTec";
import { ProfileForm } from "@features/profile/components/organisms/ProfileForm";
import { ProfileHeader } from "@features/profile/components/organisms/ProfileHeader";
import { BenefitsGrid } from "@features/profile/components/organisms/BenefitsGrid";
import { ProfileStatsWidget } from "@features/profile/components/organisms/ProfileStatsWidget";
import { usePageTitle } from "@hooks/usePageTitle";

export const ProfilePage: React.FC = () => {
  usePageTitle("Perfil")
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams(); 

  const hasCard = isAuthenticated && user && user.dni && user.dni.trim() !== '';

  // Redirección amigable con URLs
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const expectedUsername = user.email.split('@')[0];
      if (username !== expectedUsername) {
        navigate(`/perfil/${expectedUsername}`, { replace: true });
      }
    } else if (!isAuthenticated && username) {
      navigate('/perfil', { replace: true });
    }
  }, [isAuthenticated, user, username, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  // Vista 1: Necesita llenar sus datos
  if (isAuthenticated && !hasCard) {
    return (
      <MainLayout>
        <ProfileForm />
      </MainLayout>
    );
  }

  // Vista 2: Perfil Completo
  return (
<MainLayout>
      <div className="max-w-5xl mx-auto pb-12 relative z-10">
        <ProfileHeader />
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          {user && <TarjeTec user={user} />}
          <ProfileStatsWidget />
        </div>
        <BenefitsGrid />
      </div>
    </MainLayout>
  );
};