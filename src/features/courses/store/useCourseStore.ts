// src/features/courses/store/useCourseStore.ts
//
// Este store maneja ÚNICAMENTE el estado de UI de la feature courses.
// El estado del servidor (lista de cursos, caché) sigue en React Query (useCourses.ts).
//
// Sepación de responsabilidades:
//   React Query → server state (fetch, caché, mutaciones)
//   Zustand     → UI state (filtros, modal abierto, video activo, progreso local)
//
// Para usar Zustand, instalar si no está:
//   npm install zustand

import { create } from "zustand";
import type { CategoriaFilter } from "../types/Filters";

// ── Tipos del store ───────────────────────────────────────────────────────────
interface CourseUIState {
  // Filtros de búsqueda
  searchQuery: string;
  selectedMateria: string;
  selectedCategoria: CategoriaFilter;

  // Modales
  isAddModalOpen: boolean;
  isViewResourcesModalOpen: boolean;
  isAddResourceModalOpen: boolean;

  // Player
  currentVideoIndex: number;
  watchedVideos: Record<string, Set<string>>; // courseId → Set<youtubeId>

  // Acciones — Filtros
  setSearchQuery: (q: string) => void;
  setSelectedMateria: (m: string) => void;
  setSelectedCategoria: (c: CategoriaFilter) => void;
  clearFilters: () => void;

  // Acciones — Modales
  openAddModal: () => void;
  closeAddModal: () => void;
  openViewResourcesModal: () => void;
  closeViewResourcesModal: () => void;
  openAddResourceModal: () => void;
  closeAddResourceModal: () => void;

  // Acciones — Player
  setCurrentVideoIndex: (index: number) => void;
  toggleWatched: (courseId: string, youtubeId: string) => void;
  loadWatchedFromStorage: (courseId: string, userId: string) => void;
  persistWatched: (courseId: string, userId: string) => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useCourseStore = create<CourseUIState>((set, get) => ({
  // Estado inicial
  searchQuery: "",
  selectedMateria: "",
  selectedCategoria: "",
  isAddModalOpen: false,
  isViewResourcesModalOpen: false,
  isAddResourceModalOpen: false,
  currentVideoIndex: 0,
  watchedVideos: {},

  // ── Filtros ────────────────────────────────────────────────────────────────
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedMateria: (m) => set({ selectedMateria: m }),
  setSelectedCategoria: (c) => set({ selectedCategoria: c }),
  clearFilters: () =>
    set({ searchQuery: "", selectedMateria: "", selectedCategoria: "" }),

  // ── Modales ────────────────────────────────────────────────────────────────
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  openViewResourcesModal: () => set({ isViewResourcesModalOpen: true }),
  closeViewResourcesModal: () => set({ isViewResourcesModalOpen: false }),
  openAddResourceModal: () => set({ isAddResourceModalOpen: true }),
  closeAddResourceModal: () => set({ isAddResourceModalOpen: false }),

  // ── Player ─────────────────────────────────────────────────────────────────
  setCurrentVideoIndex: (index) => set({ currentVideoIndex: index }),

  toggleWatched: (courseId, youtubeId) => {
    const current = get().watchedVideos;
    const courseSet = new Set(current[courseId] ?? []);
    if (courseSet.has(youtubeId)) courseSet.delete(youtubeId);
    else courseSet.add(youtubeId);
    set({ watchedVideos: { ...current, [courseId]: courseSet } });
  },

  loadWatchedFromStorage: (courseId, userId) => {
    try {
      const key = `itec_course_progress_${userId}_${courseId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const arr: string[] = JSON.parse(stored);
        const current = get().watchedVideos;
        set({ watchedVideos: { ...current, [courseId]: new Set(arr) } });
      }
    } catch {
      console.error("[CourseStore] Error cargando progreso desde localStorage");
    }
  },

  persistWatched: (courseId, userId) => {
    try {
      const key = `itec_course_progress_${userId}_${courseId}`;
      const courseSet = get().watchedVideos[courseId] ?? new Set();
      localStorage.setItem(key, JSON.stringify(Array.from(courseSet)));
    } catch {
      console.error("[CourseStore] Error guardando progreso en localStorage");
    }
  },
}));

// ── Selectores derivados (evitan re-renders innecesarios) ─────────────────────
// IMPORTANTE: estos selectores devuelven un objeto NUEVO en cada llamada.
// SIEMPRE deben consumirse envueltos en useShallow (zustand/shallow):
//   const x = useCourseStore(useShallow(selectPlayer));
// Usarlos sin useShallow provoca renders infinitos
// ("Maximum update depth exceeded").

export const selectFilters = (s: CourseUIState) => ({
  searchQuery: s.searchQuery,
  selectedMateria: s.selectedMateria,
  selectedCategoria: s.selectedCategoria,
  setSearchQuery: s.setSearchQuery,
  setSelectedMateria: s.setSelectedMateria,
  setSelectedCategoria: s.setSelectedCategoria,
  clearFilters: s.clearFilters,
});

export const selectModals = (s: CourseUIState) => ({
  isAddModalOpen: s.isAddModalOpen,
  isViewResourcesModalOpen: s.isViewResourcesModalOpen,
  isAddResourceModalOpen: s.isAddResourceModalOpen,
  openAddModal: s.openAddModal,
  closeAddModal: s.closeAddModal,
  openViewResourcesModal: s.openViewResourcesModal,
  closeViewResourcesModal: s.closeViewResourcesModal,
  openAddResourceModal: s.openAddResourceModal,
  closeAddResourceModal: s.closeAddResourceModal,
});

export const selectPlayer = (s: CourseUIState) => ({
  currentVideoIndex: s.currentVideoIndex,
  watchedVideos: s.watchedVideos,
  setCurrentVideoIndex: s.setCurrentVideoIndex,
  toggleWatched: s.toggleWatched,
  loadWatchedFromStorage: s.loadWatchedFromStorage,
  persistWatched: s.persistWatched,
});
