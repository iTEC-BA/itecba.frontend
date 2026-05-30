// ─── Reward Types ────────────────────────────────────────────────
export type RewardType =
  | "mentorship"
  | "group_access"
  | "discount"
  | "resource"
  | "event";
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

/** Mensaje del admin (buzón de recompensas) */
export interface InboxMessage {
  _id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  /** Título de la recompensa asociada (si viene del admin al responder un canje) */
  rewardTitle?: string;
  /** Categoría: distingue mensajes de reward vs avisos generales */
  category?: "reward_reply" | "general";
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

export const REWARD_TYPE_CONFIG: Record<
  RewardType,
  {
    label: string;
    icon: string;
    cls: string;
    bgGlow: string;
    description: string;
  }
> = {
  mentorship: {
    label: "Mentoría",
    icon: "users",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    bgGlow: "rgba(59,130,246,0.08)",
    description: "Sesión personalizada",
  },
  group_access: {
    label: "Acceso Grupo",
    icon: "lock",
    cls: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    bgGlow: "rgba(168,85,247,0.08)",
    description: "Acceso a grupo privado",
  },
  discount: {
    label: "Descuento",
    icon: "tag",
    cls: "bg-green-500/10 text-green-400 border-green-500/20",
    bgGlow: "rgba(34,197,94,0.08)",
    description: "Descuento exclusivo",
  },
  resource: {
    label: "Recurso",
    icon: "file",
    cls: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    bgGlow: "rgba(249,115,22,0.08)",
    description: "Material exclusivo",
  },
  event: {
    label: "Evento",
    icon: "calendar",
    cls: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    bgGlow: "rgba(236,72,153,0.08)",
    description: "Evento especial",
  },
};

export const REWARD_TIER_CONFIG: Record<
  RewardTier,
  {
    label: string;
    cls: string;
    description: string;
  }
> = {
  bronze: {
    label: "Bronce",
    cls: "bg-amber-600/10 text-amber-400 border-amber-500/20",
    description: "Nivel inicial",
  },
  silver: {
    label: "Plata",
    cls: "bg-slate-400/10 text-slate-300 border-slate-400/20",
    description: "Nivel intermedio",
  },
  gold: {
    label: "Oro",
    cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    description: "Nivel avanzado",
  },
  platinum: {
    label: "Platino",
    cls: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    description: "Nivel premium",
  },
};
