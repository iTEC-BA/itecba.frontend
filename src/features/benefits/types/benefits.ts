export type BenefitCategory = "medrano" | "campus" | "digital";

export interface RedemptionRecord {
  _id: string;
  userId: string;
  userEmail: string;
  benefitTitle: string;
  pointsCost: number;
  payload: Record<string, unknown>;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface Benefit {
  _id: string;
  id?: string;
  title: string;
  description: string;
  discount: string;
  location: string;
  category: BenefitCategory;
  img?: string;
  icon?: string;
  pointsCost: number;
  isActive: boolean;
  order: number;
}

export type BenefitFormData = Omit<Benefit, "_id" | "id" | "isActive" | "order">;

export type BenefitFilter = "all" | "free" | "points";

export interface RedemptionPayload {
  contact: string;
  notes?: string;
}

export const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  medrano: { label: "Medrano", color: "text-itec-sky" },
  campus: { label: "Campus", color: "text-itec-emerald" },
  digital: { label: "Digital", color: "text-itec-purple" }
};

export const isFreeBenefit = (benefit: Benefit): boolean => !benefit.pointsCost || benefit.pointsCost <= 0;
