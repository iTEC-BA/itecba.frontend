import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import LoadingState from '../ui/LoadingState';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuthStore(); // Asumiendo que tu AuthContext retorna esto
  const location = useLocation();

  if (loading) {
    // Evita parpadeos si Firebase/Supabase está comprobando la sesión
    return <LoadingState />;
  }

  if (!user) {
    // Si no está logueado, lo mandamos al login y guardamos a dónde quería ir
    // para redirigirlo de vuelta cuando inicie sesión.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está logueado, renderiza la ruta hija (ej: ProfilePage, ResourcesPage)
  return <Outlet />;
};