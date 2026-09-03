import React from 'react';
import { Icons } from '@/components/ui/icons/Icons';

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
  const renderIcon = (type: string, colorClass: string) => {
    const containerClasses = `w-8 h-8 mb-3.5 group-hover:scale-125 transition-transform duration-300 ${colorClass}`;
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
      <h3 className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest mb-5 pl-1">
        Comunidad y Redes
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {links.map(link => (
          <a 
            key={link.id} 
            href={link.url} 
            target="_blank" rel="noopener noreferrer" 
            className={`bg-itec-box border border-white/10 ${link.hoverClass} p-5 rounded-2xl flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1.5 shadow-lg relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-current"></div>
            {renderIcon(link.iconType, link.colorClass)}
            <h4 className="font-bold text-white text-sm mb-1">{link.title}</h4>
            <span className="text-[10px] text-white/50 font-medium">{link.subtitle}</span>
          </a>
        ))}
      </div>
    </section>
  );
};
