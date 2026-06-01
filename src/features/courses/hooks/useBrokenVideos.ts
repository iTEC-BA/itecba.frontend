// src/features/courses/hooks/useBrokenVideos.ts
// Hook que encapsula fetch, fix, delete y clear-reports de videos rotos.
// Separa lógica de efecto de la UI del BrokenVideosModal.
import { useState, useCallback } from "react";
import { auth } from "@lib/firebase";

export interface BrokenVideo {
  courseId:    string;
  courseTitle: string;
  materia:     string;
  video: {
    _id:         string;
    youtubeId:   string;
    title:       string;
    duration:    string;
    isBroken:    boolean;
    reportCount: number;
  };
}

const API_URL   = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const getToken  = async (): Promise<string> =>
  (await auth.currentUser?.getIdToken()) ?? "";

export const useBrokenVideos = () => {
  const [items,     setItems]     = useState<BrokenVideo[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchBroken = useCallback(async () => {
    setLoading(true);
    setStatusMsg("");
    try {
      const token = await getToken();
      const res   = await fetch(`${API_URL}/courses/admin/broken-videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.broken ?? []);
    } catch {
      setStatusMsg("Error al cargar videos rotos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fixVideo = useCallback(
    async (courseId: string, videoId: string, newYtId: string) => {
      if (!newYtId.trim()) return;
      try {
        const token = await getToken();
        const res   = await fetch(
          `${API_URL}/courses/${courseId}/videos/${videoId}`,
          {
            method:  "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify({ youtubeId: newYtId.trim() }),
          }
        );
        if (!res.ok) throw new Error();
        setStatusMsg("Video corregido ✓");
        await fetchBroken();
      } catch {
        setStatusMsg("Error al corregir el video.");
      }
    },
    [fetchBroken]
  );

  const deleteVideo = useCallback(
    async (courseId: string, videoId: string) => {
      try {
        const token = await getToken();
        const res   = await fetch(
          `${API_URL}/courses/${courseId}/videos/${videoId}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error();
        setStatusMsg("Video eliminado ✓");
        await fetchBroken();
      } catch {
        setStatusMsg("Error al eliminar el video.");
      }
    },
    [fetchBroken]
  );

  const clearReports = useCallback(
    async (courseId: string, videoId: string) => {
      try {
        const token = await getToken();
        const res   = await fetch(
          `${API_URL}/courses/${courseId}/videos/${videoId}/reports`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error();
        setStatusMsg("Reportes limpiados ✓");
        await fetchBroken();
      } catch {
        setStatusMsg("Error al limpiar los reportes.");
      }
    },
    [fetchBroken]
  );

  return {
    items,
    loading,
    statusMsg,
    fetchBroken,
    fixVideo,
    deleteVideo,
    clearReports,
  };
};
