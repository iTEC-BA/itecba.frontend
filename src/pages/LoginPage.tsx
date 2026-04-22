import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormLogin from "@/features/login/components/organisms/FormLogin";
import { Icons } from "@/components/ui/Icons";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

export const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const origin = location.state?.from?.pathname || "/app";
      navigate(origin, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) return null;

  return (
    <DashboardLayout>
      <div className="w-full h-dvh flex flex-col items-center justify-center md:flex-row relative">
        <div className="animate-[fade-in_0.6s_ease-out]">
          <FormLogin />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 bg-itec-sidebar/80 border border-itec-surface/10 py-4 px-6 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)]">
            <div className="flex -space-x-3 shrink-0">
              <img
                className="w-10 h-10 rounded-full border-2 border-[#111111] object-cover"
                src="https://placehold.co/100x100/1e293b/ffffff?text=U"
                alt="Estudiante"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-[#111111] object-cover"
                src="https://placehold.co/100x100/3b82f6/ffffff?text=T"
                alt="Estudiante"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-[#111111] object-cover"
                src="https://placehold.co/100x100/10b981/ffffff?text=N"
                alt="Estudiante"
              />
            </div>
            <span className="text-sm text-slate-400 font-medium text-center sm:text-left leading-tight">
              Únete a <strong className="text-white">+1.200 alumnos</strong>{" "}
              <br className="hidden sm:block" /> activos en ITEC.BA
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
