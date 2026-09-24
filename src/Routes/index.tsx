// src/routes/index.tsx
// Árbol de rutas completo de la aplicación. App.tsx solo monta providers
// globales y renderiza <AppRoutes/> — toda la config de qué página vive en
// qué URL está acá, separada en públicas/privadas para que cada archivo se
// pueda leer de un vistazo.
import { Routes, Route } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "@components/templates/ProtectedRoute";
import { PageSuspense } from "./PageSuspense";
import { PublicRoutes } from "./publicRoutes";
import { PrivateRoutes } from "./privateRoutes";
import { AdminPanel, ErrorPage } from "./lazyPages";

export const AppRoutes = () => (
  <Routes>
    {/* RUTAS PÚBLICAS */}
    {PublicRoutes}

    {/* RUTAS PRIVADAS */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<PageSuspense><AdminPanel /></PageSuspense>} />
      </Route>
      {PrivateRoutes}
    </Route>

    {/* 404 */}
    <Route path="*" element={<PageSuspense><ErrorPage /></PageSuspense>} />
  </Routes>
);
