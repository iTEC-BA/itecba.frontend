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

export interface RedemptionRecord {
  _id: string;
  userId: string;
  userEmail: string;
  rewardTitle: string;
  pointsCost: number;
  payload: any;
  status: string;
  createdAt: string;
}

export interface InboxMessage {
  _id: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}