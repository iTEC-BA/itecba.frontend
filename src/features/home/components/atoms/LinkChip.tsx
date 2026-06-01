import React from 'react';
import { Icons } from '@components/ui/icons/Icons';
import { Button } from '@components/ui/Button';

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
      className="flex items-center gap-1.5 bg-itec-red text-itec-text font-semibold rounded-full px-3 py-2 transition-all duration-150 select-none"
    >
      <span className="leading-none">{icon}</span>
      <span className="text-xs">{title}</span>
    </a>
    {isAdmin && (
      <div className="absolute -top-1 -right-1 hidden group-hover:flex items-center gap-0.5 z-10">
        {onEdit && (
          <Button
            onClick={(e) => { e.preventDefault(); onEdit(); }}
            variant="primary"
            hierarchy="solid"
            className="w-5 h-5 p-0 rounded-full"
            title="Editar"
          >
            <Icons type="edit" className="w-2.5 h-2.5 text-white" />
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={(e) => { e.preventDefault(); onDelete(); }}
            variant="danger"
            hierarchy="solid"
            className="w-5 h-5 p-0 rounded-full"
            title="Eliminar"
          >
            <Icons type="trash" className="w-2.5 h-2.5 text-white" />
          </Button>
        )}
      </div>
    )}
  </div>
);
