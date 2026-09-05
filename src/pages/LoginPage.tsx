import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import FormLogin from "@features/login/components/organisms/FormLogin";
import { MainLayout } from "@/components/templates/MainLayout";
import { usePageTitle } from "@hooks/usePageTitle";

export const LoginPage: React.FC = () => {
  usePageTitle("Iniciar Sesión");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const origin = location.state?.from?.pathname || "/";
      navigate(origin, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) return null;

  return (
    <MainLayout>
      <div className="w-full min-h-[85vh] flex flex-col items-center justify-center relative px-4 py-8">
        <div className="animate-[fade-in_0.5s_ease-out] w-full flex flex-col items-center">
          
          <FormLogin />

          {/* Widget social de estudiantes */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 bg-itec-box border border-itec-border py-3 px-6 rounded-2xl">
            <div className="flex -space-x-3 shrink-0">
              <img className="w-9 h-9 rounded-full border-2 border-itec-box object-cover" src="https://i.pravatar.cc/100?img=1" alt="Estudiante" />
              <img className="w-9 h-9 rounded-full border-2 border-itec-box object-cover" src="https://i.pravatar.cc/100?img=2" alt="Estudiante" />
              <img className="w-9 h-9 rounded-full border-2 border-itec-box object-cover" src="https://i.pravatar.cc/100?img=3" alt="Estudiante" />
            </div>
            <span className="text-sm text-itec-muted font-medium text-center sm:text-left leading-tight">
              Únete a <strong className="text-white">+1.200 alumnos</strong>{" "}
              <br className="hidden sm:block" /> activos en iTEC BA
            </span>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};
