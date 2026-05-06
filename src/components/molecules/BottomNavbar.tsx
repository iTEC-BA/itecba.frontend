import { Link, NavLink } from "react-router-dom";
// import { useAuth } from '../../context/AuthContext';
import { Icons } from "../ui/icons/Icons";
import Raccoon from "../ui/icons/Raccoon";
// import { UniversalSearch } from '../../features/home/components/organisms/UniversalSearch';
// import { NotificationBell } from '../../features/home/components/organisms/NotificationBell';
// import { useSidebarLinks } from '@hooks/useSidebarLinks';
// import logo from "@assets/logo.png"

export const BottomNavbar = () => {
  // const { visibleLinksCenter } = useSidebarLinks();
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
// export const BottomNavbar = () => {
//   const { user } = useAuth();
//   const { visibleLinksCenter } = useSidebarLinks();
//   return (
//     <nav className="h-16 w-full bg-itec-sidebar sticky top-0 z-50 flex items-center justify-between px-4 shrink-0">
//       {/* Izquierda: Logo y Buscador Estático */}
//       <div className="flex items-center justify-center gap-2 w-max-62 mr-auto">
//         <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-itec-primary text-white hover:bg-itec-primary/90 transition-colors">
//           <img className="size-10" src={logo} alt="" />
//         </Link>
//         <div className="hidden md:flex justify-center items-center w-64">
//           <UniversalSearch />
//         </div>
//       </div>

//       {/* Centro: Espacio reservado para los tabs estilo Facebook (opcional a futuro) */}
//       <div className="hidden md:flex gap-6 justify-center w-full m-auto">
//         {visibleLinksCenter.map(({path, iconName}) => (
//         <NavLink to={path}>
//             <Icons type={iconName} className="w-6 h-6 m-2 text-itec-text-reverse" />
//         </NavLink>
//         ))
//         }
//       </div>

//       {/* Derecha: Notificaciones y Perfil Estáticos */}
//       <div className="flex items-center justify-end gap-3 w-max-62 ml-auto">
//         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-itec-surface hover:bg-itec-surface/80 transition-colors cursor-pointer text-itec-text-reverse">
//           <Icons type="category" className='size-5' />
//         </div>
//         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-itec-surface hover:bg-itec-surface/80 transition-colors cursor-pointer text-itec-text-reverse">
//           <NotificationBell />
//         </div>
//         <Link to="/perfil" className="w-10 h-10 rounded-full bg-itec-surface overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
//           {user?.photoURL ? (
//             <img src={user.photoURL} alt={user.name || "Perfil"} className="w-full h-full object-cover" />
//           ) : (
//             <Icons type="user" className="w-6 h-6 m-2 text-itec-text-reverse" />
//           )}
//         </Link>
//       </div>

//     </nav>
//   );
// };
