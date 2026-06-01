import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@components/ui/icons/Icons';

interface HubNavCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  accentClass: string;
  iconBgClass: string;
  iconTextClass: string;
}

export const HubNavCard: React.FC<HubNavCardProps> = ({
  title, description, href, icon, accentClass, iconBgClass, iconTextClass,
}) => (
  <Link
    to={href}
    className={`group relative flex flex-col gap-2.5 p-4 bg-itec-box border border-white/[0.07] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${accentClass}`}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-white/[0.02] to-transparent" />
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${iconBgClass}`}>
      <div className={`w-4.5 h-4.5 ${iconTextClass}`}>
        <Icons type={icon} />
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-itec-text text-[13px] leading-tight mb-0.5">{title}</h3>
      <p className="text-[11px] text-itec-gray leading-snug">{description}</p>
    </div>
  </Link>
);
