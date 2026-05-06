import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import { ProtectedRoute } from "@components/templates/ProtectedRoute";
import LoadingState from "@/components/ui/LoadingState";

// Carga Diferida (Code Splitting)
const RewardsPage = lazy(() => import("@pages/RewardsPage").then(m => ({ default: m.RewardsPage })));
const CourseEditDetail = lazy(() => import("@pages/CourseEditDetail").then(m => ({ default: m.CourseEditDetail })));
const HomePage = lazy(() => import("@pages/HomePage").then(m => ({ default: m.HomePage })));
const CoursesPage = lazy(() => import("@pages/CoursesPage").then(m => ({ default: m.CoursesPage })));
const CourseDetail = lazy(() => import("@pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
const ResourcesPage = lazy(() => import("@pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const FaqsPage = lazy(() => import("@pages/FaqsPage").then(m => ({ default: m.FaqsPage })));
const GroupsPage = lazy(() => import("@pages/GroupsPage").then(m => ({ default: m.GroupsPage })));
const AdmissionPage = lazy(() => import("@pages/AdmissionPage").then(m => ({ default: m.AdmissionPage })));
const GradePage = lazy(() => import("@pages/GradePage").then(m => ({ default: m.GradePage })));
const AboutPage = lazy(() => import("@pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProfilePage = lazy(() => import("@pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AdminPanel = lazy(() => import("@pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ProgressPage = lazy(() => import("@pages/ProgressPage").then(m => ({ default: m.ProgressPage })));
const ErrorPage = lazy(() => import("@pages/ErrorPage").then(m => ({ default: m.ErrorPage })));

// Componente para el Login (Deberías crearlo si no lo tienes separado)
const LoginPage = lazy(() => import("@pages/LoginPage").then(m => ({ default: m.LoginPage }))); 

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            {/* RUTAS PÚBLICAS (Accesibles sin login) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cursos" element={<CoursesPage />} />
            <Route path="/cursos/:id" element={<CourseDetail />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/ingreso" element={<AdmissionPage />} />
            <Route path="/grado" element={<GradePage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/grupos" element={<GroupsPage />} />

            {/* RUTAS PRIVADAS (Protegidas por un Outlet) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cursos/editar/:id" element={<CourseEditDetail />} />
              <Route path="/beneficios" element={<RewardsPage />}/>
              <Route path="/recursos" element={<ResourcesPage />} />
              <Route path="/progreso" element={<ProgressPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/perfil/:username" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            {/* RUTAS NO ENCONTRADAS (404) */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;