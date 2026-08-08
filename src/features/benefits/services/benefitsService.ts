import type {
  Benefit,
  BenefitFormData,
  RedemptionPayload,
  RedemptionRecord,
} from "../types/benefits";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const benefitsService = {
  getBenefits: async (token?: string): Promise<Benefit[]> => {
    const res = await fetch(`${API_URL}/benefits`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error("Error al cargar beneficios");
    const data = await res.json();
    return data.benefits ?? [];
  },

  getAllBenefits: async (token: string): Promise<Benefit[]> => {
    const res = await fetch(`${API_URL}/benefits/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al cargar el catálogo");
    const data = await res.json();
    return data.benefits ?? [];
  },

  saveBenefit: async (
    payload: Partial<BenefitFormData>,
    editId: string | null,
    token: string,
  ): Promise<Benefit> => {
    const url = editId
      ? `${API_URL}/benefits/${editId}`
      : `${API_URL}/benefits`;
    const method = editId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.message ?? "Error al guardar el beneficio");
    }
    const data = await res.json();
    return data.benefit;
  },

  deleteBenefit: async (id: string, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/benefits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al desactivar el beneficio");
  },

  redeemBenefit: async (
    payload: RedemptionPayload,
    benefitId: string,
    token: string,
  ) => {
    const res = await fetch(`${API_URL}/benefits/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ benefitId, payload }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.message ?? "Error al canjear");
    }
    return res.json();
  },

  getAllRedemptions: async (token: string): Promise<RedemptionRecord[]> => {
    const res = await fetch(`${API_URL}/benefits/redemptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al cargar canjes");
    const data = await res.json();
    return data.redemptions ?? [];
  },
};
