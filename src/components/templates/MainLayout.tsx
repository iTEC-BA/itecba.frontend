import { lazy, Suspense } from "react";
import { LoadingState } from "../ui/LoadingState";
import { SidebarLayout } from "./SidebarLayout";

// RewardsWidget es pesado (lógica de puntos + animaciones).
// Solo se muestra en desktop lg:, así que no vale cargarlo siempre.
const RewardsWidget = lazy(() =>
  import("@/features/rewards/components/organisms/RewardsWidget").then(
    (m) => ({ default: m.RewardsWidget })
  )
);

const WidgetSkeleton = () => (
  <div className="space-y-3 pt-2 animate-pulse">
    <div className="h-24 rounded-3xl bg-white/5 border border-itec-border" />
    <div className="h-16 rounded-2xl bg-white/5 border border-itec-border" />
    <div className="h-16 rounded-2xl bg-white/5 border border-itec-border" />
  </div>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SidebarLayout>
      {/* Columna Central */}
      <main className="flex-1 h-full overflow-y-auto scroll-smooth">
        <div className="mx-auto w-full min-h-full py-3 px-2">
          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </main>
      {/* Columna Derecha — solo desktop */}
      <aside className="w-62 w-max-56 h-full hidden lg:block p-4 overflow-y-auto bg-itec-sidebar">
        <Suspense fallback={<WidgetSkeleton />}>
          <RewardsWidget />
        </Suspense>
      </aside>
    </SidebarLayout>
  );
};
