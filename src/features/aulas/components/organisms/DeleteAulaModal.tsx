// src/features/aulas/components/organisms/DeleteAulaModal.tsx
import React, { useState } from "react";
import { LayoutModal }  from "@components/templates/LayoutModal";
import { Button }       from "@components/ui/Button";
import { aulasService } from "../../services/aulas.service";
import { invalidateAulasCache } from "../../hooks/useAulas";
import type { AulaResumen } from "../../types/aulas.types";

interface Props {
  isOpen:    boolean;
  onClose:   () => void;
  onDeleted: () => void;
  aula:      AulaResumen | null;
}

export const DeleteAulaModal: React.FC<Props> = ({ isOpen, onClose, onDeleted, aula }) => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleConfirm = async () => {
    if (!aula) return;
    setLoading(true); setError("");
    try {
      await aulasService.softDelete(aula._id);
      invalidateAulasCache();
      onDeleted();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Confirmar desactivación" maxWidth="max-w-md">
      <div className="flex flex-col gap-5 px-6 py-5">
        <p className="text-sm text-itec-muted">
          ¿Confirmás que querés desactivar el aula{" "}
          <span className="font-bold text-itec-text">{aula?.numero}</span>?{" "}
          El aula quedará oculta para los estudiantes pero no se borrará de la base de datos.
        </p>
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">{error}</p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" hierarchy="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" hierarchy="solid" onClick={handleConfirm} isLoading={loading}>
            Sí, desactivar
          </Button>
        </div>
      </div>
    </LayoutModal>
  );
};
