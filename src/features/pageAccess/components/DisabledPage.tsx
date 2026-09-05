import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, MapPin, MessageCircle, Ban, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DisabledPageProps {
  label?: string;
}

export const DisabledPage: React.FC<DisabledPageProps> = ({ label }) => {
  const navigate = useNavigate();

  const quickLinks = [
    { title: "Inicio", path: "/", icon: Home, color: "text-itec-blue-skye", bg: "bg-itec-blue-skye/10", border: "border-itec-blue-skye/20" },
    { title: "Mi Perfil", path: "/perfil", icon: User, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Buscar Aula", path: "/aulas", icon: MapPin, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { title: "Comunidad", path: "/foro", icon: MessageCircle, color: "text-itec-purple", bg: "bg-itec-purple/10", border: "border-itec-purple/20" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 w-full py-8">
      <div className="w-full max-w-2xl bg-itec-box border border-itec-border rounded-[2rem] p-8 md:p-10 text-center relative overflow-hidden">
        
        {/* Línea superior flat roja */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-itec-red-skye" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Mascota con la ruta correcta */}
          <img
            src="/icons/mascot/TEC-negado.png"
            alt="TEC Restringido"
            className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6 transition-transform hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/assets/logo.png"; }}
          />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-itec-red-skye/10 border border-itec-red-skye/20 text-itec-red-skye text-[10px] font-bold uppercase tracking-widest mb-4">
            <Ban className="w-3.5 h-3.5" /> Sección Inactiva
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
            {label ? `${label} no está disponible` : "Acceso Restringido"}
          </h1>
          
          <p className="text-sm text-itec-text/70 max-w-md mx-auto leading-relaxed mb-10">
            La administración desactivó temporalmente esta sección. Es posible que estemos realizando tareas de mantenimiento o actualizaciones.
          </p>

          {/* Accesos Rápidos */}
          <div className="w-full text-left mb-2">
            <h3 className="text-[10px] font-bold text-itec-muted uppercase tracking-widest mb-4 text-center sm:text-left">
              Continuá explorando
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={i} 
                    to={link.path}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-itec-surface border border-itec-border hover:bg-white/5 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${link.bg} ${link.border} ${link.color}`}>
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] font-semibold text-itec-text">{link.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-8 pt-6 border-t border-white/5 w-full flex justify-center">
            <Button variant="slate" hierarchy="outline" onClick={() => navigate(-1)} className="px-6 py-2.5">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver atrás
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
