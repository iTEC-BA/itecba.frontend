import { BottomNavbar } from "../molecules/BottomNavbar";
import { SidebarPrimo } from "../organisms/SidebarPrimo";
import { TopNavbar } from "../molecules/TopNavbar";
export const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col w-full h-screen bg-itec-background text-itec-text overflow-hidden">
      <TopNavbar />
      <section className="flex flex-1 overflow-hidden">
        {/* Columna Izquierda: Menú Principal */}
        <SidebarPrimo />
        {children}
      </section>
      <nav className="flex md:hidden">
        <BottomNavbar />
      </nav>
    </div>
  );
};
