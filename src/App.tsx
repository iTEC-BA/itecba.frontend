import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { getActivities } from "@features/points/services/points.service";
import { AuthProvider } from "@context/AuthContext";
import { PageAccessProvider } from "@features/pageAccess/context/PageAccessContext";
import { ToastProvider } from "./features/notifications/components/atoms/Toast";
import { PermissionPopup } from "./features/notifications/components/organisms/PermissionPopup";
import { BannerInstallPWA } from "./components/organisms/BannerInstallPWA";
import { UpdatePWAToast } from "./components/organisms/UpdatePWAToast";
import { AnalyticsTracker } from "./components/utils/AnalyticsTracker";
import { AppRoutes } from "./routes";
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

export const App: React.FC = () => {
  useEffect(() => {
    getActivities().catch(() => {});

    const requestInitialPermissions = async () => {
      try {
        // 1. Solicitud de Notificaciones Push
        if ("Notification" in window && Notification.permission === "default") {
          // Nota: Safari y Chrome pueden ignorar esta línea si no hay interacción previa.
          await Notification.requestPermission();
        }

        // 2. Solicitud de Persistencia de Almacenamiento (Caché/Archivos PWA)
        if (navigator.storage && navigator.storage.persist) {
          const isPersisted = await navigator.storage.persist();
          console.log("Persistencia de datos otorgada:", isPersisted);
        }
      } catch (error) {
        console.error("Error al solicitar permisos:", error);
      }
    };

    requestInitialPermissions();
  }, []);

  return (
    <AuthProvider>
      <PageAccessProvider>
        <ToastProvider>
          <BrowserRouter>
            <AnalyticsTracker />
            <AppRoutes />
          </BrowserRouter>
          <PermissionPopup />
          <BannerInstallPWA />
          <UpdatePWAToast />
        </ToastProvider>
      </PageAccessProvider>
    </AuthProvider>
  );
};

export default App;