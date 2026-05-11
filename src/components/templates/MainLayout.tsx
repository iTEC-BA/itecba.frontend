import { lazy, Suspense } from "react";
import { LoadingState } from "../ui/LoadingState";
import { SidebarLayout } from "./SidebarLayout";

// RewardsWidget es pesado (lógica de puntos + animaciones).
// Solo se muestra en desktop lg:, así que no vale cargarlo siempre.


export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SidebarLayout>
      <main className="flex-1 h-full overflow-y-auto scroll-smooth">
        <div className="mx-auto w-full min-h-full py-3 px-2">
          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </main>
    </SidebarLayout>
  );
};
