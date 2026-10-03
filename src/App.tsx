import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { getActivities, grantPointsAPI } from "@features/points/services/points.service";
import { usePointsStore } from "@/stores/pointsStore";
import { useAuthStore } from "@/stores/authStore";
import { initAuthListener } from '@/stores/authStore';
import { PageAccessProvider } from "@features/pageAccess/context/PageAccessContext";
import { ToastProvider } from "./features/notifications/components/atoms/Toast";
import { PermissionPopup } from "./features/notifications/components/organisms/PermissionPopup";
import { BannerInstallPWA } from "./features/notifications/components/organisms/BannerInstallPWA";
import { UpdatePWAToast } from "./features/notifications/components/organisms/UpdatePWAToast";
import { AnalyticsTracker } from "./components/utils/AnalyticsTracker";
import { AppRoutes } from "./routes";
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

export const App: React.FC = () => {
  const user = useAuthStore((state) => state.user);

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

  useEffect(() => {
    if (!user?.id) return;
    const today = new Date().toISOString().slice(0, 10);
    const loginKey = `itec_daily_login_${user.id}_${today}`;
    if (sessionStorage.getItem(loginKey)) return;

    const grantDailyLogin = async () => {
      const result = await grantPointsAPI("daily_login");
      sessionStorage.setItem(loginKey, "1");
      if (result.granted && result.points) {
        await usePointsStore.getState().addPoints(result.points);
      }
    };

    grantDailyLogin().catch(() => {});
  }, [user?.id]);

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