import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Icons } from '../ui/icons/Icons';
import { UniversalSearch } from '../../features/home/components/organisms/UniversalSearch';
import { NotificationBell } from '../../features/home/components/organisms/NotificationBell';
import logo from "@assets/logo.png"
import { RewardsWidgetPoints } from '@/features/rewards/components/atoms/RewardsWidgetPoints';

export const TopNavbar = () => {
  const { user } = useAuth();
  return (
    <header className="h-16 w-full bg-itec-sidebar sticky top-0 z-50 flex items-center justify-between px-4 shrink-0">
      <nav className="flex items-center justify-center gap-2 w-max-62 mr-auto">
        <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-itec-primary text-white hover:bg-itec-primary/90 transition-colors">
          <img className="size-10" src={logo} alt="" />
        </Link>
        <div className="hidden md:flex justify-center items-center w-64">
          <UniversalSearch />
        </div>
      </nav>
      <nav className="flex items-center justify-end gap-3 w-max-62 ml-auto">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-itec-surface hover:bg-itec-surface/80 transition-colors cursor-pointer text-itec-text-reverse">
          <RewardsWidgetPoints/>
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-itec-surface hover:bg-itec-surface/80 transition-colors cursor-pointer text-itec-text-reverse">
          <Icons type="category" className='size-5' />
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-itec-surface hover:bg-itec-surface/80 transition-colors cursor-pointer text-itec-text-reverse">
          <NotificationBell />
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-itec-surface hover:bg-itec-surface/80 transition-colors cursor-pointer text-itec-text-reverse">
          {user?.photoURL ? (
            <Link to="/perfil" className="w-10 h-10 rounded-full bg-itec-surface overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img src={user.photoURL} alt={user.name || "Perfil"} className="w-full h-full object-cover" />
            </Link>
          ) : (
            <Link to="/login" className="w-10 h-10 rounded-full bg-itec-surface overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <Icons type="user" className="w-6 h-6 m-2 text-itec-text-reverse" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};