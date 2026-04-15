import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetail } from "./pages/CourseDetail";
import { ResourcesPage } from "./pages/ResourcesPage"; 
import { FaqsPage } from "./pages/FaqsPage";
import { GroupsPage } from "./pages/GroupsPage"; 
import { AdmissionPage } from "./pages/AdmissionPage";
import { GradePage } from "./pages/GradePage";
import { AboutPage } from "./pages/AboutPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ErrorPage } from "./pages/ErrorPage";
import { AdminPanel } from './pages/AdminPanel';
import { ProgressPage } from './pages/ProgressPage';

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "cursos", element: <CoursesPage /> },
      { path: "cursos/:id", element: <CourseDetail /> },
      { path: "recursos", element: <ResourcesPage /> },
      { path: "chat", element: <FaqsPage /> },
      { path: "grupos", element: <GroupsPage /> },
      { path: "ingreso", element: <AdmissionPage /> },
      { path: "grado", element: <GradePage /> },
      { path: "nosotros", element: <AboutPage /> },
      
      // RUTAS DEL PERFIL
      { path: "admin", element: <AdminPanel /> },
      { path: "progreso", element: <ProgressPage />},
      { path: "perfil", element: <ProfilePage /> }, // Cuando entra directo a Iniciar Sesión
      { path: "perfil/:username", element: <ProfilePage /> }, // Cuando ya tiene su usuario (Ej: /perfil/jtumiricuellar)
    ],
  },
]);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;