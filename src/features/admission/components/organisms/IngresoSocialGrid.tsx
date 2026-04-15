import React from 'react';
import { Icons } from '@/components/atoms/Icons';

interface SocialLink {
  id: string;
  url: string;
  hoverClass: string;
  iconType: string;
  colorClass: string;
  title: string;
  subtitle: string;
}

interface Props {
  links: SocialLink[];
}

export const IngresoSocialGrid: React.FC<Props> = ({ links }) => {
  
  // Función encapsulada solo para este componente
  const renderIcon = (type: string, colorClass: string) => {
    const containerClasses = `w-7 h-7 mb-3 group-hover:scale-110 transition-transform ${colorClass}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let iconType = type as any;
    if (['whatsapp', 'instagram', 'youtube', 'sheets'].includes(type)) {
      iconType = type;
    }
    return (
      <div className={containerClasses}>
        <Icons type={iconType} />
      </div>
    );
  };

  return (
    <section className="mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 pl-1">
        Comunidad y Redes
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map(link => (
          <a 
            key={link.id} 
            href={link.url} 
            target="_blank" rel="noopener noreferrer" 
            className={`bg-itec-surface border border-itec-gray ${link.hoverClass} p-4 rounded-xl flex flex-col items-center text-center group transition-all hover:-translate-y-1 shadow-md`}
          >
            {renderIcon(link.iconType, link.colorClass)}
            <h4 className="font-bold text-white text-sm mb-0.5">{link.title}</h4>
            <span className="text-[10px] text-gray-500">{link.subtitle}</span>
          </a>
        ))}
      </div>
    </section>
  );
};