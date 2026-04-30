import { Suspense } from "react";
import { SidebarPrimo } from "../organisms/SidebarPrimo";
import { TopNavbar } from "../organisms/TopNavbar";
import { LoadingState } from "../atoms/LoadingState";
import RewardsPointsItem from "@/features/rewards/components/molecules/RewardsPointsItem";
import { RewardsWidget } from "@/features/rewards/components/organisms/RewardsWidget";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col w-full h-screen bg-itec-background text-itec-text overflow-hidden">
      {/* 1. Header Fijo (Buscador y Notificaciones) */}
      <TopNavbar />

      {/* 2. Contenedor Inferior de 3 Columnas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Columna Izquierda: Menú Principal */}
        <SidebarPrimo />

        {/* Columna Central: Feed Estilo Facebook */}
        <main className="flex-1 h-full overflow-y-auto scroll-smooth">
          <div className="mx-auto w-full min-h-full py-6 px-4">
            <Suspense fallback={<LoadingState />}>{children}</Suspense>
          </div>
        </main>

        {/* Columna Derecha: Sidebar Derecho (Contactos, Cumpleaños) */}
        <aside className="w-62 w-max-56 h-full hidden lg:block p-4 overflow-y-auto bg-itec-sidebar">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-itec-text/60">Tus puntos:</h3>
              <RewardsPointsItem>iTECs</RewardsPointsItem>
            </div>
            <div>
              <RewardsWidget />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
