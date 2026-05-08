import React from "react";
import { MainLayout } from "@components/templates/MainLayout";
import { PageHeader } from "@components/ui/PageHeader";
import { PointsHeader } from "@features/rewards/components/molecules/PointsHeader";
import { RewardStats } from "@features/rewards/components/molecules/RewardStats";
import { RewardsGrid } from "@features/rewards/components/organisms/RewardsGrid";
import { InboxWidget } from "@features/rewards/components/organisms/InboxWidget";
import { usePageTitle } from "@hooks/usePageTitle";
import { useAuth } from "@context/AuthContext";
import { useRewards } from "@features/rewards/hooks/useRewards";
import { useRewardStore } from "@features/rewards/store/useRewardStore";
import { Icons } from "@components/ui/icons/Icons";
import { Button } from "@/components/ui/Button";

const RewardsContent: React.FC = () => {
  const { rewards, pointsBalance, affordableRewards } = useRewards();
  const { isAdmin } = useAuth();
  const { openAddModal } = useRewardStore();

  return (
    <div className="flex flex-col gap-6">
      <PointsHeader />

      <RewardStats
        totalRewards={rewards.length}
        affordableCount={affordableRewards.length}
        pointsBalance={pointsBalance}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-itec-text/40">
              Beneficios disponibles
            </h2>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={openAddModal}
                  variant="primary"
                  hierarchy="ghost"
                  icon="➕"
                  text="Agregar"
                  className="text-xs"
                />
              </div>
            )}
          </div>
          <RewardsGrid isAdmin={isAdmin} />
        </div>

        {/* <aside className="w-full lg:w-80 shrink-0">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-itec-text/40 mb-4">
            Buzón de avisos
          </h2>
          <div className="lg:sticky lg:top-4">
            <InboxWidget />
          </div>
        </aside> */}
      </div>
    </div>
  );
};

const LoginPrompt: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center gap-5 px-4">
    <div className="w-20 h-20 rounded-3xl bg-itec-rewards/8 border border-itec-rewards/15 flex items-center justify-center">
      <span className="text-4xl">🔒</span>
    </div>
    <div>
      <p className="text-itec-text font-black text-xl mb-2">
        Iniciá sesión para ver tus beneficios
      </p>
      <p className="text-itec-text/40 text-sm max-w-sm leading-relaxed">
        Necesitás una cuenta de Google institucional de la UTN BA para acceder
        al club de beneficios.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {[
        "⭐ Puntos por actividades",
        "🎁 Beneficios exclusivos",
        "📩 Avisos del equipo",
      ].map((text) => (
        <span
          key={text}
          className="text-xs text-itec-text/50 bg-white/4 border border-white/8 rounded-xl px-3 py-1.5"
        >
          {text}
        </span>
      ))}
    </div>
  </div>
);

export const RewardsPage: React.FC = () => {
  usePageTitle("Club de Beneficios");
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-6 animate-in fade-in duration-300">
        <PageHeader
          title="Club de Beneficios"
          description="Canjea tus puntos y revisá los avisos del equipo de ITEC."
          colorTheme="yellow"
          iconType="star"
        />

        {isAuthenticated ? <RewardsContent /> : <LoginPrompt />}
      </div>
    </MainLayout>
  );
};
