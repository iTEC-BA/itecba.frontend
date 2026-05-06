import { Suspense } from "react";
import { LoadingState } from "../atoms/LoadingState";
import { RewardsWidget } from "@/features/rewards/components/organisms/RewardsWidget";
import { SidebarLayout } from "./SidebarLayout";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SidebarLayout>
      {/* Columna Central*/}
      <main className="flex-1 h-full overflow-y-auto scroll-smooth">
        <div className="mx-auto w-full min-h-full py-3 px-2">
          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </main>
      {/* Columna Derecha*/}
      <aside className="w-62 w-max-56 h-full hidden lg:block p-4 overflow-y-auto bg-itec-sidebar">
        <RewardsWidget />
      </aside>
    </SidebarLayout>
  );
};
