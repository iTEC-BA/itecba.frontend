// src/routes/privateRoutes.tsx
// Rutas que requieren sesión iniciada (envueltas en <ProtectedRoute/> desde
// AppRoutes). El admin panel (/admin/*) vive acá también: ProtectedRoute
// exige login, y dentro de AdminPanel.tsx cada sub-ruta ya está protegida
// además por lógica de rol admin en sus propios componentes.
import { Route } from "react-router-dom";
import { PageGate } from "@features/pageAccess/components/PageGate";
import { PageSuspense } from "./PageSuspense";
import {
  TruekeTECPage,
  BenefitsPage,
  ResourcesPage,
  ProgressPage,
  ProfilePage,
  AdminPanel,
  NotificationsPage,
} from "./lazyPages";

export const PrivateRoutes = (
  <>
    <Route path="/trueketec" element={<PageSuspense><PageGate path="/trueketec"><TruekeTECPage /></PageGate></PageSuspense>} />
    <Route path="/beneficios" element={<PageSuspense><PageGate path="/beneficios"><BenefitsPage /></PageGate></PageSuspense>} />
    <Route path="/recursos" element={<PageSuspense><PageGate path="/recursos"><ResourcesPage /></PageGate></PageSuspense>} />
    <Route path="/progreso" element={<PageSuspense><PageGate path="/progreso"><ProgressPage /></PageGate></PageSuspense>} />
    <Route path="/perfil" element={<PageSuspense><ProfilePage /></PageSuspense>} />
    <Route path="/perfil/:username" element={<PageSuspense><ProfilePage /></PageSuspense>} />
    <Route path="/admin/*" element={<PageSuspense><AdminPanel /></PageSuspense>} />
    <Route path="/notificaciones" element={<PageSuspense><NotificationsPage /></PageSuspense>} />
  </>
);
