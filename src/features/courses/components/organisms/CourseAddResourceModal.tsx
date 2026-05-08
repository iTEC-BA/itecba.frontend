import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons/Icons";
import { auth } from "@/lib/firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const FIELD_CLS = "w-full bg-white/[0.04] border border-itec-border text-itec-text text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-itec-blue-skye/60 focus:ring-2 focus:ring-itec-blue-skye/10 transition-all placeholder:text-itec-gray/50";
const LABEL_CLS = "block text-[10px] font-bold text-itec-gray uppercase tracking-widest mb-1.5";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-itec-box border border-itec-border rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <h2 className="text-sm font-black text-itec-text">Vincular archivo</h2>
            <p className="text-xs text-itec-gray">Se publicará en <span className="text-itec-text font-bold">{courseTitle}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-itec-gray hover:text-itec-text transition-all">
            <Icons type="close" className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-itec-red text-xs font-bold bg-itec-red/10 border border-itec-red/30 p-3 rounded-xl">{error}</p>}
          <div>
            <label className={LABEL_CLS}>Nombre del archivo</label>
            <input type="text" required placeholder="Ej: Diapositivas Clase 1" value={title} onChange={(e) => setTitle(e.target.value)} className={FIELD_CLS} />
          </div>
          <div>
            <label className={LABEL_CLS}>Enlace (Drive, PDF...)</label>
            <input type="url" required placeholder="https://drive.google.com/..." value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} className={FIELD_CLS} />
          </div>
          <button type="submit" disabled={mutation.isPending} className="w-full py-3 rounded-xl bg-itec-blue-skye text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98] mt-2">
            {mutation.isPending ? "Guardando..." : "Vincular archivo"}
          </button>
        </form>
      </div>
    </div>
  );
};
