import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoadingState from "./components/atoms/LoadingState";

// Aplicando Carga Diferida (Code Splitting) para optimizar la carga inicial
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const CoursesPage = lazy(() => import("./pages/CoursesPage").then(m => ({ default: m.CoursesPage })));
const CourseDetail = lazy(() => import("./pages/CourseDetail").then(m => ({ default: m.CourseDetail })));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const FaqsPage = lazy(() => import("./pages/FaqsPage").then(m => ({ default: m.FaqsPage })));
const GroupsPage = lazy(() => import("./pages/GroupsPage").then(m => ({ default: m.GroupsPage })));
const AdmissionPage = lazy(() => import("./pages/AdmissionPage").then(m => ({ default: m.AdmissionPage })));
const GradePage = lazy(() => import("./pages/GradePage").then(m => ({ default: m.GradePage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AdminPanel = lazy(() => import("./pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ProgressPage = lazy(() => import("./pages/ProgressPage").then(m => ({ default: m.ProgressPage })));
const ErrorPage = lazy(() => import("./pages/ErrorPage").then(m => ({ default: m.ErrorPage })));

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingState/>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cursos" element={<CoursesPage />} />
            <Route path="/cursos/:id" element={<CourseDetail />} />
            <Route path="/recursos" element={<ResourcesPage />} />
            <Route path="/chat" element={<FaqsPage />} />
            <Route path="/grupos" element={<GroupsPage />} />
            <Route path="/ingreso" element={<AdmissionPage />} />
            <Route path="/grado" element={<GradePage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            
            {/* RUTAS DEL PERFIL Y ADMIN */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/progreso" element={<ProgressPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/perfil/:username" element={<ProfilePage />} />

            {/* Manejo de rutas no encontradas (404) */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
