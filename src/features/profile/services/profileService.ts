const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface Benefit {
  _id:      string;
  title:    string;
  discount: string;
  location: string;
  category: "medrano" | "campus" | "digital";
  logoUrl?: string;
}

export interface BenefitsResponse {
  benefits: Benefit[];
}

export const profileService = {
  async getBenefits(category?: string): Promise<Benefit[]> {
    const params = category ? `?category=${category}` : "";
    const res = await fetch(`${BASE_URL}/benefits${params}`);
    if (!res.ok) throw new Error("Error al cargar beneficios");
    const data: BenefitsResponse = await res.json();
    return data.benefits;
  },

  async updateProfile(uid: string, token: string, data: Record<string, unknown>): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/${uid}/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).message ?? "Error al actualizar perfil");
    }
  },
};
