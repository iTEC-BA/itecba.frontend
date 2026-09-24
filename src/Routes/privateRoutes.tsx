// src/routes/privateRoutes.tsx
// Rutas que requieren sesión iniciada. El panel administrativo tiene además
// su propio guard de roles en AppRoutes.
import { Route } from "react-router-dom";
import { PageGate } from "@features/pageAccess/components/PageGate";
import { PageSuspense } from "./PageSuspense";
import {
  TruekeTECPage,
  BenefitsPage,
  ResourcesPage,
  ProgressPage,
  ProfilePage,
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
    <Route path="/notificaciones" element={<PageSuspense><NotificationsPage /></PageSuspense>} />
  </>
);
