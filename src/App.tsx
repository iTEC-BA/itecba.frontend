import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { getActivities } from "@features/points/services/points.service";
import { AuthProvider } from "@context/AuthContext";
import { PageAccessProvider } from "@features/pageAccess/context/PageAccessContext";
import { ToastProvider } from "./features/notifications/components/atoms/Toast";
import { BannerInstallPWA } from "./components/organisms/BannerInstallPWA";
import { UpdatePWAToast } from "./components/organisms/UpdatePWAToast";
import { AnalyticsTracker } from "./components/utils/AnalyticsTracker";
import { AppRoutes } from "./Routes";
import ReactGA from "react-ga4";

// Inicializar Google Analytics 4
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

// ── App ───────────────────────────────────────────────────────────────────────
// App.tsx ahora solo monta los providers globales y el router. La config de
// rutas (qué página vive en qué URL, cuáles son públicas/privadas, cuáles
// tienen PageGate) vive en src/routes/ — ver ese directorio para agregar,
// mover o proteger una ruta.
export const App: React.FC = () => {
  useEffect(() => {
    getActivities().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <PageAccessProvider>
        <ToastProvider>
          <BrowserRouter>
            <AnalyticsTracker />
            <AppRoutes />
          </BrowserRouter>

          <BannerInstallPWA />
          <UpdatePWAToast />
        </ToastProvider>
      </PageAccessProvider>
    </AuthProvider>
  );
};

export default App;
