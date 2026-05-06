import React from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { HubNavigation } from "@features/home/components/organisms/HubNavigation";
import { WelcomeWidget } from "@features/home/components/organisms/WelcomeWidget";
import { UniversityLinksWidget } from "@features/home/components/organisms/UniversityLinksWidget";
import { usePageTitle } from "@hooks/usePageTitle";

export const HomePage: React.FC = () => {
  usePageTitle("Inicio");

  return (
    <MainLayout>
      <WelcomeWidget />
      <UniversityLinksWidget />
      <HubNavigation />
    </MainLayout>
  );
};