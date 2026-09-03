import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { LayoutModal } from "@/components/templates/LayoutModal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

interface Props { isOpen: boolean; onClose: () => void; courseTitle: string; materia: string; }

export const CourseAddResourceModal: React.FC<Props> = ({ isOpen, onClose, courseTitle, materia }) => {
  const [title, setTitle] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${API_URL}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: title.trim(), materia, driveUrl: driveUrl.trim(), carrera: "General", nivel: 1 }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error ?? "Error del servidor"); }
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["resources"] }); onClose(); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !driveUrl.trim()) { setError("Completá todos los campos."); return; }
    setError(""); mutation.mutate();
  };

  return (
    <LayoutModal isOpen={isOpen} onClose={onClose} title="Vincular archivo" description={`Se publicará en ${courseTitle}`} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {error && <p className="text-itec-red text-xs font-bold bg-itec-red/10 border border-itec-red/30 p-3 rounded-xl">{error}</p>}
        <div>
          <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-1.5">Nombre del archivo</label>
          <Input fullWidth required placeholder="Ej: Diapositivas Clase 1" value={title} onChange={(e: any) => setTitle(e.target.value)} className="bg-itec-box border-itec-border focus:border-itec-section-courses py-2.5" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-1.5">Enlace (Drive, PDF...)</label>
          <Input fullWidth type="url" required placeholder="https://drive.google.com/..." value={driveUrl} onChange={(e: any) => setDriveUrl(e.target.value)} className="bg-itec-box border-itec-border focus:border-itec-section-courses py-2.5" />
        </div>
        <Button type="submit" variant="primary" hierarchy="solid" fullWidth isLoading={mutation.isPending} className="mt-2 bg-itec-section-courses hover:bg-itec-section-courses/90 border-none text-white">
          {mutation.isPending ? "Guardando..." : "Vincular archivo"}
        </Button>
      </form>
    </LayoutModal>
  );
};
