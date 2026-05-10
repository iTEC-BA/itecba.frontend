// src/features/courses/hooks/useReportVideo.ts
// Hook para reportar videos rotos al backend
import { useState } from "react";
import { auth } from "@lib/firebase";

type ReportReason = "no-reproduce" | "error-404" | "privado" | "contenido-incorrecto";

interface UseReportVideoReturn {
  report:      (courseId: string, videoId: string, reason: ReportReason) => Promise<void>;
  isLoading:   boolean;
  isSuccess:   boolean;
  isError:     boolean;
  errorMsg:    string;
  reset:       () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const useReportVideo = (): UseReportVideoReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError,   setIsError]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState("");

  const report = async (courseId: string, videoId: string, reason: ReportReason) => {
    if (!courseId || !videoId) return;
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Debes iniciar sesión para reportar");

      const res = await fetch(
        `${API_URL}/courses/${courseId}/videos/${videoId}/report`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ reason }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar el reporte");

      setIsSuccess(true);
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.message ?? "Error al reportar");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMsg("");
  };

  return { report, isLoading, isSuccess, isError, errorMsg, reset };
};
