// src/components/templates/SidebarLayout.tsx
// Sin cambios de lógica — el sidebar ya se posiciona como fixed en mobile,
// así que el layout no necesita ajustes de z-index adicionales.

import { NavbarBottom } from "@/components/organisms/NavbarBottom";
import { Sidebar } from "@components/organisms/Sidebar";
import { NavbarTop } from "@/components/organisms/NavbarTop";

export const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col w-full h-screen bg-itec-background text-itec-text overflow-hidden">
      <NavbarTop />

      <section className="flex flex-1 overflow-hidden relative">
        {/* Sidebar: en desktop ocupa espacio en el flujo; en mobile es fixed (drawer) */}
        <Sidebar />
        {children}
      </section>

      {/* BottomNavbar solo visible en mobile */}
      <nav className="flex md:hidden shrink-0">
        <NavbarBottom />
      </nav>
    </div>
  );
};
