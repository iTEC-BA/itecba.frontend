import React from 'react';
import { Icons } from '@components/ui/icons/Icons';
import type { CampusLink } from '@features/home/services/linksService';

interface Props {
  link: CampusLink;
  onEdit: (link: CampusLink) => void;
  onDelete: (id: string) => void;
}

export const LinkListItem: React.FC<Props> = ({ link, onEdit, onDelete }) => (
  <div className="flex items-center gap-3 bg-itec-bg border border-white/[0.06] p-3 rounded-xl group hover:border-itec-border transition-colors">
    <span className="text-xl shrink-0 w-8 text-center">{link.icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-itec-text truncate">{link.title}</p>
      <p className="text-[10px] text-itec-gray truncate mt-0.5">{link.url}</p>
    </div>
    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
      <button
        onClick={() => onEdit(link)}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-itec-box hover:bg-itec-blue-skye/20 text-itec-gray hover:text-itec-blue-skye transition-colors"
        title="Editar"
      >
        <Icons type="edit" className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onDelete(link.id!)}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-itec-box hover:bg-itec-red/20 text-itec-gray hover:text-itec-red transition-colors"
        title="Eliminar"
      >
        <Icons type="trash" className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);
