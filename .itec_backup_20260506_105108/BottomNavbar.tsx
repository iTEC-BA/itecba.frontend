import { Link } from "react-router-dom";
import { Icons } from "../ui/icons/Icons";
import Raccoon from "../ui/icons/Raccoon";

export const BottomNavbar = () => {
  return (
    <nav className="h-14 w-full bg-itec-sidebar sticky bottom-0 z-99 flex items-center justify-around p-4 shrink-0">
      <div className="flex gap-6 justify-around w-full">
        <Link to="/" className="flex items-center justify-center flex-col">
          <Icons type="home" className="w-7 h-7 m-2 text-itec-text-reverse" />
          <span className="text-[10px] transform -translate-y-2">Inicio</span>
        </Link>
        <Link to="/grupos" className="flex items-center justify-center flex-col">
          <Icons type="search" className="w-7 h-7 m-2 text-itec-text-reverse" />
          <span className="text-[10px] transform -translate-y-2">Buscar</span>
        </Link>
        <Link to="/" className="flex items-center justify-center flex-col">
          <span className="bg-itec-red rounded-full p-1">
            <Raccoon size={32} fill1="#ffffff" fill2="#ffffff" fill3="#0C1014"/>
          </span>
        </Link>
        <Link to="/grupos" className="flex items-center justify-center flex-col">
          <Icons type="users" className="w-7 h-7 m-2 text-itec-text-reverse" />
          <span className="text-[10px] transform -translate-y-2">Grupos</span>
        </Link>
        <Link to="/" className="flex items-center justify-center flex-col">
          <Icons type="home" className="w-7 h-7 m-2 text-itec-text-reverse" />
          <span className="text-[10px] transform -translate-y-2">Inicio</span>
        </Link>
      </div>
    </nav>
  );
};
