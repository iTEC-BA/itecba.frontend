import React from 'react';
import { Icons } from '@components/ui/icons/Icons';

interface LinkChipProps {
  icon: string;
  title: string;
  url: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const LinkChip: React.FC<LinkChipProps> = ({
  icon, title, url, onEdit, onDelete, isAdmin,
}) => (
  <div className="group relative inline-flex">
    <a
      href={url}
      target={url.startsWith('/') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 bg-itec-box border border-white/[0.08] hover:border-white/20 rounded-full px-3 py-1.5 text-[11px] font-medium text-itec-gray hover:text-itec-text transition-all duration-150 select-none"
    >
      <span className="text-sm leading-none">{icon}</span>
      <span className="truncate max-w-[120px]">{title}</span>
    </a>
    {isAdmin && (
      <div className="absolute -top-1 -right-1 hidden group-hover:flex items-center gap-0.5 z-10">
        {onEdit && (
          <button
            onClick={(e) => { e.preventDefault(); onEdit(); }}
            className="w-5 h-5 bg-itec-blue-skye rounded-full flex items-center justify-center shadow-lg"
            title="Editar"
          >
            <Icons type="edit" className="w-2.5 h-2.5 text-white" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.preventDefault(); onDelete(); }}
            className="w-5 h-5 bg-itec-red rounded-full flex items-center justify-center shadow-lg"
            title="Eliminar"
          >
            <Icons type="trash" className="w-2.5 h-2.5 text-white" />
          </button>
        )}
      </div>
    )}
  </div>
);
