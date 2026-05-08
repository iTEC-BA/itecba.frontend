import React, { useState, Suspense, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { Icons } from '@components/ui/icons/Icons';
import { BentoCard } from '@features/home/components/atoms/BentoCard';
import { SectionLabel } from '@features/home/components/atoms/SectionLabel';
import { LinkChip } from '@features/home/components/atoms/LinkChip';
import { useLinks } from '@features/home/hooks/useLinks';
import type { CampusLink } from '@features/home/services/linksService';

const EditLinksModal = React.lazy(() =>
  import('./EditLinksModal').then(m => ({ default: m.EditLinksModal }))
);

const LinksSkeletons: React.FC = () => (
  <div className="flex flex-wrap gap-2">
    {[80, 110, 72, 95, 88].map((w, i) => (
      <div
        key={i}
        className="h-7 rounded-full bg-white/[0.05] animate-pulse"
        style={{ width: `${w}px` }}
      />
    ))}
  </div>
);

const EmptyLinks: React.FC<{ isAdmin: boolean; onAdd: () => void }> = ({ isAdmin, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-5 gap-2.5 text-center border border-dashed border-itec-border rounded-xl">
    <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
      <Icons type="externalLink" className="w-4 h-4 text-itec-gray" />
    </div>
    <div>
      <p className="text-sm font-semibold text-itec-text">Sin links todavía</p>
      <p className="text-xs text-itec-gray mt-0.5">
        {isAdmin ? 'Agregá accesos a recursos universitarios.' : 'Próximamente habrá accesos rápidos aquí.'}
      </p>
    </div>
    {isAdmin && (
      <button
        onClick={onAdd}
        className="text-xs font-semibold bg-itec-blue-skye/15 text-itec-blue-skye border border-itec-blue-skye/30 px-4 py-1.5 rounded-full hover:bg-itec-blue-skye/20 transition-colors"
      >
        + Agregar link
      </button>
    )}
  </div>
);

export const UniversityLinksWidget: React.FC = () => {
  const { isAdmin } = useAuth();
  const { links, isLoading, reload, deleteLink } = useLinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<CampusLink | undefined>(undefined);

  const handleOpenAdd = useCallback(() => {
    setEditingLink(undefined);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((link: CampusLink) => {
    setEditingLink(link);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('¿Eliminar este link?')) return;
    try { await deleteLink(id); } catch { alert('Error al eliminar.'); }
  }, [deleteLink]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingLink(undefined);
    reload();
  }, [reload]);

  return (
    <BentoCard className="p-4 mb-5" hover={false}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <SectionLabel className="mb-0">Links universitarios</SectionLabel>
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-itec-blue-skye hover:text-blue-300 transition-colors"
          >
            <Icons type="plus" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        )}
      </div>

      {isLoading && <LinksSkeletons />}

      {!isLoading && links.length === 0 && (
        <EmptyLinks isAdmin={!!isAdmin} onAdd={handleOpenAdd} />
      )}

      {!isLoading && links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map(link => (
            <LinkChip
              key={link.id}
              icon={link.icon}
              title={link.title}
              url={link.url}
              isAdmin={!!isAdmin}
              onEdit={() => handleOpenEdit(link)}
              onDelete={() => handleDelete(link.id!)}
            />
          ))}
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1 bg-transparent border border-dashed border-white/15 hover:border-white/30 rounded-full px-3 py-1.5 text-[11px] font-medium text-itec-gray hover:text-itec-text transition-all duration-150"
            >
              <Icons type="plus" className="w-3 h-3" />
              Nuevo
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/60" />}>
          <EditLinksModal
            isOpen={isModalOpen}
            onClose={handleClose}
            editingLink={editingLink}
            onLinksUpdated={reload}
          />
        </Suspense>
      )}
    </BentoCard>
  );
};
