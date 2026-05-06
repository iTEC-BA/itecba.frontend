import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { ProtectedRoute } from "@components/templates/ProtectedRoute";
import LoadingState from "@components/ui/LoadingState";
import { InstallPWABanner } from "./components/molecules/InstallPWABanner";
import { UpdatePWAToast } from "./components/molecules/UpdatePWAToast";

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
const BuscaTECPage     = lazy(() => import("@pages/BuscaTECPage").then(m => ({ default: m.BuscaTECPage })));
const AulasPage        = lazy(() => import("@pages/AulasPage").then(m => ({ default: m.AulasPage })));
const GuiaTECPage      = lazy(() => import("@pages/GuiaTECPage").then(m => ({ default: m.GuiaTECPage })));
const CalendarioPage   = lazy(() => import("@pages/CalendarioPage").then(m => ({ default: m.CalendarioPage })));
const PluginsPage      = lazy(() => import("@pages/PluginsPage").then(m => ({ default: m.PluginsPage })));
const TerminosPage     = lazy(() => import("@pages/TerminosPage").then(m => ({ default: m.TerminosPage })));

// ── Wrapper reutilizable para Suspense por ruta ───────────────────────────────
const PageSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingState />}>{children}</Suspense>
);

// ── App ───────────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/"           element={<PageSuspense><HomePage /></PageSuspense>} />
          <Route path="/login"      element={<PageSuspense><LoginPage /></PageSuspense>} />
          <Route path="/cursos"     element={<PageSuspense><CoursesPage /></PageSuspense>} />
          <Route path="/cursos/:id" element={<PageSuspense><CourseDetail /></PageSuspense>} />
          <Route path="/faqs"       element={<PageSuspense><FaqsPage /></PageSuspense>} />
          <Route path="/ingreso"    element={<PageSuspense><AdmissionPage /></PageSuspense>} />
          <Route path="/grado"      element={<PageSuspense><GradePage /></PageSuspense>} />
          <Route path="/nosotros"   element={<PageSuspense><AboutPage /></PageSuspense>} />
          <Route path="/grupos"     element={<PageSuspense><GroupsPage /></PageSuspense>} />
          <Route path="/buscatec"   element={<PageSuspense><BuscaTECPage /></PageSuspense>} />
          <Route path="/aulas"      element={<PageSuspense><AulasPage /></PageSuspense>} />
          <Route path="/guiatec"    element={<PageSuspense><GuiaTECPage /></PageSuspense>} />
          <Route path="/calendario" element={<PageSuspense><CalendarioPage /></PageSuspense>} />
          <Route path="/plugins"    element={<PageSuspense><PluginsPage /></PageSuspense>} />
          <Route path="/terminos"   element={<PageSuspense><TerminosPage /></PageSuspense>} />

          {/* RUTAS PRIVADAS */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cursos/editar/:id" element={<PageSuspense><CourseEditDetail /></PageSuspense>} />
            <Route path="/beneficios"        element={<PageSuspense><RewardsPage /></PageSuspense>} />
            <Route path="/recursos"          element={<PageSuspense><ResourcesPage /></PageSuspense>} />
            <Route path="/progreso"          element={<PageSuspense><ProgressPage /></PageSuspense>} />
            <Route path="/perfil"            element={<PageSuspense><ProfilePage /></PageSuspense>} />
            <Route path="/perfil/:username"  element={<PageSuspense><ProfilePage /></PageSuspense>} />
            <Route path="/admin"             element={<PageSuspense><AdminPanel /></PageSuspense>} />
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
      <InstallPWABanner />
      <UpdatePWAToast />
    </AuthProvider>
  );
};

export default App;