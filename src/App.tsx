import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { getActivities } from "@features/points/services/points.service";
import { initAuthListener } from '@/stores/authStore';
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
    initAuthListener(); // Zustand inicia la escucha de sesión aquí

    const requestInitialPermissions = async () => {
      try {
        if ("Notification" in window && Notification.permission === "default") {
          await Notification.requestPermission();
        }
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
  );
};

export default App;