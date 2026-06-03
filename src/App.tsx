import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getActivities } from "@features/points/services/points.service";
import { AuthProvider } from "@context/AuthContext";
import { ProtectedRoute } from "@components/templates/ProtectedRoute";
import LoadingState from "@components/ui/LoadingState";
import { BannerInstallPWA } from "./components/organisms/BannerInstallPWA";
import { UpdatePWAToast } from "./components/organisms/UpdatePWAToast";
import { ToastProvider } from "./features/notifications/components/atoms/Toast";
import GradeDetailPage from '@pages/gradeDetailPage';
import PadronPage from '@pages/PadronPage';

const RewardsPage      = lazy(() => import("@pages/RewardsPage").then(m => ({ default: m.RewardsPage })));
const CourseEditDetail = lazy(() => import("@pages/CourseEditDetail").then(m => ({ default: m.CourseEditDetail })));
const HomePage         = lazy(() => import("@pages/HomePage").then(m => ({ default: m.HomePage })));
const CoursesPage      = lazy(() => import("@pages/CoursesPage").then(m => ({ default: m.CoursesPage })));
const CourseDetail     = lazy(() => import("@pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
const ResourcesPage    = lazy(() => import("@pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const FaqsPage         = lazy(() => import("@pages/FaqsPage").then(m => ({ default: m.FaqsPage })));
const GroupsPage       = lazy(() => import("@pages/GroupsPage").then(m => ({ default: m.GroupsPage })));
const AdmissionPage    = lazy(() => import("@pages/AdmissionPage").then(m => ({ default: m.AdmissionPage })));
const GradePage        = lazy(() => import("@pages/GradePage").then(m => ({ default: m.GradePage })));
const AboutPage        = lazy(() => import("@pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProfilePage      = lazy(() => import("@pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AdminPanel       = lazy(() => import("@pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ProgressPage     = lazy(() => import("@pages/ProgressPage").then(m => ({ default: m.ProgressPage })));
const ErrorPage        = lazy(() => import("@pages/ErrorPage").then(m => ({ default: m.ErrorPage })));
const LoginPage        = lazy(() => import("@pages/LoginPage").then(m => ({ default: m.LoginPage })));
const AulasPage        = lazy(() => import("@pages/AulasPage").then(m => ({ default: m.AulasPage })));
const AulaDetallePage  = lazy(() => import("@pages/AulaDetallePage").then(m => ({ default: m.AulaDetallePage })));
const GuiaTECPage      = lazy(() => import("@pages/GuiaTECPage").then(m => ({ default: m.GuiaTECPage })));
const CalendarioPage   = lazy(() => import("@pages/CalendarioPage").then(m => ({ default: m.CalendarioPage })));
const PluginsPage      = lazy(() => import("@pages/PluginsPage").then(m => ({ default: m.PluginsPage })));
const TerminosPage     = lazy(() => import("@pages/TerminosPage").then(m => ({ default: m.TerminosPage })));
const ForumPage        = lazy(() => import('@pages/ForumPage').then(m => ({ default: m.ForumPage })));
const ForumThreadPage  = lazy(() => import('@pages/ForumThreadPage').then(m => ({ default: m.ForumThreadPage })));
const TruekeTECPage    = lazy(() => import("@pages/TruekeTECPage").then(m => ({ default: m.TruekeTECPage })));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage }))
  );
// ── Wrapper reutilizable para Suspense por ruta ───────────────────────────────
const PageSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingState />}>{children}</Suspense>
);

// ── App ───────────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  // Warm-up: precarga el catálogo de actividades en localStorage
  // para que usePointsGrant pueda leer los valores sin hacer una petición de red.
  useEffect(() => {
    getActivities().catch(() => {}); // silencioso — no bloquea la UI
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/padron" element={<PadronPage />} />
          <Route path="/"           element={<PageSuspense><HomePage /></PageSuspense>} />
          <Route path="/foro"      element={<PageSuspense><ForumPage /></PageSuspense>} />
          <Route path="/foro/:postId" element={<PageSuspense><ForumThreadPage /></PageSuspense>} />
          <Route path="/login"      element={<PageSuspense><LoginPage /></PageSuspense>} />
          <Route path="/cursos"     element={<PageSuspense><ToastProvider><CoursesPage /></ToastProvider></PageSuspense>} />
          <Route path="/cursos/:id" element={<PageSuspense><CourseDetail /></PageSuspense>} />
          <Route path="/faqs"       element={<PageSuspense><FaqsPage /></PageSuspense>} />
          <Route path="/ingreso"    element={<PageSuspense><AdmissionPage /></PageSuspense>} />
          <Route path="/grado"      element={<PageSuspense><GradePage /></PageSuspense>} />
          <Route path='/grado/:carreraId' element={<GradeDetailPage />} />
          <Route path="/nosotros"   element={<PageSuspense><AboutPage /></PageSuspense>} />
          <Route path="/grupos"     element={<PageSuspense><GroupsPage /></PageSuspense>} />
          <Route path="/aulas"      element={<PageSuspense><AulasPage /></PageSuspense>} />
          <Route path="/aulas/:slug"  element={<PageSuspense><AulaDetallePage /></PageSuspense>} />
          <Route path="/guiatec"    element={<PageSuspense><GuiaTECPage /></PageSuspense>} />
          <Route path="/calendario" element={<PageSuspense><CalendarioPage /></PageSuspense>} />
          <Route path="/plugins"    element={<PageSuspense><PluginsPage /></PageSuspense>} />
          <Route path="/terminos"   element={<PageSuspense><TerminosPage /></PageSuspense>} />

          {/* RUTAS PRIVADAS */}
          <Route element={<ProtectedRoute />}>
            <Route path="/trueketec"         element={<PageSuspense><TruekeTECPage /></PageSuspense>} />
            <Route path="/cursos/editar/:id" element={<PageSuspense><CourseEditDetail /></PageSuspense>} />
            <Route path="/beneficios"        element={<PageSuspense><RewardsPage /></PageSuspense>} />
            <Route path="/recursos"          element={<PageSuspense><ResourcesPage /></PageSuspense>} />
            <Route path="/progreso"          element={<PageSuspense><ProgressPage /></PageSuspense>} />
            <Route path="/perfil"            element={<PageSuspense><ProfilePage /></PageSuspense>} />
            <Route path="/perfil/:username"  element={<PageSuspense><ProfilePage /></PageSuspense>} />
            <Route path="/admin"             element={<PageSuspense><AdminPanel /></PageSuspense>} />
            <Route path="/notificaciones"    element={<PageSuspense><NotificationsPage /></PageSuspense>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<PageSuspense><ErrorPage /></PageSuspense>} />
        </Routes>
      </BrowserRouter>

      {/*
        ── PWA: Banner de instalación y Toast de actualización ────────────────
        Deben estar FUERA del BrowserRouter porque son overlays globales
        (position: fixed) que no pertenecen a ninguna ruta específica.
        InstallPWABanner → aparece cuando Chrome detecta que la PWA es instalable
        UpdatePWAToast   → aparece cuando hay una nueva versión del Service Worker
      */}
      <BannerInstallPWA />
      <UpdatePWAToast />
      {/* <ToastProvider /> */}
    </AuthProvider>
  );
};

export default App;