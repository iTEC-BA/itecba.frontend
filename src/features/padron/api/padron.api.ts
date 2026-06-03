import { PadronResponse } from "../types/padron.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const fetchPadronUTN = async (dni: string): Promise<PadronResponse> => {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 45_000); // 45 s — Puppeteer + OCR

  try {
    const response = await fetch(`${API_URL}/padron/consultar`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ dni }),
      signal:  controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body.error ?? `Error del servidor (${response.status}).` };
    }

    return await response.json();
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === "AbortError") {
      return { success: false, error: "La consulta tardó demasiado. El servidor puede estar ocupado; intentá de nuevo." };
    }
    return { success: false, error: "No se pudo conectar con el servidor." };
  }
};
