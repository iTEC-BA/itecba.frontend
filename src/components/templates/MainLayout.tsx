import React, { Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoadingState } from "../ui/LoadingState";
import { SidebarLayout } from "./SidebarLayout";
import { useAuth } from "../../context/AuthContext";
import ChipTarjetec from "@/features/profile/components/atoms/ChipTarjetec";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);
  // Verificamos si tiene DNI para saber si ya completó la TarjeTEC
  const hasCard = isAuthenticated && user && user.dni && user.dni.trim() !== "";
  // Mostrar solo si está logueado, no tiene la tarjeta, no la cerró y NO está en la página de perfil
  const showReminder = isAuthenticated && !hasCard && location.pathname !== "/perfil" && !dismissed;

  return (
    <SidebarLayout>
      <main className="flex-1 h-full overflow-y-auto scroll-smooth">
        <div className="mx-auto w-full min-h-full py-3 px-2 flex flex-col gap-4">
          
          {/* Recordatorio Global de TarjeTEC (Cuadrito Chiquito) */}
          {showReminder && (
            <ChipTarjetec onDismiss={() => setDismissed(true)} />
          )}

          <Suspense fallback={<LoadingState />}>{children}</Suspense>
        </div>
      </main>
    </SidebarLayout>
  );
};
