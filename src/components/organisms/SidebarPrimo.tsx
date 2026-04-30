import { useAuth } from '../../context/AuthContext';
import { useSidebarLinks } from '../../hooks/useSidebarLinks';
import { SidebarPrimoItem } from '../molecules/SidebarPrimoItem';
import { Icons } from '../ui/Icons';

export const SidebarPrimo = () => {
  const { user } = useAuth();
  const { visibleLinks, isExpanded, toggleExpand, totalLinks } = useSidebarLinks();
  
  const ChevronIcon = isExpanded ? 'chevronUp' : 'chevronDown';

  return (
    <aside className="w-45 xl:w-50 h-full hidden md:flex flex-col bg-itec-sidebar overflow-y-auto hover:scrollbar-thin scrollbar-thumb-itec-surface">
      <nav className="flex flex-col gap-1 p-2 mt-2">

        {visibleLinks.map(({path, label, iconName, iconColor}) => (
          <SidebarPrimoItem
            key={path}
            path={path}
            label={label}
            iconName={iconName}
            iconColor={iconColor}
          />
        ))}

        {totalLinks > 5 && (
          <button
            onClick={toggleExpand}
            className="flex items-center gap-3 px-2 py-2 mt-1 rounded-lg transition-colors duration-200 cursor-pointer text-itec-text-reverse hover:bg-itec-surface w-full text-left group"
          >
            <div className="flex items-center justify-center rounded-full bg-itec-surface group-hover:bg-itec-surface/80 transition-colors w-9 h-9">
              {ChevronIcon && <Icons type={ChevronIcon} className="w-5 h-5 text-itec-text-reverse" />}
            </div>
            <span className="font-medium text-[15px]">
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </span>
          </button>
        )}

        <hr className="my-3 border-itec-surface border-t mx-2" />

        <div className="px-2 pt-1">
          <div className="flex items-center justify-between group cursor-pointer mb-2">
            <h3 className="text-[16px] font-semibold text-itec-text-reverse/60 group-hover:text-itec-text-reverse transition-colors">
              Tus accesos directos
            </h3>
            <span className="hidden group-hover:block text-itec-primary text-sm font-medium">Editar</span>
          </div>
          <p className="text-sm text-itec-text-reverse/40">Sin accesos directos recientes.</p>
        </div>
      </nav>
    </aside>
  );
};