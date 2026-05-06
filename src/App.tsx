// src/App.tsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { ProtectedRoute } from "@components/templates/ProtectedRoute";
import LoadingState from "@/components/ui/LoadingState";

// ── Componentes PWA ──────────────────────────────────────────────────────────
// Estos dos componentes son los que hacen aparecer el banner de instalación
// y el toast de actualización. SIN estos imports el botón de instalar NUNCA aparece.
import { InstallPWABanner } from "@components/molecules/InstallPWABanner";
import { UpdatePWAToast }   from "@components/molecules/UpdatePWAToast";

// ── Carga Diferida (Code Splitting) ──────────────────────────────────────────
const RewardsPage       = lazy(() => import("@pages/RewardsPage").then(m => ({ default: m.RewardsPage })));
const CourseEditDetail  = lazy(() => import("@pages/CourseEditDetail").then(m => ({ default: m.CourseEditDetail })));
const HomePage          = lazy(() => import("@pages/HomePage").then(m => ({ default: m.HomePage })));
const CoursesPage       = lazy(() => import("@pages/CoursesPage").then(m => ({ default: m.CoursesPage })));
const CourseDetail      = lazy(() => import("@pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
const ResourcesPage     = lazy(() => import("@pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const FaqsPage          = lazy(() => import("@pages/FaqsPage").then(m => ({ default: m.FaqsPage })));
const GroupsPage        = lazy(() => import("@pages/GroupsPage").then(m => ({ default: m.GroupsPage })));
const AdmissionPage     = lazy(() => import("@pages/AdmissionPage").then(m => ({ default: m.AdmissionPage })));
const GradePage         = lazy(() => import("@pages/GradePage").then(m => ({ default: m.GradePage })));
const AboutPage         = lazy(() => import("@pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProfilePage       = lazy(() => import("@pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AdminPanel        = lazy(() => import("@pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ProgressPage      = lazy(() => import("@pages/ProgressPage").then(m => ({ default: m.ProgressPage })));
const ErrorPage         = lazy(() => import("@pages/ErrorPage").then(m => ({ default: m.ErrorPage })));
const LoginPage         = lazy(() => import("@pages/LoginPage").then(m => ({ default: m.LoginPage })));
const BuscaTECPage      = lazy(() => import("@pages/BuscaTECPage").then(m => ({ default: m.BuscaTECPage })));
const AulasPage         = lazy(() => import("@pages/AulasPage").then(m => ({ default: m.AulasPage })));
const GuiaTECPage       = lazy(() => import("@pages/GuiaTECPage").then(m => ({ default: m.GuiaTECPage })));
const CalendarioPage    = lazy(() => import("@pages/CalendarioPage").then(m => ({ default: m.CalendarioPage })));
const PluginsPage       = lazy(() => import("@pages/PluginsPage").then(m => ({ default: m.PluginsPage })));
const TerminosPage      = lazy(() => import("@pages/TerminosPage").then(m => ({ default: m.TerminosPage })));

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/"           element={<HomePage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/cursos"     element={<CoursesPage />} />
            <Route path="/cursos/:id" element={<CourseDetail />} />
            <Route path="/faqs"       element={<FaqsPage />} />
            <Route path="/ingreso"    element={<AdmissionPage />} />
            <Route path="/grado"      element={<GradePage />} />
            <Route path="/nosotros"   element={<AboutPage />} />
            <Route path="/grupos"     element={<GroupsPage />} />
            <Route path="/buscatec"   element={<BuscaTECPage />} />
            <Route path="/aulas"      element={<AulasPage />} />
            <Route path="/guiatec"    element={<GuiaTECPage />} />
            <Route path="/calendario" element={<CalendarioPage />} />
            <Route path="/plugins"    element={<PluginsPage />} />
            <Route path="/terminos"   element={<TerminosPage />} />

            {/* RUTAS PRIVADAS */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cursos/editar/:id" element={<CourseEditDetail />} />
              <Route path="/beneficios"        element={<RewardsPage />} />
              <Route path="/recursos"          element={<ResourcesPage />} />
              <Route path="/progreso"          element={<ProgressPage />} />
              <Route path="/perfil"            element={<ProfilePage />} />
              <Route path="/perfil/:username"  element={<ProfilePage />} />
              <Route path="/admin"             element={<AdminPanel />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
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