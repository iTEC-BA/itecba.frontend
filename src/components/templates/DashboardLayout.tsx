import React, { useState } from "react";
import { Sidebar } from "../organisms/Sidebar";
import { ChatbotWidget } from "../organisms/ChatbotWidget"; // <-- IMPORTAR AQUÍ
import { BackgroundBlur } from "../atoms/BackgroundBlur"; // <-- 1. Importar el componente
import logoItec from "../../assets/logo.png"; // <-- IMPORTA
import { Icons } from "../atoms/Icons";
// Agrega esta importación arriba:
import { GlobalAnnouncement } from '../organisms/GlobalAnnouncement';
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-itec-bg text-itec-text overflow-hidden relative isolate">
      <BackgroundBlur />
      {/* Sidebar recibe su estado */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 overflow-y-auto flex flex-col md:pl-20 transition-all duration-300 relative z-0">
        {/* TOP BAR MOBILE (Solo visible en celular) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#262626] bg-[#000000] sticky top-0 z-50">
          <div className="font-bold text-xl flex items-center gap-2 text-white">
            <img
              src={logoItec}
              alt="ITEC Logo"
              className="w-8 h-8 object-contain"
            />
            ITEC UTN
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition"
          >
            {/* SOLUCIÓN: Envolvemos el ícono en un div de 24x24px (w-6 h-6) */}
            <div className="w-6 h-6">
              <Icons type="burger" />
            </div>
          </button>
        </div>

        {/* Contenido inyectado de la página */}
        <div className="p-4 md:p-8 w-full 2xl:max-w-7xl mx-auto">{children}</div>
      </main>

      {/* AÑADIR EL CHATBOT AQUÍ */}
      <GlobalAnnouncement />
      <ChatbotWidget />
    </div>
  );
};
