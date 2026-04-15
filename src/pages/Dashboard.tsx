import React from "react";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { UniversalSearch } from "../features/home/components/organisms/UniversalSearch";
import { HubNavigation } from "../features/home/components/organisms/HubNavigation";

// Componentes modulares
import { WelcomeWidget } from "../features/home/components/organisms/WelcomeWidget";
import { UniversityLinksWidget } from "../features/home/components/organisms/UniversityLinksWidget";
import { NewsWidget } from "../features/home/components/organisms/NewsWidget";

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <DashboardLayout>
      
      <UniversalSearch />

      <WelcomeWidget userName={user?.name} />

      <UniversityLinksWidget isAdmin={isAdmin} />

      <HubNavigation />

      <NewsWidget />

    </DashboardLayout>
  );
};