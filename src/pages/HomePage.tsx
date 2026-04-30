import React from "react";
import { useAuth } from "@context/AuthContext";
import { MainLayout } from "@/components/templates/MainLayout";
// import { UniversalSearch } from "@features/home/components/organisms/UniversalSearch";
import { HubNavigation } from "@features/home/components/organisms/HubNavigation";

import { WelcomeWidget } from "@features/home/components/organisms/WelcomeWidget";
import { UniversityLinksWidget } from "@features/home/components/organisms/UniversityLinksWidget";
import { NewsWidget } from "@features/home/components/organisms/NewsWidget";
import { RewardsWidget } from "@features/rewards/components/organisms/RewardsWidget"; // <-- NUEVO
import { usePageTitle } from "@hooks/usePageTitle";

export const HomePage: React.FC = () => {
  usePageTitle("Inicio");
  const { user, isAdmin } = useAuth();

  return (
    <MainLayout>
      <WelcomeWidget userName={user?.name} />
      <UniversityLinksWidget isAdmin={isAdmin} />
      <HubNavigation />
      <NewsWidget />
    </MainLayout>
  );
};