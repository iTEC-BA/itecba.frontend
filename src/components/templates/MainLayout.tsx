import React, { Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadingState } from "../ui/LoadingState";
import { SidebarLayout } from "./SidebarLayout";
import { useAuthStore } from "@/stores/authStore";
import ChipTarjetec from "@/features/profile/components/atoms/ChipTarjetec";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasTarjetec } = useAuthStore();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);

  // La lógica visual sigue aquí, pero la regla de negocio "qué es tener TarjeTEC" está en el store
  const showReminder = isAuthenticated && !hasTarjetec && location.pathname !== "/perfil" && !dismissed;

  return (
    <SidebarLayout>
      <main className="flex-1 h-full overflow-y-auto scroll-smooth">
        <div className="mx-auto w-full min-h-full py-3 px-2 flex flex-col gap-4">
          
          {/* Recordatorio Global de TarjeTEC */}
          {showReminder && (
            <ChipTarjetec onDismiss={() => setDismissed(true)} />
          )}

          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </main>
    </SidebarLayout>
  );
};
