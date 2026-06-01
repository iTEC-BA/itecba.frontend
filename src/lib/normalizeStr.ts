// src/lib/normalizeStr.ts
// Elimina tildes, viñetas y caracteres especiales para búsquedas robustas.
// "Álgebra y Análisis" → "algebra y analisis"
export const normalizeStr = (str: string): string =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // quita diacríticos/tildes
    .replace(/[^\w\s]/g, "")           // quita viñetas y chars especiales
    .toLowerCase()
    .trim();
