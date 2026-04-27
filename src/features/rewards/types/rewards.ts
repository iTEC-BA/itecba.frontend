export type RewardType = 'mentorship' | 'group_access' | 'discount';

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: RewardType;
  icon: string;
}

export interface RedemptionPayload {
  rewardId: string;
  contact: string;
  date?: string;
  time?: string;
  notes?: string;
}