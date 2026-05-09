import React, { useState, useEffect, useCallback } from "react";
import { Icons } from "@components/ui/icons/Icons";
import { LinkListItem } from "@features/home/components/molecules/LinkListItem";
import { LinkFormInline } from "@features/home/components/molecules/LinkFormInline";
import { useLinks } from "@features/home/hooks/useLinks";
import type { CampusLink } from "@features/home/services/linksService";
import { LayoutModal } from "@/components/templates/LayoutModal";

type FormMode = "add" | "edit" | null;

interface LinkFormSectionProps {
  formMode: FormMode;
  currentEditing?: CampusLink;
  onSave: (data: Omit<CampusLink, "id">) => Promise<void>;
  onCancel: () => void;
  totalLinks: number;
}

const LinkFormSection: React.FC<LinkFormSectionProps> = ({
  formMode,
  currentEditing,
  onSave,
  onCancel,
  totalLinks,
}) => {
  if (!formMode) return null;

  return (
    <div>
      <p className="text-xs font-bold text-itec-gray uppercase tracking-widest mb-3">
        {formMode === "edit" ? "Editar link" : "Agregar link"}
      </p>
      <LinkFormInline
        initial={currentEditing}
        onSave={onSave}
        onCancel={onCancel}
        totalLinks={totalLinks}
      />
    </div>
  );
};

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/15 rounded-xl text-sm font-semibold text-itec-gray hover:text-itec-text hover:border-white/25 transition-all"
  >
    <Icons type="plus" className="w-4 h-4" />
    Agregar nuevo link
  </button>
);

interface LinkListSectionProps {
  links: CampusLink[];
  isLoading: boolean;
  onEdit: (link: CampusLink) => void;
  onDelete: (id: string) => void;
}

const LinkListSection: React.FC<LinkListSectionProps> = ({
  links,
  isLoading,
  onEdit,
  onDelete,
}) => (
  <div>
    <p className="text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-3">
      Links activos ({links.length})
    </p>
    {isLoading ? (
      <div className="flex items-center justify-center py-6">
        <div className="w-5 h-5 border-2 border-itec-border border-t-itec-blue-skye rounded-full animate-spin" />
      </div>
    ) : links.length === 0 ? (
      <p className="text-center py-6 text-itec-gray text-sm">
        No hay links. ¡Agregá el primero!
      </p>
    ) : (
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <LinkListItem
            key={link.id}
            link={link}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    )}
  </div>
);

interface ModalFooterProps {
  onClose: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onClose }) => (
  <div className="px-5 py-3 border-t border-white/6 shrink-0 flex justify-end">
    <button
      onClick={onClose}
      className="text-sm font-semibold bg-itec-blue-skye hover:bg-itec-blue text-white px-5 py-2 rounded-xl transition-colors"
    >
      Listo
    </button>
  </div>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLinksUpdated: () => void;
  editingLink?: CampusLink;
}

export const EditLinksModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLinksUpdated,
  editingLink,
}) => {
  const { links, isLoading, addLink, updateLink, deleteLink, reload } =
    useLinks();
  const [formMode, setFormMode] = useState<FormMode>(editingLink ? "edit" : null);
  const [currentEditing, setCurrentEditing] = useState<CampusLink | undefined>(
    editingLink,
  );

  useEffect(() => {
    if (isOpen) {
      reload();
      if (editingLink) {
        setCurrentEditing(editingLink);
        setFormMode("edit");
      }
    }
  }, [isOpen, editingLink, reload]);

  const handleSave = useCallback(
    async (data: Omit<CampusLink, "id">) => {
      if (formMode === "edit" && currentEditing?.id) {
        await updateLink(currentEditing.id, data);
      } else {
        await addLink(data);
      }
      setFormMode(null);
      setCurrentEditing(undefined);
      onLinksUpdated();
    },
    [formMode, currentEditing, addLink, updateLink, onLinksUpdated],
  );

  const handleEditItem = useCallback((link: CampusLink) => {
    setCurrentEditing(link);
    setFormMode("edit");
  }, []);

  const handleDeleteItem = useCallback(
    async (id: string) => {
      if (!window.confirm("¿Eliminar este link?")) return;
      await deleteLink(id);
      onLinksUpdated();
    },
    [deleteLink, onLinksUpdated],
  );

  const handleCancel = useCallback(() => {
    setFormMode(null);
    setCurrentEditing(undefined);
  }, []);

  if (!isOpen) return null;

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Gestionar Links">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <LinkFormSection
          formMode={formMode}
          currentEditing={currentEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          totalLinks={links.length}
        />

        {!formMode && (
          <AddButton
            onClick={() => {
              setCurrentEditing(undefined);
              setFormMode("add");
            }}
          />
        )}

        <LinkListSection
          links={links}
          isLoading={isLoading}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      </div>

      <ModalFooter onClose={onClose} />
    </LayoutModal>
  );
};