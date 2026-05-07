import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '@components/ui/icons/Icons';
import { LinkListItem } from '@features/home/components/molecules/LinkListItem';
import { LinkFormInline } from '@features/home/components/molecules/LinkFormInline';
import { useLinks } from '@features/home/hooks/useLinks';
import type { CampusLink } from '@features/home/services/linksService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLinksUpdated: () => void;
  editingLink?: CampusLink;
}

export const EditLinksModal: React.FC<Props> = ({
  isOpen, onClose, onLinksUpdated, editingLink,
}) => {
  const { links, isLoading, addLink, updateLink, deleteLink, reload } = useLinks();
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(
    editingLink ? 'edit' : null
  );
  const [currentEditing, setCurrentEditing] = useState<CampusLink | undefined>(editingLink);

  useEffect(() => {
    if (isOpen) {
      reload();
      if (editingLink) {
        setCurrentEditing(editingLink);
        setFormMode('edit');
      }
    }
  }, [isOpen, editingLink]);

  const handleSave = useCallback(async (data: Omit<CampusLink, 'id'>) => {
    if (formMode === 'edit' && currentEditing?.id) {
      await updateLink(currentEditing.id, data);
    } else {
      await addLink(data);
    }
    setFormMode(null);
    setCurrentEditing(undefined);
    onLinksUpdated();
  }, [formMode, currentEditing, addLink, updateLink, onLinksUpdated]);

  const handleEditItem = useCallback((link: CampusLink) => {
    setCurrentEditing(link);
    setFormMode('edit');
  }, []);

  const handleDeleteItem = useCallback(async (id: string) => {
    if (!window.confirm('¿Eliminar este link?')) return;
    await deleteLink(id);
    onLinksUpdated();
  }, [deleteLink, onLinksUpdated]);

  const handleCancel = useCallback(() => {
    setFormMode(null);
    setCurrentEditing(undefined);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-itec-box border border-white/[0.08] rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
          <div>
            <h2 className="text-base font-bold text-itec-text">Gestionar Links</h2>
            <p className="text-[11px] text-itec-gray mt-0.5">
              Visibles en el home para todos los usuarios
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-itec-gray hover:text-itec-text transition-colors"
          >
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {formMode ? (
            <div>
              <p className="text-xs font-bold text-itec-gray uppercase tracking-widest mb-3">
                {formMode === 'edit' ? 'Editar link' : 'Agregar link'}
              </p>
              <LinkFormInline
                initial={currentEditing}
                onSave={handleSave}
                onCancel={handleCancel}
                totalLinks={links.length}
              />
            </div>
          ) : (
            <button
              onClick={() => { setCurrentEditing(undefined); setFormMode('add'); }}
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/15 rounded-xl text-sm font-semibold text-itec-gray hover:text-itec-text hover:border-white/25 transition-all"
            >
              <Icons type="plus" className="w-4 h-4" />
              Agregar nuevo link
            </button>
          )}

          <div>
            <p className="text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-3">
              Links activos ({links.length})
            </p>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-white/10 border-t-itec-blue-skye rounded-full animate-spin" />
              </div>
            ) : links.length === 0 ? (
              <p className="text-center py-6 text-itec-gray text-sm">
                No hay links. ¡Agregá el primero!
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {links.map(link => (
                  <LinkListItem
                    key={link.id}
                    link={link}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/[0.06] shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm font-semibold bg-itec-blue-skye hover:bg-itec-blue text-white px-5 py-2 rounded-xl transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
