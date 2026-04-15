import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number | 'dot'; 
  disabled?: boolean; // <-- NUEVA PROP
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, badge, disabled = false, onClick }) => {
  // Si está deshabilitado, renderizamos un div en lugar de un NavLink
  if (disabled) {
    return (
      <div
        className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group/item opacity-50 cursor-default text-gray-500 relative"
        title="Próximamente" // Tooltip nativo del navegador
      >
        <div className="relative shrink-0">
          <div>{icon}</div>
        </div>

        <span className="whitespace-nowrap overflow-hidden transition-all duration-300 max-w-50 opacity-100 md:max-w-0 md:opacity-0 group-hover/sidebar:max-w-50 group-hover/sidebar:opacity-100 flex flex-col">
          <span className="">{label}</span>
          <span className="text-[9px] uppercase tracking-widest text-itec-blue-skye font-bold absolute -bottom-1">Próximamente</span>
        </span>
      </div>
    );
  }

  // Comportamiento normal si NO está deshabilitado
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group/item hover:bg-white/10
        ${isActive ? 'font-bold text-white' : 'font-normal text-gray-300'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className="relative shrink-0">
            <div className={`transition-transform duration-200 group-hover/item:scale-105 ${isActive ? 'text-white' : ''}`}>
              {icon}
            </div>
            
            {badge === 'dot' && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-itec-bg rounded-full"></span>
            )}
            {typeof badge === 'number' && badge > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-itec-bg flex items-center justify-center">
                {badge}
              </span>
            )}
          </div>

          <span className="whitespace-nowrap overflow-hidden transition-all duration-300 max-w-50 opacity-100 md:max-w-0 md:opacity-0 group-hover/sidebar:max-w-50 group-hover/sidebar:opacity-100">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};