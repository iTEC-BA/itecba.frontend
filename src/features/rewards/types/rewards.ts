export type RewardType = "mentorship" | "group_access" | "discount" | "resource" | "event";
export type RewardTier = "bronze" | "silver" | "gold" | "platinum";

export interface Reward {
  id: string;
  _id?: string;
  title: string;
  description: string;
  pointsCost: number;
  type: RewardType;
  icon: string;
  isActive?: boolean;
  tier?: RewardTier;
  stock?: number;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RedemptionPayload {
  rewardId: string;
  contact: string;
  date?: string;
  time?: string;
  notes?: string;
}

export interface RedemptionRecord {
  _id: string;
  userId: string;
  userEmail: string;
  rewardTitle: string;
  pointsCost: number;
  payload: Record<string, unknown>;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface InboxMessage {
  _id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface RewardFormData {
  title: string;
  description: string;
  pointsCost: number;
  type: RewardType;
  icon: string;
  tier: RewardTier;
  stock: number;
}

export const REWARD_TYPE_CONFIG: Record<RewardType, {
  label: string;
  icon: string;
  cls: string;
  bgGlow: string;
  description: string;
}> = {
  mentorship: {
    label: "Mentoría",
    icon: "users",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    bgGlow: "rgba(59,130,246,0.08)",
    description: "Sesión 1:1 con un tutor",
  },
  group_access: {
    label: "Acceso Grupo",
    icon: "message",
    cls: "bg-green-500/10 text-green-400 border-green-500/20",
    bgGlow: "rgba(0,136,84,0.08)",
    description: "Acceso a grupo privado",
  },
  discount: {
    label: "Descuento",
    icon: "lightning",
    cls: "bg-itec-rewards/10 text-itec-rewards border-itec-rewards/20",
    bgGlow: "rgba(240,177,0,0.08)",
    description: "Descuento en cursos/productos",
  },
  resource: {
    label: "Recurso",
    icon: "book",
    cls: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    bgGlow: "rgba(168,85,247,0.08)",
    description: "Material exclusivo",
  },
  event: {
    label: "Evento",
    icon: "calendar",
    cls: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    bgGlow: "rgba(249,115,22,0.08)",
    description: "Acceso a evento especial",
  },
};

export const REWARD_TIER_CONFIG: Record<RewardTier, {
  label: string;
  cls: string;
  minPoints: number;
}> = {
  bronze: {
    label: "Bronce",
    cls: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    minPoints: 0,
  },
  silver: {
    label: "Plata",
    cls: "text-slate-300 border-slate-400/30 bg-slate-400/10",
    minPoints: 200,
  },
  gold: {
    label: "Oro",
    cls: "text-itec-rewards border-itec-rewards/30 bg-itec-rewards/10",
    minPoints: 500,
  },
  platinum: {
    label: "Platino",
    cls: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
    minPoints: 1000,
  },
};
