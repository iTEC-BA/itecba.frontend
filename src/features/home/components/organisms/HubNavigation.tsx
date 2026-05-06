import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons/Icons";

interface NavItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: "blue" | "orange" | "green" | "purple" | "yellow" | "pink";
}

const NAVIGATION_ITEMS: NavItem[] = [
  { title: "Clases y Cursos", description: "Videos de apoyo", href: "/cursos", icon: "play", color: "blue" },
  { title: "Aportes", description: "Resúmenes y Finales", href: "/explore", icon: "compass", color: "orange" },
  { title: "Comunidades WA", description: "Grupos por comisión", href: "/grupos", icon: "users", color: "green" },
  { title: "Ingreso UTN", description: "TIVU y Módulo B", href: "/ingreso", icon: "entry", color: "purple" },
  { title: "Grado (Planes 23)", description: "Planes y correlativas", href: "/grado", icon: "degree", color: "yellow" },
  { title: "Sobre ✳️TEC", description: "Valores y Contacto", href: "/nosotros", icon: "heart", color: "pink" },
];

export const HubNavigation: React.FC = () => {
  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8 relative z-10">
      {NAVIGATION_ITEMS.map((item) => (
        <NavCard key={item.href} {...item} />
      ))}
    </nav>
  );
};

// Sub-componente expresivo
const NavCard: React.FC<NavItem> = ({ title, description, href, icon, color }) => {
  // Mapeo de colores dinámicos para Tailwind
  const colorVariants = {
    blue: "hover:border-itec-blue hover:bg-blue-500/5 text-blue-400 bg-blue-500/10",
    orange: "hover:border-orange-500 hover:bg-orange-500/5 text-orange-400 bg-orange-500/10",
    green: "hover:border-green-500 hover:bg-green-500/5 text-green-400 bg-green-500/10",
    purple: "hover:border-purple-500 hover:bg-purple-500/5 text-purple-400 bg-purple-500/10",
    yellow: "hover:border-yellow-500 hover:bg-yellow-500/5 text-yellow-400 bg-yellow-500/10",
    pink: "hover:border-pink-500 hover:bg-pink-500/5 text-pink-400 bg-pink-500/10",
  };

  const [hoverBorder, iconColors] = colorVariants[color].split(" text-");

  return (
    <Link 
      to={href} 
      className={`bg-itec-box border border-itec-gray/10 rounded-xl p-3.5 flex items-center gap-3 transition-all group ${hoverBorder}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-${iconColors}`}>
        <div className="w-5 h-5">
          <Icons type={icon} />
        </div>
      </div>
      <div>
        <h3 className="font-bold text-itec-text text-[13px]">{title}</h3>
        <p className="text-[11px] text-gray-500">{description}</p>
      </div>
    </Link>
  );
};
