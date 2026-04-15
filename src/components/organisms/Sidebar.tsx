import React from 'react';
import logoItec from '../../assets/logo.png';
import { Icons } from '../atoms/Icons';
import { SidebarItem } from '../molecules/SidebarItem';
import { useAuth } from '../../context/AuthContext'; 

interface SidebarProps {
  isOpen: boolean;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobile }) => {
  const { user, isAuthenticated, isAdmin } = useAuth(); 

  const getIcon = (type: string) => (
    <div className="w-6 h-6 shrink-0">
      <Icons type={type} />
    </div>
  );

  // Helper para mostrar solo "PrimerNombre PrimerApellido" (Ej: Juan Perez)
  const getFormattedName = () => {
    if (!user?.name) return "Estudiante";
    const email = user.email || '';
    const username = email.split('@')[0];
    return username || "Estudiante";
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-itec-sidebar/90 z-40 md:hidden transition-opacity" 
          onClick={closeMobile}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-screen bg-itec-sidebar z-50 flex flex-col justify-between
        transition-all duration-300 ease-in-out group/sidebar
        md:translate-x-0 md:w-20 hover:md:w-64
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full px-3 py-4 overflow-x-hidden">
          
          <div className="flex items-center gap-4 p-3 mb-4 mt-2 shrink-0">
            <img src={logoItec} alt="ITEC Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 max-w-50 opacity-100 md:max-w-0 md:opacity-0 group-hover/sidebar:max-w-50 group-hover/sidebar:opacity-100 text-white">
              ITEC UTN
            </span>
          </div>
          
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem path="/" icon={getIcon("home")} label="Home" onClick={closeMobile} />
            
            <SidebarItem path="/recursos" icon={getIcon("compass")} label="Recursos" onClick={closeMobile} />
            <SidebarItem path="/cursos" icon={getIcon("play")} label="Cursos" onClick={closeMobile} />
            <SidebarItem path="/chat" icon={getIcon("message")} label="Preguntas Frecuentes" badge={2} onClick={closeMobile} />
            <SidebarItem path="/grupos" icon={getIcon("users")} label="Grupos de WA" onClick={closeMobile} />
            <SidebarItem path="/grado" icon={getIcon("degree")} label="Grado" onClick={closeMobile} />            
            <SidebarItem path="/ingreso" icon={getIcon("entry")} label="Ingreso" onClick={closeMobile} />
            <SidebarItem path="/nosotros" icon={getIcon("info")} label="Nosotros" onClick={closeMobile} />
          </nav>

          {/* PANEL ADMIN (Solo visible para admins) */}
          {isAuthenticated &&(
            <div className="my-4 pt-4 border-t border-itec-gray">
              <SidebarItem 
                path="/progreso" 
                icon={getIcon("bookmark")} 
                label="Progreso" 
                onClick={closeMobile} 
              />
            </div>
          )}
          {/* PERFIL DINÁMICO */}
          <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-itec-gray">
            {isAdmin && (
              <SidebarItem 
                path="/admin" 
                icon={getIcon("settings")} 
                label="Panel Admin" 
                onClick={closeMobile} 
              />
            )}
            <SidebarItem 
              path="/perfil" 
              icon={
                isAuthenticated && user?.photoURL ? (
                  <div className="w-6 h-6 shrink-0 rounded-full overflow-hidden border border-itec-gray">
                    <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
                  </div>
                ) : getIcon("profile")
              } 
              label={isAuthenticated ? getFormattedName() : "Iniciar Sesión"} 
              onClick={closeMobile} 
            />
          </div>
          
        </div>
      </aside>
    </>
  );
};