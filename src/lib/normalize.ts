/**
 * Elimina tildes, diéresis y caracteres especiales de un string para
 * comparaciones de búsqueda insensibles a acentuación.
 *
 * Ejemplos:
 *   normalizeSearch("Álgebra") → "algebra"
 *   normalizeSearch("  Análisis Matemático  ") → "analisis matematico"
 */
export const normalizeSearch = (str: string): string =>
  (str ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Quita diacríticos (tildes, diéresis…)
    .replace(/[^\w\s]/g, "")           // Quita viñetas y chars especiales
    .toLowerCase()
    .trim();
