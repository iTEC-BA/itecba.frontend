import { create } from "zustand";
import type { Reward } from "../types/rewards";

interface RewardStore {
  filterType: string;
  searchQuery: string;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingReward: Reward | null;
  deletingReward: Reward | null;
  successMessage: string | null;

  setFilterType: (t: string) => void;
  setSearchQuery: (q: string) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (r: Reward) => void;
  closeEditModal: () => void;
  openDeleteModal: (r: Reward) => void;
  closeDeleteModal: () => void;
  setSuccessMessage: (msg: string | null) => void;
}

export const useRewardStore = create<RewardStore>((set) => ({
  filterType: "all",
  searchQuery: "",
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  editingReward: null,
  deletingReward: null,
  successMessage: null,

  setFilterType: (filterType) => set({ filterType }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  openEditModal: (editingReward) => set({ isEditModalOpen: true, editingReward }),
  closeEditModal: () => set({ isEditModalOpen: false, editingReward: null }),
  openDeleteModal: (deletingReward) => set({ isDeleteModalOpen: true, deletingReward }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, deletingReward: null }),
  setSuccessMessage: (successMessage) => set({ successMessage }),
}));
