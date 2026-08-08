import React from "react";
import { Lock } from "lucide-react";
import { MainLayout } from "@components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { BenefitsGrid } from "@features/benefits/components/organisms/BenefitsGrid";
import { usePageTitle } from "@hooks/usePageTitle";
import { useAuth } from "@context/AuthContext";

const LoginPrompt: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-5 px-4 py-24 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-itec-border bg-itec-surface">
      <Lock className="h-8 w-8 text-itec-muted" />
    </div>
    <div>
      <p className="mb-2 text-xl font-bold text-itec-text">
        Iniciá sesión para ver tus beneficios
      </p>
      <p className="max-w-sm text-sm leading-relaxed text-itec-muted">
        Necesitás una cuenta de Google institucional de la UTN BA para acceder al catálogo de
        beneficios.
      </p>
    </div>
  </div>
);

export const BenefitsPage: React.FC = () => {
  usePageTitle("Beneficios");
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Beneficios"
          description="Descuentos exclusivos y recompensas canjeables por puntos."
          colorTheme="yellow"
          iconType="gift"
        />

        {isAuthenticated ? <BenefitsGrid /> : <LoginPrompt />}
      </div>
    </MainLayout>
  );
};
